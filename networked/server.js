/* ============================================================
   AI Judgment Micro-Intervention Pilot — Networked Server
   Pure Node.js — ZERO external dependencies
   Implements WebSocket RFC 6455 handshake + framing natively
   ============================================================ */

const http   = require("http");
const crypto = require("crypto");
const fs     = require("fs");
const path   = require("path");

// ── Config ──
const PORT     = Number(process.env.PORT) || 3000;
const HOST     = process.env.HOST || "0.0.0.0";
const DATA_DIR = path.join(__dirname, "data");
const MATERIAL_CANDIDATES = {
  zh: [
    path.join(__dirname, "..", "prototype", "materials_v1.json"),
    path.join(__dirname, "..", "materials_v1.json")
  ],
  en: [
    path.join(__dirname, "..", "prototype", "materials_en.json")
  ]
};

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadMaterials(lang, required = false) {
  const candidates = MATERIAL_CANDIDATES[lang] || [];
  let lastError = null;

  for (const fp of candidates) {
    try {
      return {
        data: JSON.parse(fs.readFileSync(fp, "utf8")),
        path: fp
      };
    } catch (e) {
      lastError = e;
    }
  }

  if (required) {
    console.error(`[boot] FATAL: cannot load materials for lang=${lang}:`, lastError?.message || "unknown error");
    process.exit(1);
  }

  console.warn(`[boot] WARN: cannot load materials for lang=${lang}; falling back to zh:`, lastError?.message || "unknown error");
  return null;
}

const MATERIALS_LOADED = {
  zh: loadMaterials("zh", true),
  en: loadMaterials("en", false)
};

const MATERIALS_BY_LANG = {
  zh: MATERIALS_LOADED.zh.data,
  en: MATERIALS_LOADED.en?.data || null
};

console.log(
  `[boot] materials loaded – zh=${MATERIALS_BY_LANG.zh.items.length} items (${path.relative(__dirname, MATERIALS_LOADED.zh.path)})` +
  (MATERIALS_BY_LANG.en
    ? `, en=${MATERIALS_BY_LANG.en.items.length} items (${path.relative(__dirname, MATERIALS_LOADED.en.path)})`
    : ", en=missing (fallback to zh)")
);

function normalizeLang(value) {
  return value === "en" ? "en" : "zh";
}

function getMaterialsForLang(lang) {
  const normalized = normalizeLang(lang);
  return MATERIALS_BY_LANG[normalized] || MATERIALS_BY_LANG.zh;
}

/* ============================================================
   Minimal WebSocket Server (RFC 6455)
   ============================================================ */
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

class WsConnection {
  constructor(socket, head) {
    this.socket = socket;
    this.readyState = 1; // OPEN
    this._buffer = head || Buffer.alloc(0);

    socket.setNoDelay(true);
    socket.on("data", (chunk) => this._onData(chunk));
    socket.on("close", () => { 
      this.readyState = 3; 
      if (this.onclose) this.onclose(); 
    });
    socket.on("error", (err) => { 
      console.error("[ws] socket error:", err.message);
      this.readyState = 3; 
      if (this.onclose) this.onclose();
    });

    // We MUST wait for the application to set 'onmessage' etc. 
    // before we start processing the buffer from 'head'.
    setImmediate(() => {
      if (this._buffer.length > 0) {
        this._onData(Buffer.alloc(0)); 
      }
    });
  }

  send(data) {
    if (this.readyState !== 1) return;
    const payload = typeof data === "string" ? Buffer.from(data, "utf8") : data;
    const frame = this._buildFrame(0x01, payload); // text frame
    try { this.socket.write(frame); } catch {}
  }

  close() {
    if (this.readyState !== 1) return;
    this.readyState = 2;
    try {
      this.socket.write(this._buildFrame(0x08, Buffer.alloc(0)));
      this.socket.end();
    } catch {}
    this.readyState = 3;
  }

  ping() {
    if (this.readyState !== 1) return;
    try { this.socket.write(this._buildFrame(0x09, Buffer.alloc(0))); } catch {}
  }

  _buildFrame(opcode, payload) {
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.alloc(2);
      header[0] = 0x80 | opcode; // FIN + opcode
      header[1] = len;
    } else if (len < 65536) {
      header = Buffer.alloc(4);
      header[0] = 0x80 | opcode;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x80 | opcode;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }
    return Buffer.concat([header, payload]);
  }

  _onData(chunk) {
    this._buffer = Buffer.concat([this._buffer, chunk]);
    while (this._buffer.length >= 2) {
      const parsed = this._parseFrame(this._buffer);
      if (!parsed) break; // incomplete frame
      this._buffer = this._buffer.slice(parsed.totalLen);
      this._handleFrame(parsed);
    }
  }

  _parseFrame(buf) {
    if (buf.length < 2) return null;
    const byte1 = buf[0];
    const byte2 = buf[1];
    const opcode = byte1 & 0x0f;
    const masked = (byte2 & 0x80) !== 0;
    let payloadLen = byte2 & 0x7f;
    let offset = 2;

    if (payloadLen === 126) {
      if (buf.length < 4) return null;
      payloadLen = buf.readUInt16BE(2);
      offset = 4;
    } else if (payloadLen === 127) {
      if (buf.length < 10) return null;
      payloadLen = Number(buf.readBigUInt64BE(2));
      offset = 10;
    }

    const maskLen = masked ? 4 : 0;
    const totalLen = offset + maskLen + payloadLen;
    if (buf.length < totalLen) return null;

    let payload;
    if (masked) {
      const maskKey = buf.slice(offset, offset + 4);
      payload = Buffer.alloc(payloadLen);
      for (let i = 0; i < payloadLen; i++) {
        payload[i] = buf[offset + 4 + i] ^ maskKey[i % 4];
      }
    } else {
      payload = buf.slice(offset, offset + payloadLen);
    }

    return { opcode, payload, totalLen };
  }

  _handleFrame({ opcode, payload }) {
    switch (opcode) {
      case 0x01: // text
        if (this.onmessage) this.onmessage(payload.toString("utf8"));
        break;
      case 0x08: // close
        this.close();
        break;
      case 0x09: // ping → pong
        if (this.readyState === 1) {
          try { this.socket.write(this._buildFrame(0x0a, payload)); } catch {}
        }
        break;
      case 0x0a: // pong
        if (this.onpong) this.onpong();
        break;
    }
  }
}

/* ============================================================
   Session Store
   ============================================================ */
const sessions = new Map();

function emptySession(pid) {
  return {
    participantId: pid,
    lang: "zh",
    connectedAt: new Date().toISOString(),
    ws: null,
    currentStage: "consent",
    stageIndex: 0,
    stageTotal: 0,
    pretestResponses: [],
    posttestResponses: [],
    sceneResponses: [],
    profileRecommendation: null,
    selectedProfiles: [],
    profileOverride: false,
    operatorNotes: [],
    interviewResponses: {},
    interactionPattern: { primary: "", secondary: "", note: "" },
    posttestItemOrder: [],
    lastHeartbeat: Date.now(),
    exportedAt: null
  };
}

function sessionSnapshot(s) {
  const { ws, ...rest } = s;
  return { ...rest, online: !!(ws && ws.readyState === 1) };
}

function allSnapshots() {
  return [...sessions.values()].map(sessionSnapshot);
}

function persistSession(pid) {
  const s = sessions.get(pid);
  if (!s) return;
  const snap = sessionSnapshot(s);
  const fp = path.join(DATA_DIR, `${pid}_session.json`);
  fs.writeFileSync(fp, JSON.stringify(snap, null, 2));
}

/* ============================================================
   Operator connections
   ============================================================ */
const operatorSockets = new Set();

function broadcastToOperators(msg) {
  const data = JSON.stringify(msg);
  for (const ws of operatorSockets) {
    if (ws.readyState === 1) ws.send(data);
  }
}

function sendToParticipant(pid, msg) {
  const s = sessions.get(pid);
  if (s && s.ws && s.ws.readyState === 1) {
    s.ws.send(JSON.stringify(msg));
  }
}

/* ============================================================
   HTTP Static Server
   ============================================================ */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon"
};

function serveStatic(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let url = parsedUrl.pathname;

  // API endpoints
  if (url === "/api/materials") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(getMaterialsForLang(parsedUrl.searchParams.get("lang"))));
    return;
  }
  if (url === "/api/sessions") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(allSnapshots()));
    return;
  }

  // Route shortcuts
  if (url === "/") {
    res.writeHead(302, { "Location": "/participant/" });
    res.end();
    return;
  }
  if (url === "/participant") {
    res.writeHead(302, { "Location": "/participant/" });
    res.end();
    return;
  }
  if (url === "/dashboard") {
    res.writeHead(302, { "Location": "/dashboard/" });
    res.end();
    return;
  }

  if (url === "/participant/") url = "/participant/index.html";
  if (url === "/dashboard/") url = "/dashboard/index.html";

  const filePath = path.join(__dirname, url);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found: " + url);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(serveStatic);

/* ============================================================
   WebSocket Upgrade Handler
   ============================================================ */
server.on("upgrade", (req, socket, head) => {
  const key = req.headers["sec-websocket-key"];
  if (!key) { socket.destroy(); return; }

  const acceptKey = crypto
    .createHash("sha1")
    .update(key + WS_GUID)
    .digest("base64");

  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
    "Upgrade: websocket\r\n" +
    "Connection: Upgrade\r\n" +
    `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
    "\r\n"
  );

  const ws = new WsConnection(socket, head);
  handleWsConnection(ws);
});

/* ============================================================
   WebSocket Message Handling
   ============================================================ */
function handleWsConnection(ws) {
  let role = null;
  let pid = null;
  ws.isAlive = true;

  ws.onpong = () => { ws.isAlive = true; };

  ws.onmessage = (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      case "join": {
        if (msg.role === "operator") {
          role = "operator";
          operatorSockets.add(ws);
          ws.send(JSON.stringify({
            type: "joined",
            role: "operator",
            activeSessions: allSnapshots()
          }));
          console.log(`[ws] operator connected (total ${operatorSockets.size})`);
          return;
        }

        role = "participant";
        pid = (msg.participantId || "").trim();
        if (!pid) { ws.send(JSON.stringify({ type: "error", message: "Missing participantId" })); return; }

        if (!sessions.has(pid)) {
          sessions.set(pid, emptySession(pid));
          console.log(`[ws] new participant: ${pid}`);
        } else {
          console.log(`[ws] participant reconnected: ${pid}`);
        }
        const sess = sessions.get(pid);
        sess.ws = ws;
        sess.lang = normalizeLang(msg.lang);
        sess.lastHeartbeat = Date.now();

        broadcastToOperators({
          type: "participant_joined",
          participant: sessionSnapshot(sess)
        });

        ws.send(JSON.stringify({
          type: "joined",
          role: "participant",
          sessionId: `sess_${pid}`,
          session: sessionSnapshot(sess),
          materials: getMaterialsForLang(sess.lang)
        }));
        break;
      }

      case "stage_change": {
        if (role !== "participant" || !pid) return;
        const sess = sessions.get(pid);
        if (!sess) return;
        sess.currentStage = msg.stage;
        sess.stageIndex = msg.stageIndex ?? 0;
        sess.stageTotal = msg.stageTotal ?? 0;
        broadcastToOperators({
          type: "stage_update",
          participantId: pid,
          stage: msg.stage,
          stageIndex: msg.stageIndex,
          stageTotal: msg.stageTotal,
          timestamp: new Date().toISOString()
        });
        persistSession(pid);
        break;
      }

      case "response": {
        if (role !== "participant" || !pid) return;
        const sess = sessions.get(pid);
        if (!sess) return;
        const resp = msg.response;
        if (msg.phase === "pretest") {
          sess.pretestResponses.push(resp);
          sess.stageIndex = sess.pretestResponses.length;
        } else if (msg.phase === "posttest") {
          sess.posttestResponses.push(resp);
          sess.stageIndex = sess.posttestResponses.length;
        } else if (msg.phase === "scene") {
          sess.sceneResponses.push(resp);
          sess.stageIndex = sess.sceneResponses.length;
        }
        broadcastToOperators({
          type: "response_received",
          participantId: pid,
          phase: msg.phase,
          response: resp,
          stageIndex: sess.stageIndex,
          timestamp: new Date().toISOString()
        });
        persistSession(pid);
        break;
      }

      case "profile_ready": {
        if (role !== "participant" || !pid) return;
        const sess = sessions.get(pid);
        if (!sess) return;
        sess.profileRecommendation = msg.recommendation;
        sess.currentStage = "profile_waiting";
        broadcastToOperators({
          type: "profile_needs_approval",
          participantId: pid,
          recommendation: msg.recommendation,
          timestamp: new Date().toISOString()
        });
        persistSession(pid);
        break;
      }

      case "posttest_order": {
        if (role !== "participant" || !pid) return;
        const sess = sessions.get(pid);
        if (!sess) return;
        sess.posttestItemOrder = msg.order;
        persistSession(pid);
        break;
      }

      // ── Operator actions ──
      case "approve_profile": {
        if (role !== "operator") return;
        const target = msg.participantId;
        const sess = sessions.get(target);
        if (!sess) return;
        sess.selectedProfiles = msg.selectedProfiles;
        sess.profileOverride = msg.overrideNote || false;
        sess.currentStage = "scenes";
        sess.stageIndex = 0;
        sendToParticipant(target, {
          type: "profile_approved",
          selectedProfiles: msg.selectedProfiles,
          overrideNote: msg.overrideNote || ""
        });
        broadcastToOperators({
          type: "stage_update",
          participantId: target,
          stage: "scenes",
          stageIndex: 0,
          stageTotal: msg.selectedProfiles.length * 2,
          timestamp: new Date().toISOString()
        });
        persistSession(target);
        console.log(`[op] approved profile for ${target}: ${msg.selectedProfiles.join(", ")}`);
        break;
      }

      case "add_observation": {
        if (role !== "operator") return;
        const target = msg.participantId;
        const sess = sessions.get(target);
        if (!sess) return;
        sess.operatorNotes.push({ scene_id: msg.sceneId, note: msg.note, timestamp: new Date().toISOString() });
        persistSession(target);
        break;
      }

      case "send_nudge": {
        if (role !== "operator") return;
        sendToParticipant(msg.participantId, { type: "nudge", message: msg.message });
        broadcastToOperators({
          type: "event_log",
          participantId: msg.participantId,
          event: "nudge_sent",
          detail: msg.message,
          timestamp: new Date().toISOString()
        });
        break;
      }

      case "save_interview": {
        if (role !== "operator") return;
        const target = msg.participantId;
        const sess = sessions.get(target);
        if (!sess) return;
        sess.interviewResponses = msg.responses;
        sendToParticipant(target, { type: "interview_complete" });
        broadcastToOperators({
          type: "stage_update",
          participantId: target,
          stage: "debrief",
          stageIndex: 0,
          stageTotal: 0,
          timestamp: new Date().toISOString()
        });
        sess.currentStage = "debrief";
        persistSession(target);
        break;
      }

      case "save_pattern": {
        if (role !== "operator") return;
        const target = msg.participantId;
        const sess = sessions.get(target);
        if (!sess) return;
        sess.interactionPattern = msg.pattern;
        persistSession(target);
        break;
      }

      case "export_session": {
        if (role !== "operator") return;
        const target = msg.participantId;
        const sess = sessions.get(target);
        if (!sess) return;
        sess.exportedAt = new Date().toISOString();
        const snap = sessionSnapshot(sess);
        fs.writeFileSync(path.join(DATA_DIR, `${target}_final.json`), JSON.stringify(snap, null, 2));
        ws.send(JSON.stringify({ type: "export_ready", participantId: target, data: snap }));
        console.log(`[op] exported session for ${target}`);
        break;
      }

      case "export_all": {
        if (role !== "operator") return;
        const all = allSnapshots();
        fs.writeFileSync(path.join(DATA_DIR, `batch_export_${Date.now()}.json`), JSON.stringify(all, null, 2));
        ws.send(JSON.stringify({ type: "export_all_ready", data: all }));
        console.log(`[op] batch export: ${all.length} sessions`);
        break;
      }

      case "heartbeat": {
        if (pid) {
          const sess = sessions.get(pid);
          if (sess) sess.lastHeartbeat = Date.now();
        }
        break;
      }
    }
  };

  ws.onclose = () => {
    if (role === "operator") {
      operatorSockets.delete(ws);
      console.log(`[ws] operator disconnected (remaining ${operatorSockets.size})`);
    }
    if (role === "participant" && pid) {
      const sess = sessions.get(pid);
      if (sess) sess.ws = null;
      broadcastToOperators({
        type: "participant_disconnected",
        participantId: pid,
        timestamp: new Date().toISOString()
      });
      console.log(`[ws] participant ${pid} disconnected`);
    }
  };
}

// ── Heartbeat check every 20s ──
const allWsConnections = new Set();
setInterval(() => {
  for (const [, sess] of sessions) {
    if (sess.ws && sess.ws.readyState === 1) {
      if (!sess.ws.isAlive) { sess.ws.close(); continue; }
      sess.ws.isAlive = false;
      sess.ws.ping();
    }
  }
  for (const ws of operatorSockets) {
    if (ws.readyState === 1) {
      if (!ws.isAlive) { ws.close(); operatorSockets.delete(ws); continue; }
      ws.isAlive = false;
      ws.ping();
    }
  }
}, 20000);

// ── Stale detection every 30s ──
setInterval(() => {
  const now = Date.now();
  for (const [pid, sess] of sessions) {
    if (sess.ws && sess.ws.readyState === 1 && now - sess.lastHeartbeat > 45000) {
      broadcastToOperators({
        type: "participant_stale",
        participantId: pid,
        lastHeartbeat: sess.lastHeartbeat,
        timestamp: new Date().toISOString()
      });
    }
  }
}, 30000);

/* ============================================================
   Start
   ============================================================ */
server.listen(PORT, HOST, () => {
  const nets = require("os").networkInterfaces();
  let lanIP = "localhost";
  outer: for (const iface of Object.values(nets)) {
    for (const cfg of iface) {
      if (cfg.family === "IPv4" && !cfg.internal) { 
        lanIP = cfg.address; 
        break outer; 
      }
    }
  }
  // Use actual listening host if not 0.0.0.0
  const displayIP = HOST === "0.0.0.0" ? lanIP : HOST;

  console.log(`
┌──────────────────────────────────────────────────────┐
│  AI Judgment Pilot Server  (zero dependencies)       │
│                                                      │
│  Participant:  http://${displayIP}:${PORT}/               │
│  Dashboard:    http://${displayIP}:${PORT}/dashboard/     │
│                                                      │
│  Data dir:     ${DATA_DIR}
└──────────────────────────────────────────────────────┘
  `);
});

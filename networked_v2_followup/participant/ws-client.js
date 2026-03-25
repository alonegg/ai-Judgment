/* ============================================================
   WebSocket Client — Participant Side
   Handles connection, reconnection, heartbeat, message routing
   ============================================================ */

const WS = (() => {
  let socket = null;
  let reconnectTimer = null;
  let heartbeatTimer = null;
  let _onMessage = null;      // callback: (msg) => void
  let _participantId = null;
  let _lang = "zh";
  let _connected = false;
  const HEARTBEAT_MS = 15000;
  const RECONNECT_MS = 3000;
  const MAX_RECONNECT_MS = 30000;
  let reconnectDelay = RECONNECT_MS;
  let messageQueue = [];       // queued while offline

  function getWsUrl() {
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${proto}//${location.host}`;
    console.log("[ws] Target URL:", url);
    return url;
  }

  function connect(participantId, lang, onMessage) {
    console.log("[ws] Initializing connection for:", participantId);
    _participantId = participantId;
    _lang = lang === "en" ? "en" : "zh";
    _onMessage = onMessage;
    _doConnect();
  }

  function _doConnect() {
    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
      console.log("[ws] Already connecting or open");
      return;
    }

    try {
      const url = getWsUrl();
      socket = new WebSocket(url);
    } catch (e) {
      console.error("[ws] Exception creating WebSocket:", e);
      _scheduleReconnect();
      return;
    }

    socket.onopen = () => {
      console.log("[ws] Socket opened successfully");
      _connected = true;
      reconnectDelay = RECONNECT_MS;

      // Join
      console.log("[ws] Sending join message...");
      _send({ type: "join", role: "participant", participantId: _participantId, lang: _lang });

      // Flush queue
      while (messageQueue.length > 0) {
        const m = messageQueue.shift();
        _send(m);
      }

      // Heartbeat
      clearInterval(heartbeatTimer);
      heartbeatTimer = setInterval(() => {
        _send({ type: "heartbeat" });
      }, HEARTBEAT_MS);
    };

    socket.onmessage = (evt) => {
      console.log("[ws] Data received:", evt.data.substring(0, 50) + "...");
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }
      if (_onMessage) _onMessage(msg);
    };

    socket.onclose = (event) => {
      console.log(`[ws] Socket closed (code=${event.code}, clean=${event.wasClean})`);
      _connected = false;
      clearInterval(heartbeatTimer);
      _scheduleReconnect();
      if (_onMessage) _onMessage({ type: "_disconnected" });
    };

    socket.onerror = (err) => {
      console.error("[ws] Socket error observed");
    };
  }

  function _scheduleReconnect() {
    clearTimeout(reconnectTimer);
    console.log(`[ws] Scheduling reconnect in ${reconnectDelay}ms`);
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 1.5, MAX_RECONNECT_MS);
      _doConnect();
    }, reconnectDelay);
  }

  function _send(msg) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      console.warn("[ws] Cannot send: socket not open");
    }
  }

  function send(msg) {
    if (_connected) {
      _send(msg);
    } else {
      if (msg.type !== "heartbeat") {
        console.log("[ws] Queueing message (offline):", msg.type);
        messageQueue.push(msg);
      }
    }
  }

  function isConnected() { return _connected; }

  function disconnect() {
    console.log("[ws] Manual disconnect");
    clearInterval(heartbeatTimer);
    clearTimeout(reconnectTimer);
    if (socket) socket.close();
  }

  return { connect, send, isConnected, disconnect };
})();

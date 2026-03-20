# Stitch Theme Reference

## Source
- MCP server: `stitch`
- Project: `projects/16808900056879515865`
- Screen: `projects/16808900056879515865/screens/2c2031805cec4b7a85316263c8c347b6`
- Screen title: `WarmUp Intro`

## Extracted Design Direction
- Style name: `Editorial Precision for Academic Research`
- Headline font: `Manrope`
- Body font: `Inter`
- Base surface: `#F8F9FA`
- Active card surface: `#FFFFFF`
- Section surface: `#F1F4F6`
- Primary color: `#005BC0`
- Tertiary accent: `#D8D3F4`
- Text color: `#2B3437`
- Muted text color: `#586064`

## Key Rules Captured From Stitch Screen Code
- Prefer layered surfaces over heavy 1px borders.
- Use `glass`-style instructional callouts with blur and a strong left accent bar.
- Keep progress indicators linear and high-contrast instead of playful dots.
- Use editorial typography hierarchy: bold headline, quieter body copy, uppercase metadata.
- Let primary CTAs feel lifted with gradient and soft blue shadow.
- Use `top nav + left guide rail + centered content card` as the core page arrangement for participant-facing screens.

## Local Adaptation
- `prototype/styles.css` now maps the local experiment shell to this Stitch palette and spacing system.
- `prototype/index.html` now follows the same top navigation, side guide rail, and centered content-column arrangement as the Stitch warmup screen.
- `networked/participant/styles.css` now follows the same participant-facing shell so local and networked runs share one visual language.
- `networked/participant/index.html` now mirrors the same arrangement so the networked participant flow is no longer only color-matched.
- `networked/dashboard/dashboard.css` adapts the same palette into an operator console with denser status cards and telemetry panels.
- Existing `app.js` rendering flow is preserved; only the presentation layer was changed.
- `prototype/index.html` imports `Manrope` and `Inter` so the local prototype can render the same core visual language.

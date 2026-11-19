/* ==========================================================
   js/effects.js : EXTRA FUN (confetti)
   ==========================================================
   Confetti when you reach the win tile: draw colored paper pieces on a temporary canvas.
   A <canvas> is a blank drawing sheet. Each frame we move every piece a little
   (gravity pulls it down) and redraw, about 60 times per second.
*/

function launchConfetti() {
  // Respect people who turned animations off in their device settings.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1000";
  const dpr = window.devicePixelRatio || 1;       // sharper on phone screens
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Confetti uses the colors of the CURRENT palette. We read them from the CSS variables.
  const styles = getComputedStyle(document.documentElement);
  const colors = ["--v8", "--v16", "--v32", "--v64", "--v128",
                  "--v256", "--v512", "--v1024", "--v2048"]
                  .map(name => styles.getPropertyValue(name).trim());

  const pieces = [];
  for (let i = 0; i < 140; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;   // mostly upward, spread sideways
    const speed = 6 + Math.random() * 9;
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45,
      vx: Math.cos(angle) * speed,                  // speed to the right
      vy: Math.sin(angle) * speed,                  // speed downward (negative = up)
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3
    });
  }

  const DURATION = 2600;                            // milliseconds
  const startTime = performance.now();
  function frame(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.vy += 0.25;                                 // gravity
      p.vx *= 0.99;                                 // a little air resistance
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / DURATION);   // fade out
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (elapsed < DURATION) {
      requestAnimationFrame(frame);                 // schedule the next frame
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

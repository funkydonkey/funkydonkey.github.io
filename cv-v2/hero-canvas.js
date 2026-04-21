// Hero canvas animation — a flowing field of nodes & filaments.
// Idle: slow organic drift. Mouse: tendrils of light trace from cursor across the network.
(function () {
  function initHeroCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, DPR = 1;
    let running = true;
    let t = 0;

    // Palette will be read from CSS vars, re-read on theme change.
    let palette = { ink: "#0a0a0a", ink3: "#6a6660", bg: "#f3f1ec" };
    function refreshPalette() {
      const cs = getComputedStyle(document.body);
      palette.ink = cs.getPropertyValue("--ink").trim() || "#0a0a0a";
      palette.ink3 = cs.getPropertyValue("--ink-3").trim() || "#6a6660";
      palette.bg = cs.getPropertyValue("--bg").trim() || "#f3f1ec";
    }

    // Nodes
    let nodes = [];
    const NUM_NODES = 72;

    // Mouse
    let mouse = { x: -9999, y: -9999, active: false, vx: 0, vy: 0, px: 0, py: 0 };

    // Filaments — pulses of light that travel between connected nodes
    let filaments = [];

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function seed() {
      nodes = [];
      for (let i = 0; i < NUM_NODES; i++) {
        // Random positions, biased toward edges for atmospheric feel
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 0.6,
          phase: Math.random() * Math.PI * 2,
          amp: 0.3 + Math.random() * 0.8,
        });
      }
    }

    function spawnFilament(fromIdx, toIdx) {
      filaments.push({
        from: fromIdx, to: toIdx,
        u: 0,
        speed: 0.008 + Math.random() * 0.02,
        life: 1,
      });
    }

    function step(dt) {
      t += dt;

      // Update nodes — gentle lissajous-like drift + slight mouse attraction
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // Organic wobble
        n.x += n.vx + Math.sin(t * 0.0004 + n.phase) * 0.12 * n.amp;
        n.y += n.vy + Math.cos(t * 0.0003 + n.phase * 1.3) * 0.12 * n.amp;

        // Mouse attraction (subtle — particles lean toward cursor)
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / 200) * 0.25;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }

        // Wrap
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }

      // Mouse velocity-driven filament spawns
      if (mouse.active) {
        const speed = Math.hypot(mouse.vx, mouse.vy);
        if (speed > 1 && Math.random() < 0.6) {
          // Find nearest node to cursor and spawn a filament along a connection
          let nearest = -1, nd = Infinity;
          for (let i = 0; i < nodes.length; i++) {
            const d = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
            if (d < nd) { nd = d; nearest = i; }
          }
          if (nearest >= 0 && nd < 180) {
            // Pick a connected neighbor
            let best = -1, bestD = Infinity;
            for (let j = 0; j < nodes.length; j++) {
              if (j === nearest) continue;
              const d = Math.hypot(nodes[nearest].x - nodes[j].x, nodes[nearest].y - nodes[j].y);
              if (d < 180 && d < bestD && Math.random() < 0.4) { bestD = d; best = j; }
            }
            if (best >= 0) spawnFilament(nearest, best);
          }
        }
      }

      // Ambient filaments when idle
      if (Math.random() < 0.04) {
        const a = (Math.random() * nodes.length) | 0;
        let best = -1, bestD = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (j === a) continue;
          const d = Math.hypot(nodes[a].x - nodes[j].x, nodes[a].y - nodes[j].y);
          if (d < 160 && d < bestD && Math.random() < 0.5) { bestD = d; best = j; }
        }
        if (best >= 0) spawnFilament(a, best);
      }

      // Update filaments
      for (let i = filaments.length - 1; i >= 0; i--) {
        const f = filaments[i];
        f.u += f.speed;
        if (f.u >= 1) {
          // Jump to a next neighbor with some probability (chain effect)
          if (Math.random() < 0.5) {
            const nextFrom = f.to;
            let best = -1, bestD = Infinity;
            for (let j = 0; j < nodes.length; j++) {
              if (j === nextFrom || j === f.from) continue;
              const d = Math.hypot(nodes[nextFrom].x - nodes[j].x, nodes[nextFrom].y - nodes[j].y);
              if (d < 180 && d < bestD && Math.random() < 0.4) { bestD = d; best = j; }
            }
            if (best >= 0) {
              f.from = nextFrom;
              f.to = best;
              f.u = 0;
              f.life *= 0.85;
              if (f.life < 0.2) filaments.splice(i, 1);
              continue;
            }
          }
          filaments.splice(i, 1);
        }
      }
    }

    function parseColor(hex) {
      hex = hex.trim();
      if (hex.startsWith("oklch") || hex.startsWith("rgb")) {
        // fallback to black for oklch parsing — these CV themes use hex
        return { r: 10, g: 10, b: 10 };
      }
      if (hex.startsWith("#")) hex = hex.slice(1);
      if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r: isNaN(r) ? 10 : r, g: isNaN(g) ? 10 : g, b: isNaN(b) ? 10 : b };
    }

    function rgba(c, a) {
      return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
    }

    function draw() {
      const inkC = parseColor(palette.ink);
      const ink3C = parseColor(palette.ink3);

      ctx.clearRect(0, 0, W, H);

      // Lines between close nodes
      const maxD = 180;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            const alpha = (1 - d / maxD) * 0.22;
            ctx.strokeStyle = rgba(ink3C, alpha);
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor radius subtle highlight — lines within radius get brighter
      if (mouse.active) {
        ctx.save();
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        grad.addColorStop(0, rgba(inkC, 0.05));
        grad.addColorStop(1, rgba(inkC, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
        ctx.restore();
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // cursor proximity emphasis
        let emphasis = 0;
        if (mouse.active) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < 160) emphasis = 1 - d / 160;
        }
        const r = n.r + emphasis * 2.5;
        ctx.fillStyle = rgba(inkC, 0.55 + emphasis * 0.45);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Filaments — traveling pulses
      for (let i = 0; i < filaments.length; i++) {
        const f = filaments[i];
        const a = nodes[f.from], b = nodes[f.to];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * f.u;
        const y = a.y + (b.y - a.y) * f.u;

        // Trail
        const trailLen = 0.14;
        const u0 = Math.max(0, f.u - trailLen);
        const tx = a.x + (b.x - a.x) * u0;
        const ty = a.y + (b.y - a.y) * u0;

        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, rgba(inkC, 0));
        grad.addColorStop(1, rgba(inkC, 0.85 * f.life));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Pulse head
        ctx.fillStyle = rgba(inkC, 0.9 * f.life);
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 14);
        halo.addColorStop(0, rgba(inkC, 0.22 * f.life));
        halo.addColorStop(1, rgba(inkC, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let last = performance.now();
    function tick(now) {
      if (!running) return;
      const dt = Math.min(50, now - last);
      last = now;
      // Mouse velocity (smoothed)
      mouse.vx = mouse.x - mouse.px;
      mouse.vy = mouse.y - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      step(dt);
      draw();
      requestAnimationFrame(tick);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onMouseLeave() {
      mouse.active = false;
      mouse.x = -9999; mouse.y = -9999;
    }
    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    }

    // Click burst — spawns many filaments from nearest node
    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      let nearest = -1, nd = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const d = Math.hypot(nodes[i].x - cx, nodes[i].y - cy);
        if (d < nd) { nd = d; nearest = i; }
      }
      if (nearest < 0) return;
      // Spawn filaments to all nearby neighbors
      for (let j = 0; j < nodes.length; j++) {
        if (j === nearest) continue;
        const d = Math.hypot(nodes[nearest].x - nodes[j].x, nodes[nearest].y - nodes[j].y);
        if (d < 220) spawnFilament(nearest, j);
      }
    }

    // Setup
    resize();
    seed();
    refreshPalette();

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("click", onClick);

    const ro = new ResizeObserver(() => {
      resize();
      seed();
    });
    ro.observe(canvas);

    // Re-read palette when body class changes
    const mo = new MutationObserver(refreshPalette);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    // Also re-read on CSS-var swaps
    setInterval(refreshPalette, 1500);

    requestAnimationFrame(tick);

    return () => { running = false; ro.disconnect(); mo.disconnect(); };
  }

  window.initHeroCanvas = initHeroCanvas;
})();

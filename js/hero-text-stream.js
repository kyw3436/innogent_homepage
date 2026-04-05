document.addEventListener("DOMContentLoaded", () => {
  const containers = Array.from(document.querySelectorAll(".hero-text-stream"));

  if (!containers.length || !window.gsap) {
    return;
  }

  const phrasePool = [
    "OfficeERP",
    "OfficeGPT",
    "DX",
    "AX",
    "Autonomous AI",
    "Enterprise Data",
    "Multi-Agent",
    "RAG Workflow",
    "Agentic Operations",
    "On-Premise Security",
    "ERP Intelligence",
    "Execution Layer",
    "Data to Action",
    "Connected Workflow",
    "Reasoning Engine"
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let rebuildTimer;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffle(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
  }

  function buildLineText() {
    const pieces = [];
    const targetLength = 16 + Math.floor(Math.random() * 6);

    while (pieces.length < targetLength) {
      pieces.push(...shuffle(phrasePool).slice(0, 5 + Math.floor(Math.random() * 4)));
    }

    return pieces.slice(0, targetLength).join("  +  ");
  }

  function clearContainer(container) {
    window.gsap.killTweensOf(container.querySelectorAll(".hero-stream-row, .hero-stream-track"));
    container.innerHTML = "";
  }

  function createRow(container, rowIndex, rowCount, theme, animate) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const row = document.createElement("div");
    const track = document.createElement("div");
    const firstLine = document.createElement("span");
    const secondLine = document.createElement("span");
    const verticalPadding = theme === "desktop" ? 34 : 16;
    const usableHeight = Math.max(height - verticalPadding * 2, height * 0.82);
    const baseStep = usableHeight / rowCount;
    const fontSize = theme === "desktop"
      ? clamp(width * randomBetween(0.07, 0.105), 34, 78)
      : clamp(width * randomBetween(0.08, 0.12), 26, 44);
    const rowTop = verticalPadding + baseStep * rowIndex + randomBetween(-10, 10);
    const rotation = randomBetween(-10, 10);
    const opacity = theme === "desktop"
      ? randomBetween(0.05, 0.1)
      : randomBetween(0.04, 0.08);
    const gap = Math.round(fontSize * randomBetween(0.28, 0.42));
    const blur = randomBetween(0, theme === "desktop" ? 0.4 : 0.2);
    const direction = Math.random() > 0.5 ? 1 : -1;
    const duration = theme === "desktop"
      ? randomBetween(224, 344)
      : randomBetween(184, 276);
    const drift = randomBetween(3, 9) * (Math.random() > 0.5 ? 1 : -1);
    const text = buildLineText();

    row.className = "hero-stream-row";
    row.style.top = `${rowTop}px`;
    row.style.opacity = opacity.toFixed(3);
    row.style.fontSize = `${fontSize}px`;
    row.style.transform = `translate3d(0, 0, 0) rotate(${rotation.toFixed(2)}deg)`;
    row.style.filter = `blur(${blur.toFixed(2)}px)`;

    track.className = "hero-stream-track";
    track.style.gap = `${gap}px`;

    firstLine.className = "hero-stream-line";
    secondLine.className = "hero-stream-line";
    firstLine.textContent = text;
    secondLine.textContent = text;

    track.append(firstLine, secondLine);
    row.append(track);
    container.append(row);

    if (!animate) {
      return;
    }

    const lineWidth = firstLine.getBoundingClientRect().width + gap;
    const startX = direction === 1 ? -lineWidth : 0;
    const endX = direction === 1 ? 0 : -lineWidth;

    window.gsap.set(track, { x: startX + randomBetween(-lineWidth * 0.35, lineWidth * 0.15) });

    window.gsap.to(track, {
      x: endX,
      duration,
      ease: "none",
      repeat: -1
    });

    window.gsap.to(row, {
      y: `+=${drift}`,
      rotate: rotation + randomBetween(-2, 2),
      duration: randomBetween(48, 80),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  function renderContainer(container) {
    const theme = container.dataset.streamTheme || "desktop";
    const width = container.clientWidth;
    const height = container.clientHeight;

    clearContainer(container);

    if (!width || !height) {
      return;
    }

    const rowCount = theme === "desktop"
      ? clamp(Math.round(height / 68), 7, 10)
      : clamp(Math.round(height / 56), 4, 6);
    const animate = !reducedMotion.matches;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      createRow(container, rowIndex, rowCount, theme, animate);
    }
  }

  function renderAll() {
    containers.forEach(renderContainer);
  }

  function scheduleRender() {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(renderAll, 140);
  }

  renderAll();
  window.addEventListener("load", scheduleRender);
  window.addEventListener("resize", scheduleRender);

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", scheduleRender);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(scheduleRender);
  }

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(scheduleRender);
    containers.forEach((container) => observer.observe(container));
  }
});

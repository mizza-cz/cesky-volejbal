document.querySelectorAll(".playoff").forEach((playoff) => {
  const board = playoff.querySelector(".playoff__board");
  const svg = playoff.querySelector(".playoff__lines");
  const series = [...playoff.querySelectorAll("[data-id]")];

  if (!board || !svg || !series.length) return;

  const ns = "http://www.w3.org/2000/svg";
  const seriesMap = new Map(series.map((item) => [item.dataset.id, item]));

  let frame = null;

  function getSummary(item) {
    return item?.querySelector(".playoff__summary");
  }

  function getCenter(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + rect.height / 2;
  }

  function getPoint(element, side) {
    const boardRect = board.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    return {
      x: (side === "right" ? rect.right : rect.left) - boardRect.left,
      y: rect.top - boardRect.top + rect.height / 2,
    };
  }

  function alignFinalGroup() {
    const semifinal1 = getSummary(seriesMap.get("s1"));
    const semifinal2 = getSummary(seriesMap.get("s2"));
    const final = seriesMap.get("f1");

    if (!semifinal1 || !semifinal2 || !final) return;

    const finalBody = final.closest(".playoff__round-body");
    const third = finalBody?.querySelector(".playoff__third");

    if (!finalBody || !third) return;

    finalBody.style.transform = "none";

    const semifinalCenter = (getCenter(semifinal1) + getCenter(semifinal2)) / 2;

    const finalRect = final.getBoundingClientRect();
    const thirdRect = third.getBoundingClientRect();

    const groupCenter = (finalRect.top + thirdRect.bottom) / 2;

    const offset = semifinalCenter - groupCenter;

    finalBody.style.transform = `translateY(${offset}px)`;
  }

  function drawLines() {
    frame = null;

    alignFinalGroup();

    const width = board.offsetWidth;
    const height = board.offsetHeight;

    svg.replaceChildren();
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const groups = new Map();

    series.forEach((item) => {
      const next = item.dataset.next;

      if (!next) return;

      if (!groups.has(next)) {
        groups.set(next, []);
      }

      groups.get(next).push(item);
    });

    groups.forEach((items, nextId) => {
      const nextSummary = getSummary(seriesMap.get(nextId));

      if (!nextSummary) return;

      const target = getPoint(nextSummary, "left");

      const sources = items
        .map(getSummary)
        .filter(Boolean)
        .map((summary) => getPoint(summary, "right"))
        .sort((a, b) => a.y - b.y);

      if (!sources.length) return;

      const middleX = (sources[0].x + target.x) / 2;
      const joinY =
        sources.reduce((sum, point) => sum + point.y, 0) / sources.length;

      let d = "";

      sources.forEach((point) => {
        d += `M ${point.x} ${point.y} H ${middleX} `;
      });

      if (sources.length > 1) {
        d += `M ${middleX} ${sources[0].y} `;
        d += `V ${sources[sources.length - 1].y} `;
      }

      d += `M ${middleX} ${target.y} H ${target.x}`;

      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);

      svg.appendChild(path);
    });
  }

  function scheduleDraw() {
    if (frame !== null) return;

    frame = requestAnimationFrame(drawLines);
  }

  function updateActiveRounds() {
    playoff.querySelectorAll(".playoff__round").forEach((round) => {
      round.classList.toggle(
        "is-active",
        Boolean(round.querySelector(".playoff__series[open]"))
      );
    });
  }

  playoff.querySelectorAll(".playoff__series").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        playoff.querySelectorAll(".playoff__series[open]").forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
      }

      updateActiveRounds();
      scheduleDraw();
    });
  });

  document.addEventListener("click", (event) => {
    if (playoff.contains(event.target)) return;

    playoff.querySelectorAll(".playoff__series[open]").forEach((item) => {
      item.open = false;
    });
  });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleDraw);

    observer.observe(board);

    series.forEach((item) => {
      const summary = getSummary(item);

      if (summary) {
        observer.observe(summary);
      }
    });
  }

  window.addEventListener("resize", scheduleDraw);

  if (document.fonts) {
    document.fonts.ready.then(scheduleDraw);
  }

  updateActiveRounds();
  scheduleDraw();
});

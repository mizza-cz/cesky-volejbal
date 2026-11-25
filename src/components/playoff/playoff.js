document.querySelectorAll(".playoff").forEach((playoff) => {
  const board = playoff.querySelector(".playoff__board");
  const svg = playoff.querySelector(".playoff__lines");
  const scroll = playoff.querySelector(".playoff__scroll");
  const series = [...playoff.querySelectorAll("[data-id]")];
  const seriesList = [...playoff.querySelectorAll(".playoff__series")];

  if (!board || !svg || !scroll || !series.length) return;

  const ns = "http://www.w3.org/2000/svg";
  const seriesMap = new Map(series.map((item) => [item.dataset.id, item]));
  const activeDropdowns = new Map();

  let frame = null;
  let dropdownFrame = null;

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

    updateAllDropdowns();
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

  function updateDropdownPosition(item) {
    const data = activeDropdowns.get(item);

    if (!data) return;

    const rect = item.getBoundingClientRect();
    const matches = data.matches;

    matches.style.top = `${rect.bottom + window.scrollY + 6}px`;
    matches.style.left = `${rect.left + window.scrollX}px`;
    matches.style.width = `${rect.width}px`;
  }

  function updateAllDropdowns() {
    activeDropdowns.forEach((data, item) => {
      updateDropdownPosition(item);
    });
  }

  function scheduleDropdownUpdate() {
    if (dropdownFrame !== null) return;

    dropdownFrame = requestAnimationFrame(() => {
      dropdownFrame = null;
      updateAllDropdowns();
    });
  }

  function restoreDropdown(item) {
    const data = activeDropdowns.get(item);

    if (!data) return;

    data.placeholder.replaceWith(data.matches);

    data.matches.classList.remove("is-floating");
    data.matches.removeAttribute("style");

    activeDropdowns.delete(item);
  }

  function openDropdown(item) {
    if (activeDropdowns.has(item)) return;

    const matches = item.querySelector(".playoff__matches");

    if (!matches) return;

    const placeholder = document.createComment("playoff matches");

    matches.replaceWith(placeholder);

    document.body.appendChild(matches);

    matches.classList.add("is-floating");

    activeDropdowns.set(item, {
      matches,
      placeholder,
    });

    updateDropdownPosition(item);
  }

  seriesList.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        seriesList.forEach((other) => {
          if (other !== item && other.open) {
            other.open = false;
            restoreDropdown(other);
          }
        });

        openDropdown(item);
      } else {
        restoreDropdown(item);
      }

      updateActiveRounds();
      scheduleDraw();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsidePlayoff = playoff.contains(event.target);

    const clickedInsideDropdown = [...activeDropdowns.values()].some(
      ({ matches }) => matches.contains(event.target)
    );

    if (clickedInsidePlayoff || clickedInsideDropdown) return;

    seriesList.forEach((item) => {
      if (item.open) {
        item.open = false;
        restoreDropdown(item);
      }
    });

    updateActiveRounds();
  });

  scroll.addEventListener("scroll", scheduleDropdownUpdate, {
    passive: true,
  });

  window.addEventListener("resize", () => {
    scheduleDraw();
    scheduleDropdownUpdate();
  });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      scheduleDraw();
      scheduleDropdownUpdate();
    });

    observer.observe(board);

    series.forEach((item) => {
      const summary = getSummary(item);

      if (summary) {
        observer.observe(summary);
      }
    });
  }

  if (document.fonts) {
    document.fonts.ready.then(() => {
      scheduleDraw();
      scheduleDropdownUpdate();
    });
  }

  updateActiveRounds();
  scheduleDraw();
});

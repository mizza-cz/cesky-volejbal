// Load the gallery only when a visitor opens it.
(function () {
  let libraryRequest;
  let opening = false;

  function loadLibrary() {
    if (window.FsLightbox) return Promise.resolve();
    if (!libraryRequest) {
      libraryRequest = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = galleryScriptUrl;
        script.onload = () => {
          if (window.FsLightbox) resolve();
          else {
            libraryRequest = null;
            script.remove();
            reject(new Error("Gallery library unavailable"));
          }
        };
        script.onerror = () => {
          libraryRequest = null;
          script.remove();
          reject(new Error("Gallery library unavailable"));
        };
        document.head.appendChild(script);
      });
    }
    return libraryRequest;
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("a[data-gallery-id][data-source]");
    if (!button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = button.dataset.galleryId;
    const source = button.dataset.source;
    if (!id || !source) return;

    event.preventDefault();
    if (opening) return;
    opening = true;
    button.setAttribute("aria-busy", "true");

    try {
      const url = new URL(source, document.baseURI);
      url.searchParams.set("id", id);
      const [, data] = await Promise.all([
        loadLibrary(),
        fetch(url, { headers: { Accept: "application/json" } }).then((response) => {
          if (!response.ok) throw new Error("Gallery request failed");
          return response.json();
        }),
      ]);
      if (!Array.isArray(data) || !data.length) throw new Error("Gallery is empty");
      const lightbox = new window.FsLightbox();
      lightbox.props.sources = data;
      lightbox.props.type = "image";
      lightbox.props.showThumbsOnMount = true;
      const start = Number.parseInt(button.dataset.start, 10) || 0;
      lightbox.open(Math.max(0, Math.min(start, data.length - 1)));
    } catch (error) {
      console.error(error);
      window.alert("Galerii se nepodařilo načíst. Zkuste to prosím znovu.");
    } finally {
      opening = false;
      button.removeAttribute("aria-busy");
    }
  });
})();

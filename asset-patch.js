(() => {
  const uri = (key) => window.__PAC?.[key] ? `data:image/webp;base64,${window.__PAC[key]}` : null;
  const replacements = {
    'assets/glutamina.jpg': uri('glutW'),
    'assets/tiby-boss-check.jpg': uri('checkW'),
    'assets/tiby-boss-review.jpg': uri('reviewW')
  };

  const patchImage = (img) => {
    if (!(img instanceof HTMLImageElement)) return;
    const raw = img.getAttribute('src') || '';
    const entry = Object.entries(replacements).find(([path, value]) => value && (raw === path || raw.endsWith('/' + path) || img.src.endsWith('/' + path)));
    if (!entry) return;
    img.src = entry[1];
  };

  const patchAll = (root = document) => root.querySelectorAll?.('img').forEach(patchImage);
  patchAll();

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches?.('img')) patchImage(node);
      patchAll(node);
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

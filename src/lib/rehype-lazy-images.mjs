function visit(node, callback) {
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      visit(child, callback);
    }
  }
}

function normalizeLocalPath(src, basePath) {
  if (!src || /^(https?:)?\/\//i.test(src) || src.startsWith("data:")) {
    return src;
  }

  const normalized = `/${src.replace(/^\/?/, "").replace(/^\.?\//, "")}`;
  const base = basePath === "/" ? "" : basePath;
  return normalized.startsWith(base) ? normalized : `${base}${normalized}`;
}

export default function rehypeLazyImages(options = {}) {
  const basePath = options.basePath ?? "/";

  return function transformer(tree) {
    visit(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "img") {
        return;
      }

      node.properties = {
        ...(node.properties ?? {}),
        src: normalizeLocalPath(node.properties?.src, basePath),
        loading: "lazy",
        decoding: "async"
      };
    });
  };
}


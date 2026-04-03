const DEFAULT_TITLES = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution"
};

function visit(node, callback) {
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      visit(child, callback);
    }
  }
}

function normalizeChildren(children = []) {
  return children.filter(Boolean);
}

export default function rehypeCallouts() {
  return function transformer(tree) {
    visit(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "blockquote" || !Array.isArray(node.children)) {
        return;
      }

      const firstParagraph = node.children.find(
        (child) => child.type === "element" && child.tagName === "p" && Array.isArray(child.children)
      );
      if (!firstParagraph || !firstParagraph.children.length) {
        return;
      }

      const firstChild = firstParagraph.children[0];
      if (!firstChild || firstChild.type !== "text") {
        return;
      }

      const match = firstChild.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/);
      if (!match) {
        return;
      }

      const variant = match[1].toLowerCase();
      const title = match[2].trim() || DEFAULT_TITLES[variant];
      firstParagraph.children[0].value = "";
      if (firstParagraph.children[0].value === "") {
        firstParagraph.children.shift();
      }

      const content = normalizeChildren(node.children);
      if (firstParagraph.children.length === 0) {
        content.shift();
      }

      node.tagName = "aside";
      node.properties = {
        ...(node.properties ?? {}),
        className: ["callout", `callout-${variant}`]
      };
      node.children = [
        {
          type: "element",
          tagName: "p",
          properties: { className: ["callout-title"] },
          children: [{ type: "text", value: title }]
        },
        ...content
      ];
    });
  };
}

const TITLES = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
  info: "Info",
  caution: "Caution",
};

function walk(node, fn) {
  fn(node);
  if (!node.children) return;
  for (const child of node.children) walk(child, fn);
}

export default function remarkAdmonitions() {
  return (tree) => {
    walk(tree, (node) => {
      if (
        node.type !== "containerDirective" &&
        node.type !== "leafDirective"
      ) {
        return;
      }

      const title = TITLES[node.name];
      if (!title) return;

      const data = node.data || (node.data = {});
      data.hName = "aside";
      data.hProperties = {
        className: ["admonition", node.name],
        ...(node.attributes || {}),
      };

      const children = node.children ?? [];
      let label = children[0]?.data?.directiveLabel ? children.shift() : null;

      if (!label) {
        label = {
          type: "paragraph",
          data: {
            hName: "p",
            hProperties: { className: ["admonition-title"] },
          },
          children: [{ type: "text", value: title }],
        };
      } else {
        const labelData = label.data || (label.data = {});
        labelData.hName = "p";
        labelData.hProperties = { className: ["admonition-title"] };
      }

      node.children = [label, ...children];
    });
  };
}

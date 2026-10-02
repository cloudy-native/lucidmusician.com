function isImageParagraph(node) {
  if (node?.type !== "paragraph" || !node.children?.length) return false;
  const kids = node.children.filter(
    (child) => !(child.type === "text" && !child.value.trim()),
  );
  return kids.length === 1 && kids[0].type === "image";
}

function captionChildren(node) {
  if (node?.type !== "paragraph" || !node.children?.length) return null;
  const kids = node.children.filter(
    (child) => !(child.type === "text" && !child.value.trim()),
  );
  if (kids.length === 1 && kids[0].type === "emphasis") {
    return kids[0].children ?? [];
  }
  return null;
}

function wrapCaptions(parent) {
  if (!parent.children) return;

  const out = [];
  for (let i = 0; i < parent.children.length; i++) {
    const node = parent.children[i];
    const next = parent.children[i + 1];
    const caption = next ? captionChildren(next) : null;

    if (isImageParagraph(node) && caption) {
      out.push({
        type: "paragraph",
        data: {
          hName: "figure",
          hProperties: { className: ["md-figure"] },
        },
        children: [
          node,
          {
            type: "paragraph",
            data: { hName: "figcaption" },
            children: caption,
          },
        ],
      });
      i += 1;
      continue;
    }

    wrapCaptions(node);
    out.push(node);
  }
  parent.children = out;
}

export default function remarkImageCaptions() {
  return (tree) => wrapCaptions(tree);
}

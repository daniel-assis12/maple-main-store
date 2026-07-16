import { useEffect } from "react";

function PageMeta({ title, description }) {
  useEffect(() => {
    document.title = title
      ? `${title} | Maple & Main`
      : "Maple & Main | Everyday Essentials";

    let descriptionTag = document.querySelector(
      'meta[name="description"]',
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      description ||
        "Thoughtfully curated home, beauty and lifestyle essentials for better everyday living.",
    );
  }, [title, description]);

  return null;
}

export default PageMeta;

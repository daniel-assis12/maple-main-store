function normalizeText(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchProducts(products, searchTerm) {
  const normalizedSearch = normalizeText(searchTerm);

  if (!normalizedSearch) {
    return [];
  }

  const searchWords = normalizedSearch
    .split(/\s+/)
    .filter(Boolean);

  return products
    .map((product) => {
      const searchableContent = normalizeText(
        [
          product.name,
          product.category,
          product.shortDescription,
          product.description,
          product.badge,
          ...(product.benefits ?? []),
          ...(product.colors ?? []),
        ].join(" "),
      );

      const name = normalizeText(product.name);
      const category = normalizeText(product.category);
      const description = normalizeText(
        product.shortDescription,
      );

      let score = 0;

      if (name === normalizedSearch) {
        score += 100;
      }

      if (name.startsWith(normalizedSearch)) {
        score += 60;
      }

      if (name.includes(normalizedSearch)) {
        score += 40;
      }

      if (category.includes(normalizedSearch)) {
        score += 25;
      }

      if (description.includes(normalizedSearch)) {
        score += 15;
      }

      const allWordsMatch = searchWords.every((word) =>
        searchableContent.includes(word),
      );

      if (allWordsMatch) {
        score += 30;
      }

      searchWords.forEach((word) => {
        if (name.includes(word)) {
          score += 12;
        }

        if (category.includes(word)) {
          score += 7;
        }

        if (searchableContent.includes(word)) {
          score += 3;
        }
      });

      return {
        product,
        score,
      };
    })
    .filter((result) => result.score > 0)
    .sort((firstResult, secondResult) => {
      if (secondResult.score !== firstResult.score) {
        return secondResult.score - firstResult.score;
      }

      return firstResult.product.name.localeCompare(
        secondResult.product.name,
      );
    })
    .map((result) => result.product);
}

export function getPopularSearches(products) {
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean),
    ),
  ];

  const featuredNames = products
    .filter((product) => product.featured)
    .map((product) => product.name);

  return [...categories, ...featuredNames].slice(0, 6);
}
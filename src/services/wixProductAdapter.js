function extractImageUrl(mediaItem) {
  if (!mediaItem) {
    return "";
  }

  return (
    mediaItem.image?.url ??
    mediaItem.video?.stillFrameMediaId ??
    mediaItem.url ??
    ""
  );
}

function extractProductImages(product) {
  const mediaItems = product.media?.items ?? [];

  const galleryImages = mediaItems
    .map((item) => extractImageUrl(item))
    .filter(Boolean);

  const mainImage =
    extractImageUrl(product.media?.mainMedia) ||
    galleryImages[0] ||
    "";

  return {
    mainImage,
    galleryImages:
      galleryImages.length > 0
        ? galleryImages
        : mainImage
          ? [mainImage]
          : [],
  };
}

function extractPrice(product) {
  const rawPrice =
    product.priceData?.price ??
    product.price?.price ??
    product.price ??
    0;

  const numericPrice = Number(rawPrice);

  return Number.isFinite(numericPrice)
    ? numericPrice
    : 0;
}

function extractComparePrice(product, price) {
  const rawComparePrice =
    product.priceData?.discountedPrice ??
    product.priceData?.compareAtPrice ??
    product.price?.compareAtPrice ??
    price;

  const numericComparePrice = Number(rawComparePrice);

  if (
    !Number.isFinite(numericComparePrice) ||
    numericComparePrice <= price
  ) {
    return null;
  }

  return numericComparePrice;
}

function extractColors(product) {
  const choices =
    product.productOptions?.flatMap(
      (option) => option.choices ?? [],
    ) ?? [];

  const colors = choices
    .map(
      (choice) =>
        choice.description ??
        choice.value ??
        choice.title ??
        "",
    )
    .filter(Boolean);

  return [...new Set(colors)];
}

function createDescription(product) {
  return (
    product.description ??
    product.additionalInfoSections?.[0]?.description ??
    "A thoughtfully selected product from the Maple & Main collection."
  );
}

function createShortDescription(product) {
  const description = createDescription(product)
    .replace(/<[^>]*>/g, "")
    .trim();

  if (description.length <= 130) {
    return description;
  }

  return `${description.slice(0, 127).trim()}...`;
}

function createCategory(product) {
  return (
    product.brand ??
    product.ribbon ??
    "Maple & Main Collection"
  );
}

function createImageClass(index) {
  const imageClasses = [
    "productImageHome",
    "productImageBeauty",
    "productImageTech",
    "productImageKitchen",
    "productImageTravel",
    "productImagePet",
  ];

  return imageClasses[index % imageClasses.length];
}

export function adaptWixProduct(product, index = 0) {
  const price = extractPrice(product);
  const images = extractProductImages(product);
  const colors = extractColors(product);

  return {
    id: product._id,
    wixId: product._id,
    slug:
      product.slug ||
      product._id ||
      `wix-product-${index + 1}`,

    name:
      product.name ||
      `Maple & Main Product ${index + 1}`,

    category: createCategory(product),

    price,
    compareAtPrice:
      extractComparePrice(product, price),

    formattedPrice:
      product.priceData?.formatted?.price ??
      product.price?.formattedPrice ??
      `$${price.toFixed(2)}`,

    badge:
      product.ribbon ||
      (index === 0 ? "Featured" : ""),

    rating: 0,
    reviewCount: 0,

    shortDescription:
      createShortDescription(product),

    description:
      createDescription(product),

    benefits: [
      "Available through Maple & Main",
      "Secure Wix checkout",
      "Product information supplied by our catalog",
    ],

    colors:
      colors.length > 0
        ? colors
        : ["Standard"],

    image: images.mainImage,
    images: images.galleryImages,

    imageClass: createImageClass(index),

    featured:
      index < 4,

    inStock:
      product.stock?.inStock ??
      product.inventoryItem?.inStock ??
      true,

    wixProduct: product,
  };
}

export function adaptWixProducts(products = []) {
  return products.map((product, index) =>
    adaptWixProduct(product, index),
  );
}
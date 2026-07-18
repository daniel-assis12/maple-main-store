import {
  initializeWixVisitor,
  isWixConfigured,
  wixClient,
} from "../wix/wixClient.js";

import {
  adaptWixProduct,
  adaptWixProducts,
} from "./wixProductAdapter.js";

export async function getWixProducts(limit = 100) {
  if (!isWixConfigured || !wixClient) {
    throw new Error(
      "Wix Client ID is not configured.",
    );
  }

  await initializeWixVisitor();

  const result = await wixClient.products
    .queryProducts()
    .limit(limit)
    .find({
      includeVariants: true,
    });

  return adaptWixProducts(result.items ?? []);
}

export async function getWixProductBySlug(slug) {
  if (!slug) {
    return null;
  }

  const catalogProducts = await getWixProducts(100);

  return (
    catalogProducts.find(
      (product) => product.slug === slug,
    ) ?? null
  );
}

export async function getWixProductById(productId) {
  if (!productId) {
    return null;
  }

  if (!isWixConfigured || !wixClient) {
    throw new Error(
      "Wix Client ID is not configured.",
    );
  }

  await initializeWixVisitor();

  const result =
    await wixClient.products.getProduct(productId, {
      includeVariants: true,
    });

  const product = result?.product ?? result;

  return product
    ? adaptWixProduct(product)
    : null;
}

export async function testWixConnection() {
  try {
    const catalogProducts = await getWixProducts(5);

    return {
      connected: true,
      message: "Wix connection successful.",
      productsFound: catalogProducts.length,
      products: catalogProducts,
    };
  } catch (error) {
    console.error("Wix connection error:", error);

    return {
      connected: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown Wix connection error.",
      productsFound: 0,
      products: [],
    };
  }
}
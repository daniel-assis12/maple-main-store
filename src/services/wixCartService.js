import { currentCart } from "@wix/ecom";

import {
  initializeWixVisitor,
  isWixConfigured,
  wixClient,
} from "../wix/wixClient.js";

const WIX_STORES_APP_ID =
  "215238eb-22a5-4c36-9e7b-e7c08025e04e";

function ensureWixCartAvailable() {
  if (!isWixConfigured || !wixClient) {
    throw new Error(
      "Wix eCommerce is not configured.",
    );
  }
}

function extractCart(response) {
  return (
    response?.cart ??
    response?.currentCart ??
    response ??
    null
  );
}

function getErrorStatus(error) {
  return (
    error?.response?.status ??
    error?.status ??
    error?.details?.applicationError?.code
  );
}

function buildSelectedOptions(product) {
  const productOptions =
    product?.wixProduct?.productOptions ??
    product?.productOptions ??
    [];

  return productOptions.reduce(
    (selectedOptions, option) => {
      const firstChoice = option?.choices?.[0];

      const optionName =
        option?.name ??
        option?.title;

      const choiceValue =
        firstChoice?.description ??
        firstChoice?.value ??
        firstChoice?.title;

      if (!optionName || !choiceValue) {
        return selectedOptions;
      }

      return {
        ...selectedOptions,
        [optionName]: choiceValue,
      };
    },
    {},
  );
}

function findMatchingVariant(
  product,
  selectedOptions,
) {
  const variants =
    product?.wixProduct?.variants ??
    product?.variants ??
    [];

  if (variants.length === 0) {
    return null;
  }

  const matchingVariant = variants.find((variant) => {
    const variantChoices =
      variant?.choices ?? {};

    return Object.entries(selectedOptions).every(
      ([optionName, selectedValue]) =>
        variantChoices[optionName] === selectedValue,
    );
  });

  return matchingVariant ?? variants[0];
}

function buildCatalogReference(product) {
  const rawProduct =
    product?.wixProduct ?? product;

  const productId =
    rawProduct?._id ??
    rawProduct?.id ??
    product?.wixId ??
    product?.id;

  if (!productId) {
    throw new Error(
      "The product does not have a valid Wix product ID.",
    );
  }

  const selectedOptions =
    buildSelectedOptions(product);

  const catalogReference = {
    appId: WIX_STORES_APP_ID,
    catalogItemId: productId,
  };

  if (rawProduct?.manageVariants) {
    const selectedVariant =
      findMatchingVariant(
        product,
        selectedOptions,
      );

    const variantId =
      selectedVariant?._id ??
      selectedVariant?.id;

    if (!variantId) {
      throw new Error(
        "This product uses managed variants, but no variant ID was loaded. Refresh the page and try again.",
      );
    }

    catalogReference.options = {
      variantId,
    };

    return catalogReference;
  }

  if (Object.keys(selectedOptions).length > 0) {
    catalogReference.options = {
      options: selectedOptions,
    };
  }

  return catalogReference;
}

export async function getCurrentWixCart() {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  try {
    const response =
      await wixClient.currentCart.getCurrentCart();

    return extractCart(response);
  } catch (error) {
    const status = getErrorStatus(error);

    if (
      status === 404 ||
      status === "CART_NOT_FOUND"
    ) {
      return null;
    }

    console.error(
      "Unable to read Wix cart:",
      error,
    );

    throw error;
  }
}

export async function addProductToWixCart(
  product,
  quantity = 1,
) {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  const catalogReference =
    buildCatalogReference(product);

  const request = {
    lineItems: [
      {
        catalogReference,
        quantity: Math.max(
          1,
          Number(quantity) || 1,
        ),
      },
    ],
  };

  console.log(
    "PRODUCT_VARIANT_STATUS:",
    JSON.stringify(
      {
        manageVariants:
          product?.wixProduct?.manageVariants,
        variants:
          product?.wixProduct?.variants,
      },
      null,
      2,
    ),
  );

  console.log(
    "ADD_TO_CART_REQUEST_JSON:",
    JSON.stringify(request, null, 2),
  );

  const response =
    await wixClient.currentCart.addToCurrentCart(
      request,
    );

  console.log(
    "ADD_TO_CART_RESPONSE_JSON:",
    JSON.stringify(response, null, 2),
  );

  const cart = extractCart(response);

  if (cart?.lineItems?.length > 0) {
    return cart;
  }

  const refreshedResponse =
    await wixClient.currentCart.getCurrentCart();

  return extractCart(refreshedResponse);
}

export async function updateWixCartQuantity(
  lineItemId,
  quantity,
) {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  const response =
    await wixClient.currentCart
      .updateCurrentCartLineItemQuantity([
        {
          _id: lineItemId,
          quantity: Math.max(
            1,
            Number(quantity) || 1,
          ),
        },
      ]);

  return extractCart(response);
}

export async function removeWixCartItem(
  lineItemId,
) {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  const response =
    await wixClient.currentCart
      .removeLineItemsFromCurrentCart([
        lineItemId,
      ]);

  return extractCart(response);
}

export async function clearWixCart() {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  try {
    await wixClient.currentCart.deleteCurrentCart();
  } catch (error) {
    const status = getErrorStatus(error);

    if (
      status !== 404 &&
      status !== "CART_NOT_FOUND"
    ) {
      throw error;
    }
  }

  return null;
}

export async function startWixCheckout() {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  const checkoutResponse =
    await wixClient.currentCart
      .createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      });

  const checkoutId =
    checkoutResponse?.checkoutId ??
    checkoutResponse?.checkout?._id;

  if (!checkoutId) {
    throw new Error(
      "Wix did not return a checkout ID.",
    );
  }

  const redirectResponse =
    await wixClient.redirects.createRedirectSession({
      ecomCheckout: {
        checkoutId,
      },
      callbacks: {
        postFlowUrl: window.location.origin,
      },
    });

  const checkoutUrl =
    redirectResponse?.redirectSession?.fullUrl ??
    redirectResponse?.fullUrl;

  if (!checkoutUrl) {
    throw new Error(
      "Wix did not return a checkout URL.",
    );
  }

  window.location.assign(checkoutUrl);
}
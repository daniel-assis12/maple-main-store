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

function getProductOptions(product) {
  return (
    product?.wixProduct?.productOptions ??
    product?.productOptions ??
    []
  );
}

function buildSelectedOptions(
  product,
  selectedOption = "",
) {
  const productOptions =
    getProductOptions(product);

  return productOptions.reduce(
    (selectedOptions, option, index) => {
      const choices = option?.choices ?? [];

      const optionName =
        option?.name ??
        option?.title ??
        option?._id;

      const requestedChoice =
        index === 0 && selectedOption
          ? choices.find((choice) => {
              const choiceValues = [
                choice?.description,
                choice?.value,
                choice?.title,
                choice?._id,
              ]
                .filter(Boolean)
                .map((value) =>
                  String(value).toLowerCase(),
                );

              return choiceValues.includes(
                String(
                  selectedOption,
                ).toLowerCase(),
              );
            })
          : null;

      const selectedChoice =
        requestedChoice ?? choices[0];

      const choiceValue =
        selectedChoice?.description ??
        selectedChoice?.value ??
        selectedChoice?.title;

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

  const matchingVariant = variants.find(
    (variant) => {
      const variantChoices =
        variant?.choices ?? {};

      return Object.entries(
        selectedOptions,
      ).every(
        ([optionName, selectedValue]) =>
          variantChoices[optionName] ===
          selectedValue,
      );
    },
  );

  return matchingVariant ?? variants[0];
}

function buildCatalogReference(
  product,
  selectedOption = "",
) {
  const rawProduct =
    product?.wixProduct ?? product;

  const productId =
    rawProduct?._id ??
    product?.wixId ??
    rawProduct?.id ??
    product?.id;

  if (!productId) {
    throw new Error(
      "The product does not have a valid Wix product ID.",
    );
  }

  const selectedOptions =
    buildSelectedOptions(
      product,
      selectedOption,
    );

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
        "The selected product variant could not be identified.",
      );
    }

    catalogReference.options = {
      variantId,
    };

    return catalogReference;
  }

  if (
    Object.keys(selectedOptions).length > 0
  ) {
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
      await wixClient.currentCart
        .getCurrentCart();

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
  selectedOption = "",
) {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  const catalogReference =
    buildCatalogReference(
      product,
      selectedOption,
    );

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

  const response =
    await wixClient.currentCart
      .addToCurrentCart(request);

  const cart = extractCart(response);

  if (cart?.lineItems?.length > 0) {
    return cart;
  }

  const refreshedResponse =
    await wixClient.currentCart
      .getCurrentCart();

  return extractCart(refreshedResponse);
}

export async function updateWixCartQuantity(
  lineItemId,
  quantity,
) {
  ensureWixCartAvailable();
  await initializeWixVisitor();

  if (!lineItemId) {
    throw new Error(
      "The Wix line item ID is missing.",
    );
  }

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

  if (!lineItemId) {
    throw new Error(
      "The Wix line item ID is missing.",
    );
  }

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
    await wixClient.currentCart
      .deleteCurrentCart();
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
        channelType:
          currentCart.ChannelType.WEB,
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
    await wixClient.redirects
      .createRedirectSession({
        ecomCheckout: {
          checkoutId,
        },
        callbacks: {
          postFlowUrl:
            window.location.origin,
        },
      });

  const checkoutUrl =
    redirectResponse?.redirectSession
      ?.fullUrl ??
    redirectResponse?.fullUrl;

  if (!checkoutUrl) {
    throw new Error(
      "Wix did not return a checkout URL.",
    );
  }

  window.location.assign(checkoutUrl);
}
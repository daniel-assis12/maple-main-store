const wixClientId = import.meta.env.VITE_WIX_CLIENT_ID?.trim() ?? "";
const wixSiteId = import.meta.env.VITE_WIX_SITE_ID?.trim() ?? "";
const useWix = import.meta.env.VITE_USE_WIX === "true";

export const environment = {
  wix: {
    clientId: wixClientId,
    siteId: wixSiteId,
    enabled: useWix && Boolean(wixClientId),
  },
};

export function validateEnvironment() {
  if (!useWix) {
    return {
      valid: true,
      mode: "mock",
      message: "Using provisional local product data.",
    };
  }

  if (!wixClientId) {
    return {
      valid: false,
      mode: "wix",
      message: "VITE_WIX_CLIENT_ID is missing.",
    };
  }

  return {
    valid: true,
    mode: "wix",
    message: "Wix integration is enabled.",
  };
}
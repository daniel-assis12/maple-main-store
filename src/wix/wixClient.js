import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

const TOKEN_STORAGE_KEY = "maple-main-wix-tokens";

const clientId =
  import.meta.env.VITE_WIX_CLIENT_ID?.trim() ?? "";

export const isWixConfigured = Boolean(clientId);

export const wixClient = isWixConfigured
  ? createClient({
      modules: {
        products,
      },
      auth: OAuthStrategy({
        clientId,
      }),
    })
  : null;

function readStoredTokens() {
  try {
    const storedTokens =
      window.localStorage.getItem(TOKEN_STORAGE_KEY);

    return storedTokens
      ? JSON.parse(storedTokens)
      : null;
  } catch {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
}

function saveTokens(tokens) {
  try {
    window.localStorage.setItem(
      TOKEN_STORAGE_KEY,
      JSON.stringify(tokens),
    );
  } catch {
    // A conexão continua funcionando mesmo se o navegador
    // bloquear o armazenamento local.
  }
}

export async function initializeWixVisitor() {
  if (!wixClient) {
    return null;
  }

  const storedTokens = readStoredTokens();

  if (storedTokens) {
    wixClient.auth.setTokens(storedTokens);
    return storedTokens;
  }

  const visitorTokens =
    await wixClient.auth.generateVisitorTokens();

  wixClient.auth.setTokens(visitorTokens);
  saveTokens(visitorTokens);

  return visitorTokens;
}
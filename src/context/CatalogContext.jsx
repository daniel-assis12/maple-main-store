import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  products as provisionalProducts,
} from "../data/products.js";

import {
  getWixProducts,
} from "../services/wixCatalogService.js";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(
    provisionalProducts,
  );

  const [source, setSource] = useState("local");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        setIsLoading(true);
        setError("");

        const wixProducts = await getWixProducts();

        if (!isMounted) {
          return;
        }

        if (wixProducts.length > 0) {
          setProducts(wixProducts);
          setSource("wix");
        } else {
          setProducts(provisionalProducts);
          setSource("local");
          setError(
            "The Wix catalog is empty. Local demonstration products are being displayed.",
          );
        }
      } catch (catalogError) {
        console.error(
          "Unable to load Wix catalog:",
          catalogError,
        );

        if (!isMounted) {
          return;
        }

        setProducts(provisionalProducts);
        setSource("local");
        setError(
          "The Wix catalog could not be loaded. Local demonstration products are being displayed.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean),
      ),
    ],
    [products],
  );

  function getProductBySlug(slug) {
    return (
      products.find(
        (product) => product.slug === slug,
      ) ?? null
    );
  }

  const value = useMemo(
    () => ({
      products,
      categories,
      source,
      isLoading,
      error,
      getProductBySlug,
    }),
    [
      products,
      categories,
      source,
      isLoading,
      error,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error(
      "useCatalog must be used inside CatalogProvider",
    );
  }

  return context;
}
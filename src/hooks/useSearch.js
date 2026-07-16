import { useEffect, useMemo, useState } from "react";
import {
  getPopularSearches,
  searchProducts,
} from "../utils/searchProducts.js";

const STORAGE_KEY = "maple-main-recent-searches";
const MAX_RECENT_SEARCHES = 5;

function readRecentSearches() {
  try {
    const storedSearches = window.localStorage.getItem(
      STORAGE_KEY,
    );

    if (!storedSearches) {
      return [];
    }

    const parsedSearches = JSON.parse(storedSearches);

    return Array.isArray(parsedSearches)
      ? parsedSearches
      : [];
  } catch {
    return [];
  }
}

export function useSearch(products) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeResultIndex, setActiveResultIndex] =
    useState(-1);
  const [recentSearches, setRecentSearches] = useState(
    readRecentSearches,
  );

  const results = useMemo(
    () => searchProducts(products, searchTerm),
    [products, searchTerm],
  );

  const visibleResults = useMemo(
    () => results.slice(0, 6),
    [results],
  );

  const popularSearches = useMemo(
    () => getPopularSearches(products),
    [products],
  );

  useEffect(() => {
    setActiveResultIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recentSearches),
      );
    } catch {
      // A busca continua funcionando mesmo se o navegador
      // bloquear o armazenamento local.
    }
  }, [recentSearches]);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  function openSearch() {
    setIsSearchOpen(true);
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchTerm("");
    setActiveResultIndex(-1);
  }

  function updateSearchTerm(value) {
    setSearchTerm(value);
  }

  function submitSearch(term = searchTerm) {
    const normalizedTerm = term.trim();

    if (!normalizedTerm) {
      return "";
    }

    setRecentSearches((currentSearches) => {
      const searchesWithoutDuplicate =
        currentSearches.filter(
          (search) =>
            search.toLowerCase() !==
            normalizedTerm.toLowerCase(),
        );

      return [
        normalizedTerm,
        ...searchesWithoutDuplicate,
      ].slice(0, MAX_RECENT_SEARCHES);
    });

    return normalizedTerm;
  }

  function removeRecentSearch(searchToRemove) {
    setRecentSearches((currentSearches) =>
      currentSearches.filter(
        (search) => search !== searchToRemove,
      ),
    );
  }

  function clearRecentSearches() {
    setRecentSearches([]);
  }

  function handleKeyboardNavigation(event) {
    if (visibleResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveResultIndex((currentIndex) =>
        currentIndex >= visibleResults.length - 1
          ? 0
          : currentIndex + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveResultIndex((currentIndex) =>
        currentIndex <= 0
          ? visibleResults.length - 1
          : currentIndex - 1,
      );
    }

    if (
      event.key === "Escape" &&
      isSearchOpen
    ) {
      closeSearch();
    }
  }

  return {
    searchTerm,
    isSearchOpen,
    results,
    visibleResults,
    activeResultIndex,
    recentSearches,
    popularSearches,
    openSearch,
    closeSearch,
    updateSearchTerm,
    submitSearch,
    removeRecentSearch,
    clearRecentSearches,
    setActiveResultIndex,
    handleKeyboardNavigation,
  };
}
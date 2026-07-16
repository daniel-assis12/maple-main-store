import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import SearchItem from "./SearchItem";
import "./Search.css";

function Search({
  searchTerm,
  isSearchOpen,
  visibleResults,
  activeResultIndex,
  recentSearches,
  popularSearches,
  closeSearch,
  updateSearchTerm,
  submitSearch,
  removeRecentSearch,
  clearRecentSearches,
  setActiveResultIndex,
  handleKeyboardNavigation,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isSearchOpen]);

  function openProduct(product) {
    submitSearch(searchTerm || product.name);
    closeSearch();
    navigate(`/product/${product.slug}`);
  }

  function runSuggestedSearch(term) {
    updateSearchTerm(term);
    submitSearch(term);
    inputRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const submittedTerm = submitSearch();

    if (!submittedTerm) {
      return;
    }

    if (
      activeResultIndex >= 0 &&
      visibleResults[activeResultIndex]
    ) {
      openProduct(visibleResults[activeResultIndex]);
      return;
    }

    if (visibleResults.length > 0) {
      openProduct(visibleResults[0]);
      return;
    }

    closeSearch();

    navigate(
      `/shop?search=${encodeURIComponent(submittedTerm)}`,
    );
  }

  function handleInputKeyDown(event) {
    handleKeyboardNavigation(event);

    if (event.key === "Enter") {
      handleSubmit(event);
    }
  }

  return (
    <>
      <div
        className={`searchOverlay ${
          isSearchOpen ? "isVisible" : ""
        }`}
        onClick={closeSearch}
        aria-hidden="true"
      />

      <section
        className={`searchPanel ${
          isSearchOpen ? "isOpen" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search Maple and Main products"
        aria-hidden={!isSearchOpen}
      >
        <div className="searchPanelHeader">
          <div>
            <span>SEARCH MAPLE &amp; MAIN</span>
            <h2>What are you looking for?</h2>
          </div>

          <button
            className="searchCloseButton"
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        <form className="searchForm" onSubmit={handleSubmit}>
          <svg
            className="searchFormIcon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            placeholder="Search products, categories and benefits"
            autoComplete="off"
            aria-label="Search products"
            aria-controls="search-results"
            aria-activedescendant={
              activeResultIndex >= 0
                ? `search-result-${activeResultIndex}`
                : undefined
            }
            onChange={(event) =>
              updateSearchTerm(event.target.value)
            }
            onKeyDown={handleInputKeyDown}
          />

          {searchTerm && (
            <button
              className="searchClearButton"
              type="button"
              onClick={() => {
                updateSearchTerm("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}

          <button className="searchSubmitButton" type="submit">
            Search
          </button>
        </form>

        <div className="searchPanelBody">
          {searchTerm.trim() ? (
            <>
              <div className="searchResultsHeader">
                <p>
                  {visibleResults.length > 0
                    ? `${visibleResults.length} suggested ${
                        visibleResults.length === 1
                          ? "result"
                          : "results"
                      }`
                    : "No matching products"}
                </p>

                {visibleResults.length > 0 && (
                  <span>Use ↑ and ↓ to navigate</span>
                )}
              </div>

              {visibleResults.length > 0 ? (
                <div
                  className="searchResults"
                  id="search-results"
                  role="listbox"
                >
                  {visibleResults.map((product, index) => (
                    <div
                      id={`search-result-${index}`}
                      key={product.id}
                    >
                      <SearchItem
                        product={product}
                        isActive={
                          activeResultIndex === index
                        }
                        onMouseEnter={() =>
                          setActiveResultIndex(index)
                        }
                        onSelect={openProduct}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="searchEmpty">
                  <span aria-hidden="true">⌕</span>

                  <h3>No products found</h3>

                  <p>
                    Try a category such as Home, Beauty,
                    Wellness, Tech or Pets.
                  </p>

                  <button
                    type="button"
                    onClick={() => updateSearchTerm("")}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="searchSuggestions">
              <section>
                <div className="searchSuggestionTitle">
                  <h3>Popular searches</h3>
                </div>

                <div className="searchSuggestionTags">
                  {popularSearches.map((term) => (
                    <button
                      type="button"
                      key={term}
                      onClick={() =>
                        runSuggestedSearch(term)
                      }
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>

              {recentSearches.length > 0 && (
                <section>
                  <div className="searchSuggestionTitle">
                    <h3>Recent searches</h3>

                    <button
                      type="button"
                      onClick={clearRecentSearches}
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="recentSearches">
                    {recentSearches.map((term) => (
                      <div
                        className="recentSearchItem"
                        key={term}
                      >
                        <button
                          className="recentSearchTerm"
                          type="button"
                          onClick={() =>
                            runSuggestedSearch(term)
                          }
                        >
                          <span aria-hidden="true">↗</span>
                          {term}
                        </button>

                        <button
                          className="removeRecentSearch"
                          type="button"
                          onClick={() =>
                            removeRecentSearch(term)
                          }
                          aria-label={`Remove ${term} from recent searches`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        <div className="searchPanelFooter">
          <span>Free Shipping</span>
          <span>Secure Checkout</span>
          <span>30-Day Guarantee</span>
        </div>
      </section>
    </>
  );
}

export default Search;
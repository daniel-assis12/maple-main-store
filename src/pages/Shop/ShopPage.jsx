import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import PageMeta from "../../components/PageMeta/PageMeta";
import PageHero from "../../components/PageHero/PageHero";
import ProductCard from "../../components/ProductCard/ProductCard";

import { useCart } from "../../context/CartContext.jsx";
import { useCatalog } from "../../context/CatalogContext.jsx";

import "./ShopPage.css";

function ShopPage() {
  const { addItem } = useCart();

  const {
    products,
    categories,
    source,
    isLoading,
    error,
  } = useCatalog();

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl =
    searchParams.get("category") || "All";

  const searchFromUrl =
    searchParams.get("search") || "";

  const initialCategory = categories.includes(categoryFromUrl)
    ? categoryFromUrl
    : "All";

  const [searchTerm, setSearchTerm] =
    useState(searchFromUrl);

  const [activeCategory, setActiveCategory] =
    useState(initialCategory);

  const [sortOrder, setSortOrder] =
    useState("featured");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const nextCategory =
      searchParams.get("category") || "All";

    const nextSearch =
      searchParams.get("search") || "";

    setActiveCategory(
      categories.includes(nextCategory)
        ? nextCategory
        : "All",
    );

    setSearchTerm(nextSearch);
  }, [categories, searchParams]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.category
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.shortDescription
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return [...result].sort(
      (firstProduct, secondProduct) => {
        if (sortOrder === "price-low") {
          return firstProduct.price - secondProduct.price;
        }

        if (sortOrder === "price-high") {
          return secondProduct.price - firstProduct.price;
        }

        if (sortOrder === "name") {
          return firstProduct.name.localeCompare(
            secondProduct.name,
          );
        }

        return (
          Number(secondProduct.featured) -
          Number(firstProduct.featured)
        );
      },
    );
  }, [
    activeCategory,
    products,
    searchTerm,
    sortOrder,
  ]);

  function updateUrlFilters(
    nextCategory,
    nextSearch = searchTerm,
  ) {
    const nextParameters = {};

    if (nextCategory && nextCategory !== "All") {
      nextParameters.category = nextCategory;
    }

    if (nextSearch.trim()) {
      nextParameters.search = nextSearch.trim();
    }

    setSearchParams(nextParameters);
  }

  function selectCategory(category) {
    setActiveCategory(category);
    updateUrlFilters(category);
  }

  function handleSearchChange(event) {
    const nextSearch = event.target.value;

    setSearchTerm(nextSearch);
  }

  function handleSearchBlur() {
    updateUrlFilters(activeCategory, searchTerm);
  }

  function clearFilters() {
    setSearchTerm("");
    setActiveCategory("All");
    setSearchParams({});
  }

  function handleQuickAdd(product) {
    addItem(
      product,
      1,
      product.colors?.[0] ?? "Standard",
    );

    setMessage(`${product.name} was added to your cart.`);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <>
      <PageMeta
        title={
          activeCategory === "All"
            ? "Shop All"
            : `Shop ${activeCategory}`
        }
        description="Browse the Maple & Main collection of thoughtfully curated everyday essentials."
      />

      <PageHero
        eyebrow="Maple & Main Collection"
        title="Shop thoughtfully curated essentials"
        description="Practical products selected for your home, personal routine and everyday life."
      />

      <section className="shopCatalog">
        {error && source === "local" && (
          <div className="catalogConnectionNotice">
            {error}
          </div>
        )}

        <div className="catalogToolbar">
          <label className="catalogSearch">
            <span>Search products</span>

            <input
              type="search"
              value={searchTerm}
              placeholder="What are you looking for?"
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  updateUrlFilters(
                    activeCategory,
                    searchTerm,
                  );
                }
              }}
            />
          </label>

          <label className="catalogSort">
            <span>Sort by</span>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
            >
              <option value="featured">Featured</option>
              <option value="price-low">
                Price: Low to high
              </option>
              <option value="price-high">
                Price: High to low
              </option>
              <option value="name">Product name</option>
            </select>
          </label>
        </div>

        <div
          className="catalogCategories"
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <button
              className={
                activeCategory === category
                  ? "isActive"
                  : ""
              }
              type="button"
              key={category}
              aria-pressed={activeCategory === category}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="catalogResultsHeader">
          <p aria-live="polite">
            {isLoading ? (
              "Loading products..."
            ) : (
              <>
                <strong>{filteredProducts.length}</strong>{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </>
            )}
          </p>

          {(searchTerm || activeCategory !== "All") && (
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="catalogEmpty">
            <h2>Loading the collection</h2>
            <p>
              We are retrieving the latest products from Maple & Main.
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="catalogGrid">
            {filteredProducts.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        ) : (
          <div className="catalogEmpty">
            <h2>No products found</h2>
            <p>
              Try another search term or clear the selected category.
            </p>
          </div>
        )}

        {message && (
          <div className="catalogMessage" role="status">
            {message}
          </div>
        )}
      </section>
    </>
  );
}

export default ShopPage;
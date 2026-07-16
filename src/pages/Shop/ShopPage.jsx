import { useMemo, useState } from "react";
import PageHero from "../../components/PageHero/PageHero";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext.jsx";
import {
  productCategories,
  products,
} from "../../data/products.js";
import "./ShopPage.css";

function ShopPage() {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");
  const [message, setMessage] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.shortDescription
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return [...result].sort((firstProduct, secondProduct) => {
      if (sortOrder === "price-low") {
        return firstProduct.price - secondProduct.price;
      }

      if (sortOrder === "price-high") {
        return secondProduct.price - firstProduct.price;
      }

      if (sortOrder === "name") {
        return firstProduct.name.localeCompare(secondProduct.name);
      }

      return Number(secondProduct.featured) - Number(firstProduct.featured);
    });
  }, [activeCategory, searchTerm, sortOrder]);

  function handleQuickAdd(product) {
  addItem(product, 1, product.colors?.[0] ?? "");

  setMessage(`${product.name} was added to your cart.`);

  window.setTimeout(() => {
    setMessage("");
  }, 3000);
}

  return (
    <>
      <PageHero
        eyebrow="Maple & Main Collection"
        title="Shop thoughtfully curated essentials"
        description="Practical products selected for your home, personal routine and everyday life."
      />

      <section className="shopCatalog">
        <div className="catalogToolbar">
          <label className="catalogSearch">
            <span>Search products</span>

            <input
              type="search"
              value={searchTerm}
              placeholder="What are you looking for?"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="catalogSort">
            <span>Sort by</span>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="name">Product name</option>
            </select>
          </label>
        </div>

        <div className="catalogCategories" aria-label="Product categories">
          {productCategories.map((category) => (
            <button
              className={activeCategory === category ? "isActive" : ""}
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="catalogResultsHeader">
          <p>
            <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {(searchTerm || activeCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
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
            <p>Try another search term or clear the selected category.</p>
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
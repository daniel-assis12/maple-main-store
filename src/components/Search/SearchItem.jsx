function SearchItem({
  product,
  isActive,
  onSelect,
  onMouseEnter,
}) {
  return (
    <button
      className={`searchResultItem ${isActive ? "isActive" : ""}`}
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(product)}
      onMouseEnter={onMouseEnter}
    >
      <span
        className={`searchResultImage ${product.imageClass}`}
        aria-hidden="true"
      />

      <span className="searchResultContent">
        <span className="searchResultCategory">
          {product.category}
        </span>

        <strong>{product.name}</strong>

        <span className="searchResultDescription">
          {product.shortDescription}
        </span>
      </span>

      <span className="searchResultPrice">
        ${product.price.toFixed(2)}
      </span>

      <span className="searchResultArrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

export default SearchItem;
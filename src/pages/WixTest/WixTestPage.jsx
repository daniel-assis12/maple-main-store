import { useCatalog } from "../../context/CatalogContext.jsx";

function WixTestPage() {
  const {
    products,
    source,
    isLoading,
    error,
  } = useCatalog();

  return (
    <section
      style={{
        minHeight: "65vh",
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          marginBottom: "14px",
          letterSpacing: "2px",
          fontWeight: "700",
        }}
      >
        WIX HEADLESS CATALOG
      </p>

      <h1
        style={{
          marginBottom: "20px",
          fontFamily: "Georgia, serif",
          fontSize: "48px",
          fontWeight: "500",
        }}
      >
        {isLoading
          ? "Loading catalog..."
          : source === "wix"
            ? "Real Wix catalog loaded"
            : "Local catalog loaded"}
      </h1>

      <p>
        Products available:{" "}
        <strong>{products.length}</strong>
      </p>

      {error && (
        <p
          style={{
            maxWidth: "700px",
            margin: "16px auto",
            color: "#8a3d36",
          }}
        >
          {error}
        </p>
      )}

      {!isLoading && (
        <div
          style={{
            width: "min(1000px, 100%)",
            margin: "40px auto 0",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "18px",
            textAlign: "left",
          }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              style={{
                padding: "18px",
                border: "1px solid #ded8d0",
              }}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    marginBottom: "14px",
                  }}
                />
              )}

              <small>{product.category}</small>

              <h2
                style={{
                  margin: "8px 0",
                  fontFamily: "Georgia, serif",
                  fontSize: "22px",
                }}
              >
                {product.name}
              </h2>

              <strong>
                {product.formattedPrice}
              </strong>

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                Slug: {product.slug}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default WixTestPage;
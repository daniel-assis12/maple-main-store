import "./PageHero.css";

function PageHero({ eyebrow, title, description }) {
  return (
    <section className="pageHero">
      <div className="pageHeroInner">
        {eyebrow && <span>{eyebrow}</span>}

        <h1>{title}</h1>

        {description && <p>{description}</p>}
      </div>
    </section>
  );
}

export default PageHero;
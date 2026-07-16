import PageHero from "../../components/PageHero/PageHero";

function NotFoundPage() {
  return (
    <PageHero
      eyebrow="404"
      title="We could not find that page"
      description="The page may have moved or the address may be incorrect."
    />
  );
}

export default NotFoundPage;
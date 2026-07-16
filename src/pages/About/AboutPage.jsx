import PageHero from "../../components/PageHero/PageHero";
import WhyMapleMain from "../../components/WhyMapleMain/WhyMapleMain";

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Everyday essentials, selected with intention"
        description="Maple & Main was created to make online shopping simpler through a focused collection of practical, useful and thoughtfully presented products."
      />

      <WhyMapleMain />
    </>
  );
}

export default AboutPage;
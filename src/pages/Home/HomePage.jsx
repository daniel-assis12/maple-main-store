import Hero from "../../components/Hero/Hero";
import Benefits from "../../components/Benefits/Benefits";
import Categories from "../../components/Categories/Categories";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FeaturedStory from "../../components/FeaturedStory/FeaturedStory";
import WhyMapleMain from "../../components/WhyMapleMain/WhyMapleMain";
import Testimonials from "../../components/Testimonials/Testimonials";
import Newsletter from "../../components/Newsletter/Newsletter";

function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Categories />
      <FeaturedProducts />
      <FeaturedStory />
      <WhyMapleMain />
      <Testimonials />
      <Newsletter />
    </>
  );
}

export default HomePage;
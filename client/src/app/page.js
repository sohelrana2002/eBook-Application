import BannerSection from "@/components/bannerSection/BannerSection";
import { featuredBook } from "@/lib/api";
import FeaturedBook from "@/components/featuredBook/FeaturedBook";
import FAQ from "@/components/FAQ/FAQ";
import Newsletter from "../components/newsletter/Newsletter";
import Footer from "../components/footer/Footer";

export default async function Home() {
  const allFeaturedBook = await featuredBook();
  return (
    <>
      <BannerSection />
      <FeaturedBook allFeaturedBook={allFeaturedBook} />
      <FAQ />
      <Newsletter />
      <Footer />
    </>
  );
}

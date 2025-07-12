import BannerSection from "@/components/bannerSection/BannerSection";
import { featuredBook } from "@/lib/api";
import FeaturedBook from "@/components/featuredBook/FeaturedBook";

export default async function Home() {
  const allFeaturedBook = await featuredBook();
  return (
    <>
      <BannerSection />
      <FeaturedBook allFeaturedBook={allFeaturedBook} />
    </>
  );
}

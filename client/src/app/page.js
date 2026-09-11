import BannerSection from "@/components/bannerSection/BannerSection";
import FAQ from "@/components/FAQ/FAQ";
import Newsletter from "../components/newsletter/Newsletter";
import { Suspense } from "react";
import CustomLoading from "@/shared/customLoading/CustomLoading";
import FeaturedBookWrapper from "@/components/featuredBook/FeaturedBookWrapper";

export default function Home() {
  return (
    <>
      <BannerSection />
      <Suspense fallback={<CustomLoading />}>
        <FeaturedBookWrapper />
      </Suspense>
      <FAQ />
      <Newsletter />
    </>
  );
}

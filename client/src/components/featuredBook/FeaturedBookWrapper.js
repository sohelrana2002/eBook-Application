import { featuredBook } from "@/lib/api";
import FeaturedBook from "./FeaturedBook";

const FeaturedBookWrapper = async () => {
  const allFeaturedBook = await featuredBook();

  return <FeaturedBook allFeaturedBook={allFeaturedBook} />;
};

export default FeaturedBookWrapper;

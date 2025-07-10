import "./BannerSection.css";
import Link from "next/link";

const BannerSection = () => {
  return (
    <div className="banner__section">
      <div className="banner__section-content">
        <h1>Smart Reading Starts Here.</h1>
        <Link href="/books" className="btn">
          Explore Now
        </Link>
      </div>
    </div>
  );
};

export default BannerSection;

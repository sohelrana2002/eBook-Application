import "./BannerSection.css";
import Link from "next/link";
import Image from "next/image";

const BannerSection = () => {
  return (
    <div className="banner__section">
      <Image
        src="/book-library.jpg"
        alt="Banner image"
        fill
        priority
        sizes="100%"
        className="object-cover object-center"
      />

      <div className="banner__section__overlay" />

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

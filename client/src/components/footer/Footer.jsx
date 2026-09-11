import "./Footer.css";

import Link from "next/link";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { ImLinkedin } from "react-icons/im";
import { BsGithub } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer__container">
      <div className="logo__section">
        <div>
          <Link href={"/"} prefetch={false} className="logo">
            <span>Knowledgea</span>
          </Link>
        </div>

        <p>
          Read books that inspire learning, expand knowledge, and help you grow
          smarter every single day
        </p>

        <div className="social__icon">
          <Link href="#" prefetch={false}>
            <FaFacebook size={20} />
          </Link>
          <Link href="#" prefetch={false}>
            <AiFillInstagram size={20} />
          </Link>
          <Link href="#" prefetch={false}>
            <ImLinkedin size={20} />
          </Link>
          <Link href="#" prefetch={false}>
            <BsGithub size={20} />
          </Link>
        </div>
      </div>

      <div className="explore">
        <h1 className="footer_heading">Explore</h1>
        <Link href="/" prefetch={false}>
          Home
        </Link>
        <Link href="/books" prefetch={false}>
          Books
        </Link>
        <Link href="/about-us" prefetch={false}>
          About Us
        </Link>
        <Link href="/blogs" prefetch={false}>
          Blogs
        </Link>
        <Link href="/contact" prefetch={false}>
          Contact
        </Link>
        <Link href="/request-book" prefetch={false}>
          Request Book
        </Link>
      </div>

      <div className="contact">
        <h1 className="footer_heading">Contact</h1>
        <Link href="#" prefetch={false}>
          <FaPhoneAlt size={21} className="align-middle" />{" "}
          <span>01751070854</span>
        </Link>
        <Link href="#" prefetch={false}>
          <MdEmail size={24} className="align-middle" />
          <span>sohelrana070854@gmail.com</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

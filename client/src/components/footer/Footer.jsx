import "./Footer.css";

import { NotebookText } from "lucide-react";
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
          <Link href={"/"} className="logo">
            <div>
              <NotebookText />
            </div>
            <span>e-Book Platform</span>
          </Link>
        </div>

        <p>
          Read books that inspire learning, expand knowledge, and help you grow
          smarter every single day
        </p>

        <div className="social__icon">
          <Link href="#">
            <FaFacebook size={20} />
          </Link>
          <Link href="#">
            <AiFillInstagram size={20} />
          </Link>
          <Link href="#">
            <ImLinkedin size={20} />
          </Link>
          <Link href="#">
            <BsGithub size={20} />
          </Link>
        </div>
      </div>

      <div className="explore">
        <h1 className="footer_heading">Explore</h1>
        <Link href="/">Home</Link>
        <Link href="/books">Books</Link>
        <Link href="/about-us">About Us</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/request-book">Request Book</Link>
      </div>

      <div className="contact">
        <h1 className="footer_heading">Contact</h1>
        <Link href="#">
          <FaPhoneAlt size={21} className="align-middle" />{" "}
          <span>01751070854</span>
        </Link>
        <Link href="#">
          <MdEmail size={24} className="align-middle" />
          <span>sohelrana070854@gmail.com</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

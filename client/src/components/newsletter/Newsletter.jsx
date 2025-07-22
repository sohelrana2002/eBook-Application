import "./Newsletter.css";

const Newsletter = () => {
  return (
    <div className="newsletter__coontainer">
      <div className="container">
        <h1 className="heading">Newsletter</h1>
        <div className="newsletter__content">
          <h2>
            Subscribe to our newsletter and stay updated on the latest book!
          </h2>

          <form>
            <input type="text" placeholder="Enter your email" />
            <button type="submit" className="btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;

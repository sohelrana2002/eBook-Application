import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not__found">
      <h1>404</h1>
      <h2>Sorry, we couldn&lsquo;t find this page.</h2>
      <p>
        But don&lsquo;t worry, you can find plenty of other things on our
        homepage.
      </p>
      <Link href="/" scroll={false} className="btn">
        Back to homepage
      </Link>
    </div>
  );
}

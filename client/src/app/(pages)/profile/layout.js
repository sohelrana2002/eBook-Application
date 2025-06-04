import "./ProfileLayout.css";
import Link from "next/link";

const ProfileLayout = ({ children }) => {
  return (
    <main>
      <div className="left__userProfile">
        <ul>
          <li className="border-b-2 border-[var(--border)] p-2 rounded-lg">
            <Link href="/profile" className="capitalize text-xl font-semibold">
              user dashboard
            </Link>
          </li>
        </ul>
      </div>
      <div className="right__userProfile">{children}</div>
    </main>
  );
};

export default ProfileLayout;

import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

const teamMembers = [
  {
    name: "Sohel Rana",
    role: "Founder & Developer",
    image: "/team/sohel.png",
  },
  {
    name: "Fahim Rahman",
    role: "Content Strategist",
    image: "/team/fahim.jpg",
  },
  {
    name: "Akib Ahmad Imu",
    role: "Python Developer",
    image: "/team/imu.jpg",
  },
  {
    name: "Tahsin Tonmoy",
    role: "UI/UX Designer",
    image: "/team/tahsin.jpg",
  },
  {
    name: "Sabit Raihan",
    role: "Problem Solver",
    image: "/team/sabit.png",
  },
  {
    name: "Ismail Hosen Somrat",
    role: "UI/UX Designer",
    image: "/team/somrat.jpg",
  },
];

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Us | e-Book Application</title>
        <meta
          name="description"
          content="Learn about the e-Book Application, our mission, and the team behind the platform."
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12 text-gray-800">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Welcome to <strong>e-Book Application</strong> — a digital platform
            built to make reading, discovering, and enjoying books easier than
            ever.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="heading mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe books should be accessible to everyone, anywhere,
            anytime. Our mission is to create a seamless digital reading
            experience, helping users explore and enjoy thousands of books
            across genres, languages, and cultures. Whether you&apos;re a casual
            reader or a lifelong bookworm, our platform is made for you.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden border-4 border-[var(--border)] shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Thousands of books to read online or offline</li>
            <li>Clean and distraction-free reading interface</li>
            <li>Smart search and filters by genre, language, price</li>
            <li>Book request feature for unavailable titles</li>
            <li>Role-based system for readers and admins</li>
            <li>Personalized book recommendations</li>
          </ul>
        </section>

        <section className="text-center mt-10">
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p className="mb-4">
            Whether you&apos;re a reader, author, or publisher, we&apos;re
            excited to have you with us. Start exploring your next favorite book
            today!
          </p>
          <Link
            href="/books"
            className="inline-block bg-[var(--blue)] text-white px-6 py-2 rounded-full"
          >
            Explore Books
          </Link>
        </section>
      </main>
    </>
  );
};

export default AboutPage;

"use client";

import Head from "next/head";

const CopyRight = () => {
  return (
    <>
      <Head>
        <title>Copyright Notice | Sohel Rana</title>
        <meta
          name="description"
          content="Copyright information for Sohel Rana's website and its content."
        />
      </Head>

      <main className=" py-5 text-gray-800 text-center">
        <hr className="border-t border-gray-300 pb-5" />
        <p>
          © {new Date().getFullYear()} <strong>Sohel Rana</strong>. All rights
          reserved.
        </p>
      </main>
    </>
  );
};

export default CopyRight;

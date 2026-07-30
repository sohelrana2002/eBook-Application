import { Loader2, Server } from "lucide-react";

const ServerLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-5">
            <Server className="h-12 w-12 text-black" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">Waking up the server...</h1>

        <p className="mt-3 text-gray-800">
          Our backend is hosted on Render's free tier.
          <br />
          The first request may take <strong>30–60 seconds</strong>.
        </p>

        <div className="mt-8">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-black" />
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-blue-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-black" />
        </div>

        <p className="mt-5 text-sm text-gray-800">
          Please keep this page open. We'll continue automatically once the
          server is ready.
        </p>
      </div>
    </div>
  );
};

export default ServerLoader;

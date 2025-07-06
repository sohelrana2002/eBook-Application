import React from "react";
import Heading from "@/shared/heading/Heading";
import { HandHelping } from "lucide-react";

const RequestedBook = () => {
  return (
    <main>
      <div>
        <Heading icon={<HandHelping />} title="Requested Book" />
      </div>
    </main>
  );
};

export default RequestedBook;

import React from "react";
import { Button } from "./components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div>
      <h1 class="text-3xl font-bold underline text">Hello world!</h1>

      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
        <Link className={buttonVariants({ variant: "outline" })}>
          Click here
        </Link>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  );
};

export default App;

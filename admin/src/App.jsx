import React from "react";
import style from "./index.module.css";

const App = () => {
  return (
    <div>
      <h1 class="text-3xl font-bold underline text">Hello world!</h1>

      <div className={`${style.container} font-bold underline text`}>hello</div>
    </div>
  );
};

export default App;

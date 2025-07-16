"use client";

import "./FAQ.css";

import { useState } from "react";
import { FAQData } from "@/data/Data";
import { Minus, Plus } from "lucide-react";

const FAQ = () => {
  const [answerShowing, setAnswerShowing] = useState(null);

  const handleClick = (id) => {
    if (answerShowing === id) {
      setAnswerShowing(null);
      return;
    } else {
      setAnswerShowing(id);
    }
  };

  return (
    <main className="container faq__container">
      <h1 className="heading">FAQ</h1>

      <div className="faq__box">
        {FAQData &&
          FAQData?.map((curElem) => {
            return (
              <div className="faq__content" key={curElem.id}>
                <div
                  className="faq__question"
                  onClick={() => handleClick(curElem.id)}
                >
                  <span>{curElem.question}</span>
                  <span>
                    {answerShowing === curElem.id ? <Minus /> : <Plus />}
                  </span>
                </div>
                <div
                  className={`${
                    answerShowing === curElem.id
                      ? "faq__answer active"
                      : "faq__answer"
                  } `}
                >
                  {curElem.answer}
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default FAQ;

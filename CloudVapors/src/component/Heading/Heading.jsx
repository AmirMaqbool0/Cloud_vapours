import React from "react";
import "./style.css";

const Heading = ({text,head,info}) => {
  return (
    <div className="heading-main-container">
      <p>{text}</p>
      <h1>{head}</h1>
      <span>{info}</span>

    </div>
  );
};

export default Heading;
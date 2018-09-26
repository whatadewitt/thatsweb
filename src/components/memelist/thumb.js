import React from "react";
import { Link } from "react-router-dom";

import placeholder from "../../assets/placeholder.png";

const MemeThumb = ({ uuid }) => {
  return (
    <div className="thatsweb-list__meme">
      <Link to={`/memes/${uuid}`}>
        <img
          src={
            typeof uuid === "undefined"
              ? placeholder
              : `//www.thatsweb.ca/uploads/${uuid}.png`
          }
          alt="uploaded meme thumbnail"
        />
      </Link>
    </div>
  );
};

export default MemeThumb;

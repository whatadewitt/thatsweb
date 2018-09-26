import React from "react";
import { Link } from "react-router-dom";

const Home = props => {
  return (
    <div className="thatsweb-home">
      <h1 className="thatsweb__title">That's Web</h1>
      <h2 className="thatsweb__subtitle">A Meme Generator by Luke Dewitt</h2>

      <div class="thatsweb-nav">
        <Link to="/tool">
          <button className="thatsweb-button -home">
            Be the Meme! &raquo;
          </button>
        </Link>
        <Link to="/memes">
          <button className="thatsweb-button -home">
            See the Meme! &raquo;
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

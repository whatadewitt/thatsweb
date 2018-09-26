import React from "react";
import { withRouter } from "react-router-dom";

const MemeView = ({ match, history }) => {
  const uuid = match.params.uuid;
  return (
    <div className="thatsweb__meme">
      <img src={`//www.thatsweb.ca/uploads/${uuid}.png`} alt={`meme ${uuid}`} />
      <button className="thatsweb-button -back" onClick={history.goBack}>
        &laquo; Back
      </button>
    </div>
  );
};

export default withRouter(MemeView);

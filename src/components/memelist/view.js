import React from "react";
import { withRouter } from "react-router-dom";

const MemeView = ({ match }) => {
  const uuid = match.params.uuid;
  return (
    <div className="thatsweb__meme">
      <img src={`//www.thatsweb.ca/uploads/${uuid}.png`} alt={`meme ${uuid}`} />
    </div>
  );
};

export default withRouter(MemeView);

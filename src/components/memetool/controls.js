/* global FB */

import React, { PureComponent } from "react";
class MemeControls extends PureComponent {
  constructor(props) {
    super(props);

    this.downloadMeme = this.downloadMeme.bind(this);
    this.shareToFacebook = this.shareToFacebook.bind(this);
  }

  renderTakePicture() {
    const { takePic } = this.props;

    return (
      <button className="thatsweb-button" onClick={takePic}>
        Take Picture
      </button>
    );
  }

  renderMemeOptions() {
    const { previewMeme, makeAMeme, restart } = this.props;

    return (
      <React.Fragment>
        <button
          className="thatsweb-button -meme"
          onClick={makeAMeme}
          onMouseEnter={() => previewMeme(true)}
          onMouseLeave={() => previewMeme(false)}
        >
          Meme This!
        </button>
        <button className="thatsweb-button -restart" onClick={restart}>
          Start Over
        </button>
      </React.Fragment>
    );
  }

  renderProcessing() {
    return <div className="thatsweb-tool__processing">Processing</div>;
  }

  shareToFacebook() {
    FB.ui(
      {
        method: "share",
        href: this.props.photoUrl,
        quote:
          "Check out this sweet meme I made and make your own at https://www.thatsweb.ca #thatsweb #fitc #webunleashed"
      },
      resp => {}
    );
  }

  downloadMeme() {
    let x = new XMLHttpRequest();
    x.open("GET", this.props.photoUrl, true);
    x.responseType = "blob";
    x.onload = function(e) {
      require("downloadjs")(e.target.response, "sweet-meme.png", "image/png");
    };
    x.send();
  }

  renderShare() {
    const { restart, photoUrl } = this.props;

    return (
      <React.Fragment>
        <div className="thatsweb-tool__share">
          <span className="thatsweb-tool__share-title">Share This Meme</span>
          <div
            onClick={() => this.shareToFacebook()}
            title="Share on Facebook"
            className="thatsweb-tool__share-icon"
          >
            <svg
              aria-hidden="true"
              data-prefix="fab"
              data-icon="facebook-f"
              className="svg-inline--fa fa-facebook-f fa-w-9"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 264 512"
            >
              <path
                fill="currentColor"
                d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229"
              />
            </svg>
          </div>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "Check out this sweet meme I made and make your own!"
            )} ${photoUrl}&url=https://www.thatsweb.ca&via=fitc, @whatadewitt&hashtags=webunleashed,thatsweb,serverless`}
            title="Share on Twitter"
            className="thatsweb-tool__share-icon"
          >
            <svg
              aria-hidden="true"
              data-prefix="fab"
              data-icon="twitter"
              className="svg-inline--fa fa-twitter fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
              />
            </svg>
          </a>
          <div
            onClick={() => this.downloadMeme()}
            title="Save For Later"
            className="thatsweb-tool__share-icon"
          >
            <svg
              aria-hidden="true"
              data-prefix="fas"
              data-icon="download"
              className="svg-inline--fa fa-download fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
              />
            </svg>
          </div>
        </div>
        <button className="thatsweb-button -restart" onClick={restart}>
          Start Over
        </button>
      </React.Fragment>
    );
  }

  render() {
    const { stage } = this.props;
    let screen;

    switch (stage) {
      case "photo":
        screen = this.renderMemeOptions();
        break;

      case "share":
        screen = this.renderShare();
        break;

      case "processing":
        screen = this.renderProcessing();
        break;

      default:
        screen = this.renderTakePicture();
        break;
    }

    return <div className={"thatsweb-tool__controls -" + stage}>{screen}</div>;
  }
}

export default MemeControls;

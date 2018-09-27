import React, { PureComponent } from "react";
import Amplify from "aws-amplify";
import shortid from "shortid";

import classNames from "classnames";
import Loader from "../loader";
import MemeControls from "./controls";

import memePreview from "../../assets/thatsweb.png";

class MemeTool extends PureComponent {
  constructor(props) {
    super(props);

    this.video = React.createRef();
    this.canvas = React.createRef();
    this.photo = React.createRef();

    this.width = 800; // We will scale the photo width to this
    this.height = 600; // This will be computed based on the input stream

    this.state = {
      complete: false,
      photoUrl: "",
      stage: "video",
      streaming: false,
      working: false
    };

    this.imageData = false;
    this.makeAMeme = this.makeAMeme.bind(this);
    this.restart = this.restart.bind(this);
    this.takePic = this.takePic.bind(this);
    this.previewMeme = this.previewMeme.bind(this);
    this.searchForMeme = this.searchForMeme.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.video.current.srcObject.getTracks()[0].stop();
  }

  init() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.video.current.srcObject = stream;
        this.video.current.play();
      })
      .catch(err => {
        console.log("An error occurred! " + err);
      });

    this.video.current.addEventListener(
      "canplay",
      () => {
        if (!this.state.streaming) {
          this.height =
            this.video.current.videoHeight /
            (this.video.current.videoWidth / this.width);

          this.video.current.setAttribute("width", this.width);
          this.video.current.setAttribute("height", this.height);
          this.canvas.current.setAttribute("width", this.width);
          this.canvas.current.setAttribute("height", this.height);
          this.setState({
            streaming: true
          });
        }
      },
      false
    );

    this.clearPhoto();
  }

  clearPhoto() {
    let context = this.canvas.current.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(
      0,
      0,
      this.canvas.current.width,
      this.canvas.current.height
    );

    let data = this.canvas.current.toDataURL("image/png");
    this.photo.current.setAttribute("src", data);
  }

  restart() {
    this.setState({
      stage: "video"
    });

    this.init();
  }

  takePic(event) {
    event.preventDefault();

    // remove outline from the newly hovered button
    document.activeElement.blur();

    let context = this.canvas.current.getContext("2d");
    if (this.width && this.height) {
      this.canvas.current.width = this.width;
      this.canvas.current.height = this.height;
      context.drawImage(this.video.current, 0, 0, this.width, this.height);

      let data = this.canvas.current.toDataURL("image/png");
      this.photo.current.setAttribute("src", data);

      this.setState({
        stage: "photo",
        streaming: false
      });
    } else {
      this.clearPhoto();
    }
  }

  previewMeme(visible) {
    let context = this.canvas.current.getContext("2d");

    context.drawImage(this.photo.current, 0, 0);

    if (visible) {
      let preview = new Image();
      preview.onload = () => {
        context.drawImage(preview, 0, 0, this.width, this.height);
      };

      preview.src = memePreview;
    }
  }

  makeAMeme() {
    this.setState({
      stage: "processing"
    });

    Amplify.configure({
      Auth: {
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
        region: process.env.REACT_APP_AWS_REGION
      },
      Storage: {
        bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        region: process.env.REACT_APP_AWS_REGION
      }
    });

    let filename = shortid.generate();
    this.setState({
      photoUrl: `https://www.thatsweb.ca/uploads/${filename}.png`
    });

    Amplify.Storage.put(
      `${filename}.png`,
      this.dataURItoBlob(this.photo.current.src),
      {
        contentType: "image/png",
        customPrefix: {
          public: "uploads/"
        }
      }
    )
      .then(result => this.searchForMeme())
      .catch(err => console.log(err));
  }

  searchForMeme() {
    let img = new Image();

    img.onload = () => {
      this.photo.current.src = this.state.photoUrl;
      this.setState({
        stage: "share"
      });
    };

    img.onerror = () => {
      // try again in half a second...
      img = null;
      return setTimeout(this.searchForMeme, 500);
    };

    img.src = this.state.photoUrl;
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type: "image/png" });
  }

  render() {
    const canvasClass = classNames({
      "thatsweb-tool__group": true,
      "-canvas": true,
      "-hidden": this.state.stage === "video"
    });

    const videoClass = classNames({
      "thatsweb-tool__group": true,
      "-video": true,
      "-hidden": this.state.stage !== "video"
    });

    const loader = "processing" === this.state.stage ? <Loader /> : "";

    return (
      <div className="thatsweb__main -tool">
        <header className="thatsweb__header">
          <h1 className="thatsweb__title">That's Web</h1>
          <h2 className="thatsweb__subtitle">
            A Meme Generator by Luke Dewitt
          </h2>
        </header>

        <div className="thatsweb-tool__container">
          <div className={videoClass}>
            <video ref={this.video} width="800" height="600">
              Video stream not available.
            </video>
          </div>

          <div className={canvasClass}>
            <canvas ref={this.canvas} />
            {loader}
            <div className="output -hidden">
              <img
                ref={this.photo}
                alt="The screen capture will appear in this box."
              />
            </div>
          </div>

          <MemeControls
            stage={this.state.stage}
            takePic={this.takePic}
            restart={this.restart}
            previewMeme={this.previewMeme}
            makeAMeme={this.makeAMeme}
            photoUrl={this.state.photoUrl}
            shareToFacebook={this.shareToFacebook}
          />
        </div>
      </div>
    );
  }
}

export default MemeTool;

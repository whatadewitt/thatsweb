import React, { PureComponent } from "react";

import { BrowserRouter, Route, Link } from "react-router-dom";

import createBrowserHistory from "history/createBrowserHistory";

import MemeThumb from "./thumb";
import MemeView from "./view";

const history = createBrowserHistory();

class MemeList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      memes: []
    };
  }

  componentDidMount() {
    fetch(`https://api.thatsweb.ca/v1/memes?r=${Math.random()}`, {
      headers: {
        "x-api-key": process.env.REACT_APP_GATEWAY_API_KEY
      }
    })
      .then(resp => resp.json())
      .then(resp =>
        this.setState({
          memes: resp.memes
        })
      )
      .catch(err => {
        // TODO: should probably handle this
        console.log(err);
      });
  }

  render() {
    const { memes } = this.state;

    return (
      <div className="thatsweb__main">
        <header className="thatsweb__header">
          <h1 className="thatsweb__title">Check out these sweet memes!</h1>
        </header>
        <div className="thatsweb__list">
          <BrowserRouter history={history}>
            <React.Fragment>
              <Route
                exact
                path="/memes"
                component={() => (
                  <div className="thatsweb-list__memes">
                    {memes.map((m, idx) => (
                      <MemeThumb uuid={m} key={idx} />
                    ))}
                  </div>
                )}
              />
              <Route path="/memes/:uuid" component={MemeView} />
            </React.Fragment>
          </BrowserRouter>
          <Link to="/tool">
            <button className="thatsweb-button">
              I gotta make one for myself! &raquo;
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default MemeList;

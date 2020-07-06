import React from "react";
import Category from "./Category";

export default class ContentPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayCategory: <Category categoryName={'All'} />,
    };
    this.setContentPane = this.setContentPane.bind(this);
  }

  setContentPane(content){
    this.setState ({
      displayCategory: content
    });
  }

  render() {
    return (
      <div className="content-pane">
        {this.state.displayCategory}
      </div>
    )
  }
}

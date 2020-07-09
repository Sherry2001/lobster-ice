import React from "react";
import Category from "./Category";
import Item from './Item';
import '../stylesheets/ContentPane.css';

export default class ContentPane extends React.Component {
  constructor(props) {
    const eiffelTower = {
      highlight: "eiffel tower",
      sourceLink: ".",
    };
    super(props);
    this.state = {
      displayCategory: <Category categoryName={'All'} />,
      items: [
        eiffelTower,
        eiffelTower,
        eiffelTower,
        eiffelTower,
      ],
    };
    this.setContentPane = this.setContentPane.bind(this);
  }

  setContentPane(content) {
    this.setState({
      displayCategory: content
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.displayCategory}
        <div className="wrap tile is-ancestor">
          {this.state.items.map((item, i) => {
            return <Item key={i} item={item} />;
          })}
        </div>
      </React.Fragment>
    );
  }
}

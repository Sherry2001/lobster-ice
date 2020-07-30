import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.displayError = this.displayError.bind(this);
  }

  displayError() {
    if (this.props.hasError) {
      return (
        <div className="notification is-warning">
          <button className="delete" onClick={this.props.closePopup}></button>
          {this.props.message}
        </div>
      );
    }
    return null;
  }

  render() {
    return this.displayError();
  }
}

ErrorMessage.propTypes = {
  closePopup: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
};

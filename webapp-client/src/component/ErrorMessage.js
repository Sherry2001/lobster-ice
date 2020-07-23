import React from 'react';
<<<<<<< HEAD
import PropTypes from 'prop-types';
=======
>>>>>>> React post create category & error message component (#20)

export default class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
=======
    this.state = {
      openWindow: true,
    };
>>>>>>> React post create category & error message component (#20)
    this.displayError = this.displayError.bind(this);
  }

  displayError() {
<<<<<<< HEAD
    if (this.props.hasError) {
=======
    if (this.props.hasError && this.state.openWindow) {
>>>>>>> React post create category & error message component (#20)
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
<<<<<<< HEAD

ErrorMessage.propTypes = {
  closePopup: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
};
=======
>>>>>>> React post create category & error message component (#20)

import React from 'react';
import { Button, TextField, withStyles } from 'material-ui';
import PropTypes from 'prop-types';
import { button as buttonStyle } from '../common/styles';

const styles = {
  button: {
    ...buttonStyle,
    marginLeft: '2em',
  },
};

class ForgotPasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mail: undefined,
    };
    this.handleUpdateMail = this.handleUpdateMail.bind(this);
  }

  handleUpdateMail(mail) {
    this.setState({
      mail,
    });
  }

  render() {
    const { handleFormSubmit, renderAlert, classes } = this.props;

    return (
      <form onSubmit={handleFormSubmit}>
        <div>
          <TextField
            name="email"
            label="Mail Address"
            onChange={event => this.handleUpdateMail(event.target.value)}
          />
          <Button
            type="button"
            className={classes.button}
            onClick={() => handleFormSubmit(this.state.mail)}
          >
            Reset password
          </Button>
        </div>
        <div>
          {renderAlert()}
        </div>
      </form>
    );
  }
}

ForgotPasswordForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ForgotPasswordForm);

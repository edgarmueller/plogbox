import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import { Button, TextField, withStyles } from 'material-ui';
import PropTypes from 'prop-types';
import { button, formButtonBar } from '../common/styles';

const RadiumLink = Radium(Link);

const styles = {
  button,
  formButtonBar,
  forgotPassword: {
    textDecoration: 'none',
    color: '#333435',
    paddingLeft: '1em',
    paddingRight: '1em',
    display: 'inline-flex',
    marginLeft: '1em',
    marginRight: '1em',
    height: '36px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#80CBC4',
      color: '#fff',
    },
    alignItems: 'center',
    textTransform: 'uppercase',
    fontSize: '0.8em',
    letterSpacing: '0.065em',
  },
};

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
    };
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleUpdateUser(event) {
    this.setState({
      user: event.target.value,
    });
  }

  handleUpdatePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  render() {
    const { classes, handleFormSubmit, renderAlert } = this.props;

    return (
      <form onSubmit={() => handleFormSubmit(this.state.user, this.state.password)}>
        <TextField
          required
          type="text"
          label="Mail Address"
          onChange={this.handleUpdateUser}
        />
        <br />
        <TextField
          required
          type="password"
          label="Password"
          onChange={this.handleUpdatePassword}
        />
        <br />

        <p className={classes.formButtonBar}>
          <Button
            type="submit"
            className={classes.button}
          >
            Login
          </Button>
          <RadiumLink to="/password/forgot" className={classes.forgotPassword}>
            Forgot password?
          </RadiumLink>
        </p>

        {renderAlert()}
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoginForm);

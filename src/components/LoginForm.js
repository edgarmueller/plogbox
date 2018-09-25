import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import { Button, TextField, withStyles } from 'material-ui';
import PropTypes from 'prop-types';
import { button, errorStyle, formButtonBar } from '../common/styles';

const RadiumLink = Radium(Link);

const styles = {
  button,
  error: errorStyle,
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
  state = {
    user: undefined,
    password: undefined,
    success: undefined,
    error: undefined,
  };

  handleUpdateUser = (event) => {
    this.setState({
      user: event.target.value,
    });
  }

  handleUpdatePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  handleSubmit = (ev) => {
    console.log('call me!!', this.props.loginUser);
    ev.preventDefault();
    this.props.loginUser(this.state.user, this.state.password)
      .then(error => {
          if (error) {
            console.log("LOGIN ERROR!", error.response.data);
            this.setState({
              success: false,
              error: error.response.data.messages.join('')
            })
          }
        }
      );
  }

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
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
        {
          this.state.error &&
          (
            <div className={classes.error}>
              {this.state.error}
            </div>
          )
        }
      </form>
    );
  }
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoginForm);

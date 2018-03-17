import React from 'react';
import { AppBar, Card, CardContent, Toolbar, withStyles } from 'material-ui';
import PropTypes from 'prop-types';
import { appBar, button, card, cardContent, header } from '../common/styles';
import ChangePasswordForm from '../containers/ChangePasswordFormContainer';

const styles = () => ({
  appBar,
  button,
  card,
  cardContent,
  header,
});

export const ProfilePage = ({ classes, navigateTo }) => (
  <div>
    <AppBar className={classes.appBar} position="static">
      <Toolbar className={classes.header}>
        PROFILE SETTINGS
      </Toolbar>
    </AppBar>
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <p>You can change your password anytime. To do so, enter your current password and then your new password twice.</p>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  </div>
);

ProfilePage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  navigateTo: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProfilePage);

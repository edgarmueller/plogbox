import React from 'react';
import { AppBar, Button, Card, CardContent, Toolbar, Typography, withStyles } from 'material-ui';
import PropTypes from 'prop-types';

const styles = () => ({
  // TODO duplicate styles appBar, card & cardContent, see EditPostPage
  appBar: {
    backgroundColor: '#fbddcf',
    borderBottom: '1px solid #ebebeb',
    boxShadow: 'none',
    borderTopLeftRadius: '1em',
    borderTopRightRadius: '1em',
  },
  card: {
    background: 'none',
    boxShadow: 'none',
    borderRadius: '0.25em',
    padding: 0,
  },
  cardContent: {
    backgroundColor: '#fff',
    // use theme's spacing?
    padding: '8px 0 0 0',
    borderBottomLeftRadius: '1em',
    borderBottomRightRadius: '1em',
  },
});

export const ProfilePage = ({ classes, navigateTo }) => (
  <Card className={classes.card}>
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Typography type="headline">
          PROFILE SETTINGS
        </Typography>
      </Toolbar>
    </AppBar>
    <CardContent className={classes.cardContent}>
      <p>
        You can change your password anytime. To do so, click the button below
      </p>
      <Button
        onClick={() => navigateTo('/password/change')}
        color={'primary'}
      >
        Change password
      </Button>
    </CardContent>
  </Card>
  );

ProfilePage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  navigateTo: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProfilePage);

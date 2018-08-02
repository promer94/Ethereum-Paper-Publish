import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import logo from '../ethereum.svg'

const styles = {
  wrapper: {
    margin: '0 auto',
    width: '80%',
    maxWidth: '1200px',
    display: 'flex',
  },
  toolbar: {
    padding: 0,
    flex: 1,
    display: 'flex',
  },
  logo:{
    height: '36px',
    weight:'36px',
  },
  flexContainer: {
    flex: 1,
    display: 'flex',
    justifyContent:'center',
  },
  anchor: {
    display: 'block',
    textDecoration: 'none',
    marginRight: '16px',
  },
};

class Header extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static" color="background">
        <div className={classes.wrapper}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="title" color="primary">
              Ethereum Smart Paper
            </Typography>
            <div className={classes.flexContainer}>
              <img className={classes.logo} src={logo} alt="logo"></img>
            </div>
              <Button variant="raised" color="primary">
                New Paper
              </Button>
          </Toolbar>
        </div>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
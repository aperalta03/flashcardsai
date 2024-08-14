import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../../firebase'; // Adjust the import path according to your project structure
import styles from './userbtn.module.css';

export default function UserButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = '/'; // Redirect to homepage after sign out
  };

  const handleCancelSubscription = () => {
    setOpenDialog(true);
  };

  const handleConfirmCancel = () => {
    // Implement subscription cancellation logic here
    setOpenDialog(false);
    // Optionally redirect or show a success message
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box className={styles.userButtonContainer}>
      <Button className={styles.userButton} onClick={handleMenuClick}>
        User
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className={styles.userMenu}
      >
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        <MenuItem onClick={handleCancelSubscription}>Cancel Subscription</MenuItem>
      </Menu>

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Subscription"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmCancel} color="primary" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

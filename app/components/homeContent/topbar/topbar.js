import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Box, Button } from '@mui/material';
import styles from './topbar.module.css';

const TopBar = () => {
    return (
        <Box className={styles.barContainer}>
            <Box className={styles.buttonsContainer}>
                <SignedOut>
                    <SignInButton>
                        <Button className={styles.button}>LogIn</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button className={styles.button}>Registrate</Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Box>
        </Box>
    );
};

export default TopBar;
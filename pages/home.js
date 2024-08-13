import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Box, Button, Typography } from '@mui/material';
import styles from './home.module.css';
import ThreeDFlash from './3dflash.js';

export default function Home() {
    return (
        <Box className={styles.mainContainer}>
            {/* App Bar */}
            <Box className={styles.barContainer}>
                <Box className={styles.buttonsContainer}>
                    <SignedOut>
                        <SignInButton>
                            <Button className={styles.button}>Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button className={styles.button}>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Box>
            </Box>
            {/* Content Container */}
            <Box className={styles.contentContainer}>
                <Box className={styles.carrouselOneContainer}></Box>
                <Box className={styles.content}>
                    <Box className={styles.backgroundCard}>
                        <ThreeDFlash />
                    </Box>
                </Box>
                <Box className={styles.carrouselTwoContainer}></Box>
            </Box>
        </Box>
    );
}

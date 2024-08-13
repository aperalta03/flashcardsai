import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import styles from './3dflash.module.css';

const ThreeDFlashcard = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * 10; // Rotation strength
        const rotateY = (centerX - x) / centerX * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <Box 
            className={styles.cardContainer} 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Box 
                className={styles.card} 
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            >
                <Box className={styles.cardFront}>
                    Welcome to Flashie
                </Box>
            </Box>
        </Box>
    );
};

export default ThreeDFlashcard;

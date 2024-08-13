// index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import  { Container, Typography } from '@mui/material';
import styles from './index.module.css';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <Container className={styles.container} maxWidth={false}>
      <Typography className={styles.title}>Loading...</Typography>
    </Container> 
  );
};

export default HomePage;
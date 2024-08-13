import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import HomePage from '../app/components/homeContent/homePage';

export default function Home() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push('/flashcards');
        }
    }, [isSignedIn, isLoaded, router]);

    if (!isLoaded) {
        return <div>Loading...</div>; // Optional: Show a loading state while checking sign-in status
    }

    return <HomePage />;
}

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Box, Button, Typography, TextField } from "@mui/material";
import styles from "./flashcards.module.css";

export default function Flashcard() {
  const [showInput, setShowInput] = useState(false);
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setTopic(e.target.value);
  };

  const handleGenerateFlashcards = async () => {
    if (!topic) return;

    const response = await fetch("/api/generates", {
      method: "POST",
      body: topic,
    });

    if (!response.ok) {
        console.error("Error with API request:", response.statusText);
        return;
      }
      
      try {
        const generatedFlashcards = await response.json();
        setFlashcards(generatedFlashcards.flashcards || []); // Ensure it's an array
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        setFlashcards([]); // Handle the case where parsing fails
      }
      
      setShowInput(false); // hide the input after generating
      setTopic(""); // clear the topic input field
  };

  return (
    <Box className={styles.mainContainer}>
      <Box className={styles.header}>
        <UserButton className={styles.user} />
      </Box>
      <Typography className={styles.title}>Flashcards</Typography>
      <Box className={styles.add}>
        <Button className={styles.addFlashes} onClick={handleAddClick}>
          ADD
        </Button>
      </Box>
      {showInput && (
        <Box className={styles.inputContainer}>
          <TextField
            className={styles.textField}
            placeholder="Enter topic (e.g., Planets)"
            value={topic}
            onChange={handleInputChange}
            variant="outlined"
          />
          <Button className={styles.generateButton} onClick={handleGenerateFlashcards}>
            Generate Flashcards
          </Button>
        </Box>
      )}
      <Box className={styles.flashcardsContainer}>
        {flashcards.map((flashcard, index) => (
          <Box key={index} className={styles.flashcard}>
            <Typography className={styles.flashcardFront}>
              {flashcard.front}
            </Typography>
            <Typography className={styles.flashcardBack}>
              {flashcard.back}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

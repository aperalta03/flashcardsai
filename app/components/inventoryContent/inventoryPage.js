import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import AddBar from "./addbar/addbar";
import AddPop from "./addbar/addpop/addpop";
import FlashcardSet from "./flashcardset/flashcardset";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./inventoryPage.module.css";

export default function InventoryPages() {
  const { user } = useUser();
  const [showInput, setShowInput] = useState(false);
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    try {
      const flashcardsRef = doc(db, "flashcards", `user_${user.id}`);
      const flashcardsSnap = await getDoc(flashcardsRef);
      if (flashcardsSnap.exists()) {
        const categories = flashcardsSnap.data().categories || [];
        const initializedCategories = categories.map(category => ({
          ...category,
          flashcards: category.flashcards.map(card => ({ ...card, flipped: false }))
        }));
        setFlashcards(initializedCategories);
      } else {
        setFlashcards([]);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setTopic(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleGenerateFlashcards = async () => {
    if (!topic || !category) return;

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
      const newFlashcards = generatedFlashcards.flashcards.map(card => ({
        front: card.front,
        back: card.back,
        flipped: false
      }));

      const flashcardsRef = doc(db, "flashcards", `user_${user.id}`);
      const flashcardsSnap = await getDoc(flashcardsRef);

      let categories = [];
      if (flashcardsSnap.exists()) {
        categories = flashcardsSnap.data().categories || [];
      }

      const categoryIndex = categories.findIndex(c => c.categoryName === category);
      if (categoryIndex > -1) {
        categories[categoryIndex].flashcards = [...categories[categoryIndex].flashcards, ...newFlashcards];
      } else {
        categories.push({ categoryName: category, flashcards: newFlashcards });
      }

      await setDoc(flashcardsRef, { categories }, { merge: true });

      setFlashcards(categories);
    } catch (error) {
      console.error("Failed to parse JSON or save flashcards:", error);
    }

    setShowInput(false);
    setTopic("");
    setCategory("");
  };

  const handleCardFlip = (categoryIndex, cardIndex) => {
    const updatedFlashcards = [...flashcards];
    const card = updatedFlashcards[categoryIndex].flashcards[cardIndex];
    card.flipped = !card.flipped;
    setFlashcards(updatedFlashcards);
  };

  return (
    <Box className={styles.mainContainer}>
      <AddBar onAddClick={handleAddClick} />
      <AddPop
        open={showInput}
        onClose={() => setShowInput(false)}
        onCategoryChange={handleCategoryChange}
        onTopicChange={handleInputChange}
        onGenerateFlashcards={handleGenerateFlashcards}
        category={category}
        topic={topic}
      />
      {flashcards.map((categoryObj, categoryIndex) => (
        <FlashcardSet
          key={categoryIndex}
          category={categoryObj.categoryName}
          cards={categoryObj.flashcards}
          onFlip={(index) => handleCardFlip(categoryIndex, index)}
        />
      ))}
    </Box>
  );
}

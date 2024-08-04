import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Rating,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

const ReviewForm = ({ audiobookId, onClose }) => {
  const [userId, setUserId] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `https://audio-book-backend.onrender.com/audiobooks/${audiobookId}/reviews`,
        {
          userId,
          rating,
          reviewText,
        }
      );
      setMessage("Review submitted successfully");
      onClose();
    } catch (error) {
      setMessage(
        "Failed to submit review: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={3}
      maxWidth={400}
      mx="auto"
      bgcolor="background.paper"
      borderRadius={1}
      boxShadow={3}
    >
      <Typography variant="h6" gutterBottom>
        Leave a Review:
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="User ID"
          fullWidth
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
        <Rating
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Review"
          fullWidth
          multiline
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
        <Box display="flex" alignItems="center" mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Review"}
          </Button>
        </Box>
      </form>
      {message && (
        <Typography
          color={
            message.includes("successfully") ? "success.main" : "error.main"
          }
          mt={2}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ReviewForm;

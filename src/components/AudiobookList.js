import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useTheme } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ReviewForm from "../components/ReviewForm";
import Swal from "sweetalert2";

const AudiobookList = () => {
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const response = await axios.get(
          "https://audio-book-backend.onrender.com/audiobooks"
        );
        setAudiobooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching audiobooks:", error);
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, []);

  const handleOpen = (audiobook) => {
    setSelectedAudiobook(audiobook);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAudiobook(null);
    setOpen(false);
    console.log("aljdsljd");
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        `https://audio-book-backend.onrender.com/audiobooks/${selectedAudiobook._id}/reviews`,
        {
          userId: selectedAudiobook._id,
          rating,
          reviewText: review,
        }
      );

      console.log("Review submitted:", response.data);

      Swal.fire({
        title: "Submitted!",
        text: "Your review has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4CAF50",
        timer: 3000,
      });

      const updatedAudiobooks = audiobooks.map((audiobook) =>
        audiobook._id === selectedAudiobook._id
          ? {
              ...audiobook,
              averageRating: response.data.rating.toFixed(2),
              reviews: [...audiobook.Review, response.data],
            }
          : audiobook
      );

      setAudiobooks(updatedAudiobooks);

      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const sortAudiobooks = (audiobooks) => {
    if (sortOrder === "titleAsc") {
      return audiobooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "titleDesc") {
      return audiobooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOrder === "ratingAsc") {
      return audiobooks.sort((a, b) => a.averageRating - b.averageRating);
    } else if (sortOrder === "ratingDesc") {
      return audiobooks.sort((a, b) => b.averageRating - a.averageRating);
    }
    return audiobooks;
  };

  const filteredAudiobooks = sortAudiobooks(
    audiobooks.filter((audiobook) => {
      return (
        (filterGenre ? audiobook.genre === filterGenre : true) &&
        (filterAuthor ? audiobook.author === filterAuthor : true) &&
        (filterRating ? audiobook.averageRating >= filterRating : true)
      );
    })
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const uniqueGenres = [
    ...new Set(audiobooks.map((audiobook) => audiobook.genre)),
  ];
  const uniqueAuthors = [
    ...new Set(audiobooks.map((audiobook) => audiobook.author)),
  ];

  return (
    <div>
      <h1
        style={{
          background: "#333",
          color: "#fff",
          padding: "1rem",
          textAlign: "center",
          margin: "0",
        }}
      >
        Audiobook Review and Rating System
      </h1>
      <br></br> <br></br>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl sx={{ width: "22%" }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {uniqueGenres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "22%" }}>
          <InputLabel>Author</InputLabel>
          <Select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {uniqueAuthors.map((author) => (
              <MenuItem key={author} value={author}>
                {author}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "22%" }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating} & Up
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "22%" }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="titleAsc">Title (A-Z)</MenuItem>
            <MenuItem value="titleDesc">Title (Z-A)</MenuItem>
            <MenuItem value="ratingAsc">Rating (Low to High)</MenuItem>
            <MenuItem value="ratingDesc">Rating (High to Low)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <br></br>
      {filteredAudiobooks.length === 0 ? (
        <p>No audiobooks found.</p>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // For extra-small screens (0px to 599px)
              sm: "column", // For small screens (600px to 959px)
              md: "row", // For medium screens (960px to 1279px) and up
            },
            flexWrap: "wrap",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {filteredAudiobooks.map((audiobook) => (
            <Card
              key={audiobook._id}
              sx={{
                display: "flex",
                marginBottom: 2,
                width: "50%",
                flexDirection: {
                  xs: "column", // For extra-small screens (0px to 599px)
                  sm: "column", // For small screens (600px to 959px)
                  md: "row", // For medium screens (960px to 1279px) and up
                },
                justifyContent: "center",
                alignItems: "center",
                transition: "transform 0.3s, box-shadow 0.3s", // Smooth transition for hover effects
                "&:hover": {
                  transform: "scale(1.05)", // Slight zoom effect on hover
                  boxShadow: `0px 4px 20px ${theme.palette.primary.main}`,
                  borderRadius: "20px", // Fixed typo and added closing quotation mark
                },
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1.2 }}
              >
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h5" sx={{ mb: 1 }}>
                    {audiobook.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                    sx={{ mb: 1 }}
                  >
                    {audiobook.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                    sx={{ mb: 1 }}
                  >
                    Genre: {audiobook.genre}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                    sx={{ mb: 1 }}
                  >
                    Rating: {parseFloat(audiobook.averageRating).toFixed(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                    sx={{ mb: 1 }}
                  >
                    {audiobook.description}
                  </Typography>
                  <Box>
                    <IconButton aria-label="previous" sx={{ mr: 1 }}>
                      {theme.direction === "rtl" ? (
                        <SkipNextIcon />
                      ) : (
                        <SkipPreviousIcon />
                      )}
                    </IconButton>
                    <IconButton aria-label="play/pause" sx={{ mx: 1 }}>
                      <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="next" sx={{ ml: 1 }}>
                      {theme.direction === "rtl" ? (
                        <SkipPreviousIcon />
                      ) : (
                        <SkipNextIcon />
                      )}
                    </IconButton>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpen(audiobook)}
                    sx={{ mt: 2 }}
                  >
                    See Reviews
                  </Button>
                </CardContent>
              </Box>
              <CardMedia
                component="img"
                sx={{
                  width: 200,
                  flexGrow: {
                    xs: 1, // For extra-small screens (0px to 599px)
                    sm: 1, // For small screens (600px to 959px)
                    md: 0, // For medium screens (960px to 1279px) and up
                  },
                }}
                image={audiobook.coverImage}
                alt={audiobook.title}
              />
            </Card>
          ))}
        </Box>
      )}
      {selectedAudiobook && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              {selectedAudiobook.title} by {selectedAudiobook.author}
            </Typography>
            <Typography sx={{ mt: 2 }}>Leave a Review:</Typography>
            <TextField
              label="Review"
              fullWidth
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleReviewSubmit}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AudiobookList;

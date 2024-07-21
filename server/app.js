const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://rishigupta280594:z1aeAVaFi5nYhn5V@rishi.r1xogl5.mongodb.net/audiobooks?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas", error);
  });

const audiobookSchema = new mongoose.Schema({
  title: String,
  author: String,
  coverImage: String,
  description: String,
  genre: String,
  averageRating: { type: Number, default: 0 },
});

const Audiobook = mongoose.model("Audiobook", audiobookSchema);

const reviewSchema = new mongoose.Schema({
  audiobookId: { type: mongoose.Schema.Types.ObjectId, ref: "Audiobook" },
  userId: String,
  rating: Number,
  reviewText: String,
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

app.get("/audiobooks", async (req, res) => {
  try {
    console.log("Received request for audiobooks");
    const audiobooks = await Audiobook.find();
    console.log("Fetched audiobooks:", audiobooks);
    res.json(audiobooks);
  } catch (error) {
    console.error("Error fetching audiobooks:", error);
    res.status(500).json({ error: "Failed to fetch audiobooks" });
  }
});

app.get("/audiobooks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid audiobook ID" });
    }

    const audiobook = await Audiobook.findById(id);
    if (!audiobook) {
      return res.status(404).json({ error: "Audiobook not found" });
    }

    const reviews = await Review.find({ audiobookId: id });
    res.json({ audiobook, reviews });
  } catch (error) {
    console.error("Failed to fetch audiobook details:", error);
    res.status(500).json({ error: "Failed to fetch audiobook details" });
  }
});

app.post("/audiobooks/:id/reviews", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid audiobook ID" });
    }

    const { userId, rating, reviewText } = req.body;
    if (!userId || !rating || !reviewText) {
      return res
        .status(400)
        .json({ error: "UserId, rating, and review text are required" });
    }
    let review = await Review.findOne({ audiobookId: id, userId });
    if (review) {
      review.rating = rating;
      review.reviewText = reviewText;
      review.createdAt = Date.now();
      await review.save();
    } else {
      review = new Review({
        audiobookId: id,
        userId,
        rating,
        reviewText,
      });
      await review.save();
    }

    const reviews = await Review.find({ audiobookId: id });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const audiobook = await Audiobook.findById(id);
    if (audiobook) {
      audiobook.averageRating = averageRating.toFixed(2);
      await audiobook.save();
    }

    res.status(201).json(review);
  } catch (error) {
    console.error("Failed to submit or update review:", error);
    res.status(500).json({ error: "Failed to submit or update review" });
  }
});

app.put("/audiobooks/:id", async (req, res) => {
  const { id } = req.params;
  const { averageRating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid audiobook ID" });
  }

  try {
    const updatedAudiobook = await Audiobook.findByIdAndUpdate(
      id,
      { averageRating },
      { new: true, runValidators: true }
    );

    if (!updatedAudiobook) {
      return res.status(404).json({ message: "Audiobook not found" });
    }

    res.status(200).json(updatedAudiobook);
  } catch (error) {
    console.error("Error updating audiobook:", error);
    res.status(500).json({ message: "Error updating audiobook", error });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require("mongoose");

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
    seedDatabase();
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
  Review: { type: String },
});

const Audiobook = mongoose.model("Audiobook", audiobookSchema);

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    const deleteResult = await Audiobook.deleteMany({});
    console.log("Deleted records count:", deleteResult.deletedCount);

    const audiobooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImage:
          "https://m.media-amazon.com/images/I/41mqil02y0L._AC_UF1000,1000_QL80_.jpg",
        description: "A classic novel of the Roaring Twenties.",
        genre: "Classic",
        averageRating: 4.6,
        Review: "A timeless classic with remarkable prose.",
      },
      {
        title: "1984",
        author: "George Orwell",
        coverImage:
          "https://i.pinimg.com/originals/bd/29/34/bd293499ee09b8fa4182f2ae24d83133.jpg",
        description:
          "A dystopian social science fiction novel and cautionary tale.",
        genre: "Dystopian",
        averageRating: 4.7,
        Review: "A chilling vision of a totalitarian future.",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverImage:
          "https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L._AC_UL210_SR210,210_.jpg",
        description: "A novel about racial injustice in the Deep South.",
        genre: "Historical",
        averageRating: 5.0,
        Review: "A powerful exploration of morality and justice.",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        coverImage: "https://i.redd.it/ofcz5klsqvh21.jpg",
        description: "A story about teenage angst and alienation.",
        genre: "Literary",
        averageRating: 4.4,
        Review: "An insightful portrayal of adolescent disillusionment.",
      },
    ];

    const insertResult = await Audiobook.insertMany(audiobooks);
    console.log("Inserted records count:", insertResult.length);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database", error);
  } finally {
    mongoose.connection.close();
  }
}

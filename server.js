const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3002;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Connects either to MongoDB Atlas if on heroku site or to the local, if running locally --//
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/budgetdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
);

// routes
app.use(require("./routes/api.js"));

// Listening
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
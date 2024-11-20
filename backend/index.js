
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Fruite", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch(() => {
    console.error("Database not Connected");
  });

// Define Fruit Schema and Model
const Fruit = mongoose.model(
  "fruit",
  {
    name: String,
  },
  "fruitstodo"
);

// Get all data
app.get("/getdata", (req, res) => {
  Fruit.find()
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({ message: "Failed to retrieve data" });
    });
});

// Add new fruit
app.post("/postdata", (req, res) => {
  const newFruit = new Fruit({ name: req.body.newfruit });
  newFruit
    .save()
    .then(() => {
      res.send({ message: "Data successfully saved" });
    })
    .catch(() => {
      res.status(500).send({ message: "Failed to save data" });
    });
});

// Delete fruit by ID
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid _id format" });
  }

  Fruit.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.send({ message: "Item successfully deleted" });
      } else {
        res.status(404).send({ message: "Item not found" });
      }
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
      res.status(500).send({ error: "Failed to delete the item" });
    });
});

// Start the server
app.listen(5000, () => {
  console.log("Server Started on port 5000");
});

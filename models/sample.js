const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/todo_express', {
  useNewUrlParser: true
});

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
  name: "Apple",
  rating: 7,
  review: "Pretty good"
});

fruit.save().then(() => console.log('Data Save Successful!'));
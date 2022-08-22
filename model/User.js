const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  telephoneNumber: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "Admin"],
  },
  assets: {
    // type: mongoose.Schema.Types.ObjectId,
    type:Array,
    ref: "Asset",
  },
  messages:{
    type:Array,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);

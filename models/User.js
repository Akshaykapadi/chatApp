const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

let Users = mongoose.model("User", userSchema);

module.exports = Users;
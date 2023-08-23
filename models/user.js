//import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nick_name: { type: String, required: true },
  password: { type: String, reuquired: true },
  badge: { type: String },
  goal_nm: { type: String }
});

// userSchema.pre('save', async function () {
//   this.password = await bcrypt.hash(this.password, 5);
// });

const User = mongoose.model("User", userSchema);

export default User;
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nick_name: { type: String, required: true },
  password: { type: String, reuquired: true },
  badge: { type: String },
  goal_nm: { type: String }
});

memberSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const Member = mongoose.model("member", memberSchema);

export default Member;
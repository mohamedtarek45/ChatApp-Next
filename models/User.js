import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
    default: "https://blaumet.at/wp-mainsite/wp-content/uploads/2020/11/dummy-photo.png",
  },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updateAt: {
//     type: Date,
//     default: Date.now,
//   },
},{
    timestamps: true,
}
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

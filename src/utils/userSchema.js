import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    Order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

const userSchema = mongoose.models?.User || mongoose.model("User", user);

export default userSchema;

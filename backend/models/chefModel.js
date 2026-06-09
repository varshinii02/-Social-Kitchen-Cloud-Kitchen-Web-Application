import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Fooditem from "./fooditemModel.js";

const chefSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    kitchenName: {
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
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    menuImage: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    about: {
      type: String,
      maxlength: 300, // roughly 50 words
    },
  },
  {
    timestamps: true,
  }
);

chefSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

chefSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

chefSchema.pre("remove", async function (next) {
  try {
    await Fooditem.deleteMany({ user: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;

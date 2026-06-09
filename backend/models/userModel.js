import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cartItemSchema = mongoose.Schema(
  {
    fooditem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Fooditem",
    },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    chef: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    kitchensName: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
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
    address: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "chef", "admin"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    cartItems: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

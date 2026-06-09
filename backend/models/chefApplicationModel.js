import mongoose from "mongoose";

const chefApplicationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    experience: {
      type: String,
    },
    portfolioLink: {
      type: String,
    },
    // Removed kitchenName field as it should not be in chefApplication collection
    // kitchenName: {
    //   type: String,
    //   required: false,
    // },
    message: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    state: {
      type: String,
    },
    sampleMenuFile: {
      type: String,
    },
    governmentIdFile: {
      type: String,
    },
    availabilityDaysCount: {
      type: Number,
    },
    availabilityDays: [
      {
        type: String,
      }
    ],
    availabilityStartTime: {
      type: String,
    },
    availabilityEndTime: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const ChefApplication = mongoose.model("ChefApplication", chefApplicationSchema);

export default ChefApplication;

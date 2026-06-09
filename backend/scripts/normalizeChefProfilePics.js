import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Chef from "../models/chefModel.js";
import connectDB from "../config/db.js";

dotenv.config();

const normalizeChefProfilePics = async () => {
  try {
    await connectDB();

    const chefs = await Chef.find({});

    for (const chef of chefs) {
      if (chef.profilePic && !chef.profilePic.startsWith("/uploads/") && !chef.profilePic.startsWith("http")) {
        chef.profilePic = "/uploads/" + chef.profilePic;
        await chef.save();
        console.log(colors.green(`Normalized profilePic for chef ${chef.name}: ${chef.profilePic}`));
      } else {
        console.log(colors.yellow(`No normalization needed for chef ${chef.name}`));
      }
    }

    console.log(colors.cyan("Chef profilePic normalization completed."));
    process.exit();
  } catch (error) {
    console.error(colors.red("Error normalizing chef profilePics:"), error);
    process.exit(1);
  }
};

normalizeChefProfilePics();

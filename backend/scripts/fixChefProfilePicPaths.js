import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Chef from "../models/chefModel.js";
import connectDB from "../config/db.js";
import path from "path";

dotenv.config();

const fixChefProfilePicPaths = async () => {
  try {
    await connectDB();

    const chefs = await Chef.find({});

    for (const chef of chefs) {
      if (chef.profilePic) {
        // If profilePic is an absolute path, convert to relative path
        if (path.isAbsolute(chef.profilePic)) {
          const relativePath = path.relative(path.resolve(), chef.profilePic);
          chef.profilePic = relativePath.replace(/\\/g, "/"); // Normalize Windows backslashes to forward slashes
          await chef.save();
          console.log(colors.green(`Fixed profilePic path for chef ${chef.name}: ${chef.profilePic}`));
        } else {
          console.log(colors.yellow(`No fix needed for chef ${chef.name}`));
        }
      } else {
        console.log(colors.red(`No profilePic set for chef ${chef.name}`));
      }
    }

    console.log(colors.cyan("Chef profilePic path fix completed."));
    process.exit();
  } catch (error) {
    console.error(colors.red("Error fixing chef profilePic paths:"), error);
    process.exit(1);
  }
};

fixChefProfilePicPaths();

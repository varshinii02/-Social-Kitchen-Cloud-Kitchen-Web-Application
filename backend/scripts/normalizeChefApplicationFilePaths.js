import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "../config/db.js";
import ChefApplication from "../models/chefApplicationModel.js";

dotenv.config();

const normalizeFilePath = (path) => {
  if (!path) return path;
  while (path.startsWith("uploads/")) {
    path = path.slice(8);
  }
  return path;
};

const normalizeChefApplicationFilePaths = async () => {
  try {
    await connectDB();

    const applications = await ChefApplication.find({});

    for (const app of applications) {
      let updated = false;

      if (app.sampleMenuFile) {
        const normalized = normalizeFilePath(app.sampleMenuFile);
        if (normalized !== app.sampleMenuFile) {
          app.sampleMenuFile = normalized;
          updated = true;
        }
      }

      if (app.governmentIdFile) {
        const normalized = normalizeFilePath(app.governmentIdFile);
        if (normalized !== app.governmentIdFile) {
          app.governmentIdFile = normalized;
          updated = true;
        }
      }

      if (updated) {
        await app.save();
        console.log(colors.green(`Normalized file paths for application ${app._id}`));
      }
    }

    console.log(colors.blue("Normalization complete."));
    process.exit();
  } catch (error) {
    console.error(colors.red(error));
    process.exit(1);
  }
};

normalizeChefApplicationFilePaths();

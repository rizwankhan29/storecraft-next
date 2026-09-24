// Import Mongoose to define the database schema and compile the model
import mongoose from "mongoose";

// Create a new Mongoose Schema defining the shape of product documents in MongoDB
const ProductSchema = new mongoose.Schema(
  {
    // Product Name field
    name: {
      // Specify that the name must be a text string
      type: String,
      // Make this field mandatory; show a custom error message if left blank
      required: [true, "Product name is required"],
      // Automatically strip unnecessary whitespace from both ends of the string
      trim: true,
    },
    // Category field (e.g., Keyboards, Audio, Accessories)
    category: {
      // Store the category value as a string
      type: String,
      // Require the category field on every product
      required: [true, "Category is required"],
      // Trim accidental spaces
      trim: true,
    },
    // Subcategory field (e.g., custom-mechanical, wireless)
    subcategory: {
      // Store the subcategory as a string
      type: String,
      // Fallback default value if no subcategory is chosen
      default: "custom-mechanical",
    },
    // Product Price field
    price: {
      // Store the price as a numeric value for calculations and sorting
      type: Number,
      // Ensure every product has a valid price
      required: [true, "Price is required"],
    },
    // Available stock count
    stock: {
      // Store the inventory quantity as an integer number
      type: Number,
      // Set the default inventory level to 24 units
      default: 24,
    },
    // Key Highlights / Features checklist (e.g., ["Aluminum Chassis", "Low-Profile Switches"])[cite: 4]
    features: {
      // Define this field as an array of strings to hold your split comma-separated values
      type: [String],
      // Initialize it as an empty array if no features are submitted
      default: [],
    },
    // Full product description text
    description: {
      // Store long-form description text as a string
      type: String,
      // Trim whitespace from beginning and end
      trim: true,
    },
    // Secure URL from Cloudinary where the hosted image lives
    imageUrl: {
      // Store the image link as a string
      type: String,
      // Require an image URL for every product listing
      required: [true, "Product image is required"],
    },
    // Cloudinary Public ID used to delete or update the image on Cloudinary later
    imagePublicId: {
      // Store the identifier string from Cloudinary
      type: String,
    },
  },
  {
    // Automatically create and manage 'createdAt' and 'updatedAt' timestamps in the document
    timestamps: true,
  },
);

// Prevent model recompilation errors during Next.js hot reload by checking mongoose.models first
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

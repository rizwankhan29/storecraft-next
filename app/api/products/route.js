// Import NextResponse to construct JSON responses in Next.js App Router
import { NextResponse } from "next/server";

// Import your cached database connection function from lib/mongodb.js
import { connectDB } from "@/lib/mongodb";

// Import the Product Mongoose model to create product documents in the database
import Product from "@/models/Product";

// THIS LINE WAS MISSING OR COMMENTED OUT: Import the configured Cloudinary instance
import { cloudinary } from "@/lib/cloudinary";

// Define the POST handler to process form submissions and file uploads
export async function POST(request) {
  // Wrap everything in a try-catch block to handle errors safely
  try {
    // 1. Establish database connection before processing
    await connectDB();

    // 2. Parse the incoming multipart form data sent by the browser
    const formData = await request.formData();

    // 3. Extract text fields from the submitted form data
    const name = formData.get("name");
    // Extract category string
    const category = formData.get("category");
    // Extract subcategory string or fallback
    const subcategory = formData.get("subcategory") || "custom-mechanical";
    // Extract numerical price string
    const price = formData.get("price");
    // Extract stock string or fallback to 24
    const stock = formData.get("stock") || 24;
    // Extract description string or fallback to empty
    const description = formData.get("description") || "";
    // Extract comma-separated features string
    const rawFeatures = formData.get("features") || "";

    // 4. Extract the uploaded image file object
    const file = formData.get("image");

    // 5. Basic input validation check
    if (!name || !category || !price) {
      // Return 400 Bad Request if essential fields are omitted
      return NextResponse.json(
        {
          success: false,
          error: "Name, category, and price are required fields.",
        },
        { status: 400 },
      );
    }

    // Validate that a real file was uploaded
    if (!file || typeof file === "string") {
      // Return 400 if image file is missing
      return NextResponse.json(
        { success: false, error: "A valid product image file is required." },
        { status: 400 },
      );
    }

    // 6. Convert the file ArrayBuffer to a Node Buffer for upload
    const fileBytes = await file.arrayBuffer();
    // Wrap the raw bytes into a Node.js Buffer
    const fileBuffer = Buffer.from(fileBytes);

    // 7. Upload the buffer directly to Cloudinary using an upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      // Initialize the Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // Store uploaded items inside a dedicated folder on Cloudinary
          folder: "storecraft_products",
          // Automatically optimize image format (webp/avif where supported)
          fetch_format: "auto",
        },
        // Callback function returning error or success result
        (error, result) => {
          // Reject promise on Cloudinary upload error
          if (error) reject(error);
          // Resolve promise with upload data
          else resolve(result);
        },
      );
      // Write the buffer data into the stream and close it
      uploadStream.end(fileBuffer);
    });

    // 8. Transform comma-separated features string into an array of clean strings
    const featuresArray = rawFeatures
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // 9. Save new product document into MongoDB
    const newProduct = await Product.create({
      // Product name
      name,
      // Category
      category,
      // Subcategory
      subcategory,
      // Parsed price
      price: Number(price),
      // Parsed stock
      stock: Number(stock),
      // Array of features
      features: featuresArray,
      // Product description
      description,
      // Cloudinary secure HTTPS URL
      imageUrl: uploadResult.secure_url,
      // Cloudinary public ID for managing the image asset
      imagePublicId: uploadResult.public_id,
    });

    // 10. Return success response with the created product payload
    return NextResponse.json(
      {
        // Indicate success
        success: true,
        // Informative message
        message: "Product created successfully!",
        // Send created document data back
        data: newProduct,
      },
      // Status 201 Created
      { status: 201 },
    );
  } catch (error) {
    // Log internal error for server debugging
    console.error("Product creation error:", error);
    // Return 500 error response to client
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 },
    );
  }
}

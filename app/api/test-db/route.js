// Import NextResponse to construct HTTP responses in Next.js App Router
import { NextResponse } from "next/server";

// Import connectDB by name from the lib folder at the project root
import { connectDB } from "@/lib/mongodb";

// Import the Product model to ensure Mongoose registers the schema without issues
import Product from "@/models/Product";

// Define the GET HTTP method handler
export async function GET() {
  // Wrap the call in a try/catch block
  try {
    // Execute the database connection function
    await connectDB();

    // Return a JSON response confirming successful database connectivity
    return NextResponse.json({
      // Indicate success
      success: true,
      // Confirmation message
      message: "MongoDB connected successfully via App Router!",
    });
  } catch (error) {
    // Return a JSON error payload if connection fails
    return NextResponse.json(
      {
        // Indicate failure
        success: false,
        // Send the specific error message
        error: error.message,
      },
      // Return HTTP status 500
      { status: 500 },
    );
  }
}

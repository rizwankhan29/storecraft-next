import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { cloudinary } from "@/lib/cloudinary";

// 1. GET: Used by the edit page to load the product into the inputs
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        _id: product._id.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// 2. PUT: Used when saving changes
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const subcategory = formData.get("subcategory") || "custom-mechanical";
    const price = formData.get("price");
    const stock = formData.get("stock") || 24;
    const description = formData.get("description") || "";
    const rawFeatures = formData.get("features") || "";
    const file = formData.get("image");

    const featuresArray = rawFeatures
      ? rawFeatures
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : existingProduct.features;

    let imageUrl = existingProduct.imageUrl;
    let imagePublicId = existingProduct.imagePublicId;

    // Handle replacement image upload if provided
    if (file && typeof file !== "string" && file.size > 0) {
      const fileBytes = await file.arrayBuffer();
      const fileBuffer = Buffer.from(fileBytes);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "storecraft_products", fetch_format: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(fileBuffer);
      });

      if (existingProduct.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.imagePublicId);
        } catch (destroyErr) {
          console.warn("Cloudinary asset cleanup warning:", destroyErr);
        }
      }

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    existingProduct.name = name || existingProduct.name;
    existingProduct.category = category || existingProduct.category;
    existingProduct.subcategory = subcategory;
    existingProduct.price = price ? Number(price) : existingProduct.price;
    existingProduct.stock = stock ? Number(stock) : existingProduct.stock;
    existingProduct.features = featuresArray;
    existingProduct.description = description;
    existingProduct.imageUrl = imageUrl;
    existingProduct.imagePublicId = imagePublicId;

    const updatedProduct = await existingProduct.save();

    // 👈 2. PURGE CACHES FOR BOTH HOME AND DETAILS PAGE
    revalidatePath("/");
    revalidatePath(`/product-details/${id}`);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 },
    );
  }
}

// 3. DELETE: Used to remove product
export async function DELETE(request, { params }) {
  try {
    // In Next.js App Router, await params to read dynamic route parameters
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 },
      );
    }

    await connectDB();

    // 1. Find the product document first to retrieve its Cloudinary image ID
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 },
      );
    }

    // 2. Remove the image from Cloudinary if an imagePublicId exists
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (cloudinaryErr) {
        console.warn("Cloudinary asset cleanup warning:", cloudinaryErr);
      }
    }

    // 3. Remove the document from MongoDB
    await Product.findByIdAndDelete(id);

    // 👈 2. PURGE CACHES FOR BOTH HOME AND DETAILS PAGE
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Product and associated media deleted successfully!",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product." },
      { status: 500 },
    );
  }
}

"use client";

import Link from "next/link";
import { CloudUpload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Store the product title/name
    name: "",
    // Store the main category string
    category: "",
    // Store the subcategory string with a default value
    subcategory: "custom-mechanical",
    // Store the numerical price as a string from the input
    price: "",
    // Store the available stock inventory count
    stock: "24",
    // Store comma-separated feature items
    features: "",
    // Store the multi-line product description
    description: "",
  });

  const [imageFile, setImaggeFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImaggeFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!imageFile) {
      setErrorMessage("Please select a product image to upload.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("features", formData.features);
      data.append("description", formData.description);
      data.append("image", imageFile);

      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to create product");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* 1. Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Product Studio
        </h1>
        <p className="text-sm text-zinc-400">
          Add or Update the product specifications and media assets for your
          store.
        </p>
      </div>
      {/* Conditional Error Banner */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400 text-center">
          {errorMessage}
        </div>
      )}
      {/* 2. Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-start">
          {/* LEFT: Product Details */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-zinc-400">
              Product Details
            </h2>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Product Name"
                  className="w-full bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full appearance-none bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-brand-indigo transition cursor-pointer"
                >
                  <option
                    value=""
                    disabled
                    className="bg-brand-inner text-zinc-500"
                  >
                    Select Category
                  </option>
                  <option
                    value="keyboards"
                    className="bg-brand-inner text-zinc-400"
                  >
                    Keyboards
                  </option>
                  <option
                    value="audio"
                    className="bg-brand-inner text-zinc-400"
                  >
                    Audio
                  </option>
                  <option
                    value="accessories"
                    className="bg-brand-inner text-zinc-400"
                  >
                    Accessories
                  </option>
                </select>
              </div>

              {/* Subcategory */}
              <div className="relative">
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full appearance-none bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-brand-indigo transition cursor-pointer"
                >
                  <option
                    value="custom-mechanical"
                    className="bg-brand-inner text-zinc-400"
                  >
                    Mechanical Keyboards
                  </option>
                  <option
                    value="wireless"
                    className="bg-brand-inner text-zinc-400"
                  >
                    Wireless Keyboards
                  </option>
                  <option
                    value="ergonomic"
                    className="bg-brand-inner text-zinc-400"
                  >
                    Ergonomic Keyboards
                  </option>
                </select>
              </div>

              {/* Price & Stock */}
              <div className="flex gap-4">
                <div className="w-36">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price ($)"
                    className="w-full bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition"
                  />
                </div>

                <div className="relative flex-1">
                  <select
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full appearance-none bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-brand-indigo transition cursor-pointer"
                  >
                    <option value="24" className="bg-brand-inner text-zinc-400">
                      24
                    </option>
                    <option value="12" className="bg-brand-inner text-zinc-400">
                      12
                    </option>
                    <option value="5" className="bg-brand-inner text-zinc-400">
                      5
                    </option>
                  </select>
                </div>
              </div>

              {/* Key Features / Highlights (Standard Form Fields) */}
              <div>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Key Features (comma-separated: Aluminum Chassis, Low-Profile Switches, Multi-Device Pairing)"
                  className="w-full bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition"
                />
              </div>

              {/* Description */}
              <div>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product Description"
                  className="w-full bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Media */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-400 mb-6">
                Product Media
              </h2>

              <label
                htmlFor="file-upload"
                className="border-2 border-dashed border-zinc-700/70 hover:border-brand-indigo/60 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3 bg-brand-inner/20 hover:bg-brand-inner/40 transition cursor-pointer group"
              >
                <input
                  id="file-upload"
                  name="product_image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <div className="w-12 h-12 rounded-full bg-brand-indigo/10 flex items-center justify-center shadow-lg shadow-brand-indigo/20 group-hover:scale-110 transition duration-300">
                  <CloudUpload className="w-6 h-6 text-brand-indigo" />
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                    Upload Product Image via Cloudinary
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    PNG, JPG or WEBP up to 5MB
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded Item Preview */}
            {imagePreview ? (
              <div className="bg-brand-inner/60 border border-brand-border rounded-xl p-3 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl bg-zinc-800 border border-brand-border flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Uploaded Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {imageFile?.name}
                  </p>
                  <p className="text-sm text-brand-emerald mt-0.5">
                    Ready to upload (
                    {(imageFile?.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-brand-border/60 rounded-xl p-3 text-center text-xs text-zinc-600">
                No Image is Selected
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/"
            className="border border-brand-border hover:border-zinc-500 bg-transparent text-zinc-300 hover:text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-brand-indigo/25 transition active:scale-95"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span className="text-center">
              {loading ? "Publishing" : "Publish Product"}
            </span>
          </button>
        </div>
      </form>
    </main>
  );
}

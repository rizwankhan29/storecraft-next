"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudUpload, Loader2, ArrowLeft } from "lucide-react";

export default function EditProductPage({ params }) {
  // In Next.js App Router, unwrap dynamic params promise with use()
  //   In Client Components (which cannot be async), React provides the new use() hook specifically to unwrap Promises synchronously insidea render:

//   What it does: Reads the id from the dynamic route URL (e.g., /edit-product/65a7f9...).

  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  //both can be done
  //   const params = useParams();
  //   const productId = params.id; // Plain string, no Promise, no use(), no await

  const router = useRouter();

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "custom-mechanical",
    price: "",
    stock: "24",
    features: "",
    description: "",
  });

  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // States
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Fetch current product on mount to prepopulate inputs
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        const res = await fetch(`/api/products/${productId}`);

        // Safety check if response is HTML or JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load product");
        }

        const item = data.data;
        setFormData({
          name: item.name || "",
          category: item.category || "",
          subcategory: item.subcategory || "custom-mechanical",
          price: item.price ? item.price.toString() : "",
          stock: item.stock ? item.stock.toString() : "24",
          features: Array.isArray(item.features)
            ? item.features.join(", ")
            : "",
          description: item.description || "",
        });

        if (item.imageUrl) {
          setImagePreview(item.imageUrl);
        }
      } catch (err) {
        setErrorMessage(err.message || "Failed to load product details.");
      } finally {
        setLoadingProduct(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle selecting a new replacement image
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 2. Submit changes via PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSaving(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("features", formData.features);
      data.append("description", formData.description);

      // Only attach if user chose a replacement image
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update product");
      }

      // Success: return to home and refresh catalog
      router.push("/");
      router.refresh();
    } catch (err) {
      setErrorMessage(err.message || "Error updating product.");
    } finally {
      setSaving(false);
    }
  };

  // Initial loading state
  if (loadingProduct) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-indigo animate-spin" />
        <p className="text-zinc-500 text-sm">Loading product details...</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Top Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Edit Product
          </h1>
          <p className="text-sm text-zinc-400">
            Update specifications or replace image assets for this product.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-start">
          {/* Left Column: Fields */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-zinc-400">
              Product Details
            </h2>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                  className="w-full bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition"
                />
              </div>

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

              <div className="flex gap-4">
                <div className="w-36">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price ($)"
                    required
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
                      24 units
                    </option>
                    <option value="12" className="bg-brand-inner text-zinc-400">
                      12 units
                    </option>
                    <option value="5" className="bg-brand-inner text-zinc-400">
                      5 units
                    </option>
                    <option value="0" className="bg-brand-inner text-zinc-400">
                      0 units (Out of Stock)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Key Features (comma-separated)"
                  className="w-full bg-brand-inner border border-brand-border rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand-indigo transition"
                />
              </div>

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

          {/* Right Column: Media Preview & Change */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-400 mb-6">
                Product Media
              </h2>

              <label
                htmlFor="edit-file-upload"
                className="border-2 border-dashed border-zinc-700/70 hover:border-brand-indigo/60 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3 bg-brand-inner/20 hover:bg-brand-inner/40 transition cursor-pointer group"
              >
                <input
                  id="edit-file-upload"
                  name="image"
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
                    {imageFile
                      ? "Change Selected Image"
                      : "Upload New Image (Optional)"}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    Leave empty to keep existing image
                  </p>
                </div>
              </label>
            </div>

            {/* Current or Newly Selected Preview */}
            {imagePreview && (
              <div className="bg-brand-inner/60 border border-brand-border rounded-xl p-3 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl bg-zinc-800 border border-brand-border flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {imageFile ? imageFile.name : "Current Image"}
                  </p>
                  <p className="text-xs text-brand-indigo mt-0.5">
                    {imageFile ? "New file selected" : "Stored in Cloudinary"}
                  </p>
                </div>
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
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-brand-indigo/25 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </main>
  );
}

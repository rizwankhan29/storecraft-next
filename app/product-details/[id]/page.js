import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { SimilarCard } from "@/app/components/SimilarCard";
import { ThumbnailRow } from "@/app/components/ThumbnailRow";

const ProductDetails = async ({ params }) => {
  const { id } = await params;

  await connectDB();

  let product = null;

  try {
    product = await Product.findById(id).lean();
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const similarProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(4)
    .lean();

  const isInStock = (product.stock ?? 0) > 0;
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16">
      {/* <!-- 1. Product Showcase Grid (Left: Image Gallery, Right: Details & Purchase) --> */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* <!-- LEFT: Media & Thumbnail Gallery (5 cols on lg) --> */}
        <div className="lg:col-span-6 bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 space-y-4">
          {/* <!-- Main Featured Image Container --> */}
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-brand-inner flex items-center justify-center">
            <img
              src={
                product.imageUrl ||
                "/images/products/product-details/keykrocn.avif"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* <!-- Thumbnails Row (3 Angles) --> */}
          {/* <div className="grid grid-cols-3 gap-3">
            <ThumbnailRow />
          </div> */}
        </div>

        {/* <!-- RIGHT: Product Info, Specs & Actions (6 cols on lg) --> */}
        <div className="lg:col-span-6 space-y-6">
          {/* <!-- Title --> */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {product.name}
          </h1>

          {/* <!-- Status & Price Tag --> */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${isInStock ? "bg-brand-emerald text-brand-bg" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-2xl font-bold text-white">
              ${product.price}
            </span>
          </div>

          {/* <!-- Description Paragraph --> */}
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            {product.description || "No description provided for this product."}
          </p>

          {/* <!-- Stepper & Spec Checklist Row --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 items-start">
            {/* <!-- Quantity Stepper --> */}
            <div className="space-y-3">
              <span className="block text-xs font-medium text-zinc-400">
                Quantity
              </span>
              <div className="inline-flex items-center bg-brand-inner border border-brand-border rounded-full px-4 py-2 gap-4 text-sm text-zinc-400">
                <button
                  type="button"
                  className="hover:text-white transition active:scale-90"
                >
                  -
                </button>
                <span className="font-semibold text-white">1</span>
                <button
                  type="button"
                  className="hover:text-white transition active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dynamic Features List & ids is index */}
            {product.features && product.features.length > 0 && (
              <ul className="text-xs sm:text-sm text-zinc-300">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* <!-- Action Buttons (Buy Now + Edit Product) --> */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              className="bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold px-8 py-3 rounded-full shadow-xl shadow-brand-indigo/30 transition active:scale-95"
            >
              Buy Now
            </button>
            {/* In MongoDB/Mongoose, product._id is not a regular JavaScript string. It is a special BSON ObjectId object.

Calling .toString() converts that internal BSON object into a standard 24-character hexadecimal string (e.g., "65f1a2b3c4d5e6f7a8b9c0d1"). */}
            <Link
              href={`/edit-product/${product._id.toString()}`}
              className="inline-flex items-center justify-center border border-brand-border hover:border-zinc-500 bg-transparent text-zinc-300 hover:text-white text-sm font-semibold px-6 py-3 rounded-full transition active:scale-95"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </div>

      {/* <!-- 2. Similar Hardware Section --> */}
      { similarProducts.length > 0 && (
      <div className="space-y-6 pt-8 border-t border-brand-border/40">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Similar Hardware
        </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((item) => (
              <SimilarCard
              key={item._id.toString()}
                id={item._id.toString()}
                name={item.name}
                image={item.imageUrl}
                price={item.price}
                status={(item.stock ?? 0 ) ? "In Stock" : "Out of Stock"}
              />
            ))}
        </div>
        </div>
        )}
    </main>
  );
};

export default ProductDetails;

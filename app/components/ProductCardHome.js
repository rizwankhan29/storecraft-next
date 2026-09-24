"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit3, Trash2, Loader2 } from "lucide-react";

export const ProductCardHome = ({
  id = "1",
  name = "Over-Ear Studio Headphones",
  category = "Audio",
  price = "199.99",
  status = "In Stock",
  image = "/images/products/headphones.avif",
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const isInStock = status === "In Stock";

  // Triggered when clicking Delete
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      // Refresh server components to re-run getProducts() on the home page
      router.refresh();
    } catch (err) {
      alert(err.message || "An error occurred while deleting.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition group shadow-lg">
      <div>
        {/* Image Box + Stock Badge */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-brand-inner flex items-center justify-center">
          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold z-10 ${
              isInStock
                ? "bg-brand-emerald text-brand-bg"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {status}
          </span>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Product Details */}
        <div className="mt-4 space-y-1">
          <h4 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-brand-indigo transition">
            {name}
          </h4>
          <span className="block text-xs text-zinc-500 capitalize">
            {category}
          </span>
          <p className="text-base font-bold text-white pt-1">${price}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-2 flex items-center gap-2">
        {/* View Details Link */}
        <Link
          href={`/product-details/${id}`}
          className="flex-1 text-center py-2 px-3 rounded-full border border-brand-border hover:border-brand-indigo text-xs font-semibold text-zinc-300 hover:text-white transition active:scale-95"
        >
          View Details
        </Link>

        {/* Edit Button */}
        <Link
          href={`/edit-product/${id}`}
          className="inline-flex items-center justify-center p-2 rounded-full border border-zinc-800 hover:border-zinc-600 bg-brand-inner text-zinc-400 hover:text-zinc-200 transition active:scale-95"
          title="Edit Product"
        >
          <Edit3 className="w-4 h-4" />
        </Link>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center justify-center p-2 rounded-full border border-red-500/20 hover:border-red-500/50 bg-red-500/10 text-red-400 hover:text-red-300 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Product"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

import Link from "next/link";
import React from "react";

export const SimilarCard = ({
  id = "1",
  name = "Hardware Item",
  image = "/images/products/keyboards.avif",
  status = "In Stock",
  price,
}) => {
  return (
    <Link
      href={`/product-details/${id}`}
      className="bg-brand-card border border-brand-border hover:border-zinc-700 rounded-xl p-3 flex items-center gap-3.5 transition group"
    >
      <div className="w-16 h-16 rounded-lg bg-brand-inner overflow-hidden shrink-0 flex items-center justify-center p-1">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-brand-indigo transition truncate">
          {name}
        </h4>
        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-brand-inner border border-brand-border text-zinc-400">
          {status}
        </span>
        {price && (
          <span className="text-xs font-bold text-zinc-300">${price}</span>
        )}
      </div>
    </Link>
  );
};

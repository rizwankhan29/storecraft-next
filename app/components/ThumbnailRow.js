import React from "react";

export const ThumbnailRow = () => {
  return (
    <button
      type="button"
      className="aspect-square rounded-xl overflow-hidden bg-brand-inner border border-brand-indigo p-1.5 focus:outline-none transition active:scale-95"
    >
      <img
        src="/images/products/keyboards.avif"
        alt="Angle 1"
        className="w-full h-full rounded-lg object-cover"
      />
    </button>
  );
};

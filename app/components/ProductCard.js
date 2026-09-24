import Link from "next/link";

export default function ProductCard({
  id = "1",
  name = "Keychron Q1 Pro",
  category = "Custom Mechanical",
  price = "$199.00",
  status = "In Stock",
  image = "/images/products/keyboard.avif",
}) {
  return (
    <Link
      href={`/product-details/${id}`}
      className="group bg-brand-card border border-brand-border hover:border-zinc-700/80 rounded-2xl p-4 transition-all duration-300 flex flex-col space-y-4"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-brand-inner flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-brand-bg/80 backdrop-blur-md border border-brand-border text-brand-emerald">
          {status}
        </span>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-col space-y-1">
        <span className="text-xs text-zinc-500 font-medium">{category}</span>
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-brand-indigo transition truncate">
            {name}
          </h3>
          <span className="text-sm font-bold text-white">{price}</span>
        </div>
      </div>
    </Link>
  );
}

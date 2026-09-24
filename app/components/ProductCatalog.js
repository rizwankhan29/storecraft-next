// Declare client boundary to allow React interactive hooks (useState)
"use client";

// Import useState from React to track the active category filter
import { useState } from "react";

// Import your ProductCardHome card component to render each individual item
import { ProductCardHome } from "./ProductCardHome";

// Define the available category filter buttons matching your schema values
const CATEGORIES = ["All", "Audio", "Keyboards", "Accessories"];

// Export the interactive ProductCatalog component receiving the fetched products as a prop
export default function ProductCatalog({ initialProducts = [] }) {
  // Initialize state to store the currently selected category filter (defaults to "All")
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter the products array based on the selected category
  const filteredProducts =
    // If "All" is active, display the full unmodified list
    selectedCategory === "All"
      ? initialProducts
      : // Otherwise, filter products where the category matches (case-insensitive for safety)
        initialProducts.filter(
          (product) =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  // Render the catalog UI
  return (
    // Outer section container linked to the hero anchor tag
    <section
      id="popular-products"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
    >
      {/* Container spacing the heading, filter buttons, and product cards */}
      <div className="space-y-8">
        {/* Header container */}
        <div className="text-center space-y-4">
          {/* Main section heading */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Popular Products
          </h2>

          {/* Filter button list container with horizontal scrolling support */}
          <div className="flex gap-2 overflow-x-auto pb-2 mx-auto items-center justify-center">
            {/* Map over the categories array to generate filter pill buttons */}
            {CATEGORIES.map((cat) => {
              // Determine if this specific pill is the active one
              const isActive = selectedCategory === cat;

              // Return the button element
              return (
                <button
                  // Assign unique key for React rendering
                  key={cat}
                  // Set semantic button type
                  type="button"
                  // Update the selected category state when clicked
                  onClick={() => setSelectedCategory(cat)}
                  // Conditionally apply active highlight styling
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                    // Highlight active button with brand indigo, fallback to subtle card background
                    isActive
                      ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/30"
                      : "bg-brand-card text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {/* Button label text */}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional check: Show empty state if no products match the active filter */}
        {filteredProducts.length === 0 ? (
          // Empty state placeholder box
          <div className="text-center py-16 px-6 sm:px-8 border border-dashed border-zinc-800 rounded-2xl bg-brand-card/30">
            {/* Message indicating no items match */}
            <p className="text-zinc-400 text-base font-medium">
              No products found in the "{selectedCategory}" category.
            </p>
            {/* Secondary helpful prompt */}
            <p className="text-zinc-600 text-xs mt-1">
              Add products in this category via the Product Studio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Map over the filtered products array */}
            {filteredProducts.map((item) => (
              // Render individual card passing properties
              <ProductCardHome
                // Unique MongoDB document ID as React key
                key={item._id}
                // Product ID for dynamic routing
                id={item._id}
                // Product title
                name={item.name}
                // Category string
                category={item.category}
                // Product price
                price={item.price}
                // Stock status badge label
                status={item.stock > 0 ? "In Stock" : "Out of Stock"}
                // Cloudinary hosted image URL
                image={item.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

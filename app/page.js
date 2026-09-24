import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCardHome } from "./components/ProductCardHome";
import ProductCatelog from "./components/ProductCatalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProducts() {
  try {
    await connectDB();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString() || null,
      updatedAt: product.updatedAt.toISOString() || null,
    }));
  } catch (error) {
    console.error("Failed to fetch product from mongoDB", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Curate Your Dream <br className="hidden sm:inline" />
              <span className="text-white">Workspace</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg">
              Find the best gear for your workspace. Browse our collection of
              high-precision mechanical keyboards, ergonomic mice, and studio
              audio.
            </p>

            <div className="pt-1">
              <a
                href="#popular-products"
                className="inline-flex items-center justify-center bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg shadow-brand-indigo/30 transition active:scale-95"
              >
                Explore Collection
              </a>
            </div>
          </div>

          {/* Image Showcase Column */}
          <div className="lg:col-span-7">
            <div className="relative w-full rounded-2xl sm:rounded-3xl bg-brand-card border border-brand-border p-2 sm:p-4 overflow-hidden shadow-2xl">
              <img
                src="/images/dark-hero.avif"
                alt="StoreCraft Workspace Showcase"
                className="w-full h-auto aspect-[16/10] object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section with ID */}
      <ProductCatelog initialProducts={products} />
    </>
  );
}

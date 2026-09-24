import Link from "next/link";

const Footer = () => {
  return (
    <footer className="pt-16 pb-6">
      {/* Fixed: max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center space-y-8">
        {/* 3-Column Centered Group with Vertical Dividers */}
        <div className="flex items-start justify-center divide-x divide-zinc-800/80 text-sm">
          {/* Column 1 */}
          <div className="flex flex-col space-y-3 px-14 sm:px-20 text-zinc-500">
            <Link href="#" className="hover:text-zinc-200 transition">
              Products
            </Link>
            <Link href="#" className="hover:text-zinc-200 transition">
              Categories
            </Link>
            <Link href="#" className="hover:text-zinc-200 transition">
              Support
            </Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-3 px-14 sm:px-20 text-zinc-500">
            <Link href="#" className="hover:text-zinc-200 transition">
              About Us
            </Link>
            <Link href="#" className="hover:text-zinc-200 transition">
              Blog
            </Link>
            <Link href="#" className="hover:text-zinc-200 transition">
              Contact
            </Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-3 px-14 sm:px-20 text-zinc-500">
            <Link href="#" className="hover:text-zinc-200 transition">
              Legal
            </Link>
            <Link href="#" className="hover:text-zinc-200 transition">
              Privacy Terms
            </Link>
            <Link href="#" className="hover:text-zinc-200 transition">
              Cookies
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} StoreCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

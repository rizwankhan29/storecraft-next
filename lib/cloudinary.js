// Import the v2 interface of Cloudinary from the installed package
import { v2 as cloudinary } from "cloudinary";

// Configure the Cloudinary SDK using your existing environment variables
cloudinary.config({
  // Cloudinary account cloud name
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  // Cloudinary API Key
  api_key: process.env.CLOUDINARY_API_KEY,
  // Cloudinary API Secret
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // Enforce secure HTTPS transfer for all image operations
  secure: true,
});

// Export the named instance
export { cloudinary };
// Export default fallback
export default cloudinary;

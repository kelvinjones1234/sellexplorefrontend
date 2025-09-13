import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <AlertTriangle size={64} className="text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Oops! Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        We couldn’t find what you were looking for.
      </p>
      <div className="flex gap-4">
        <Link
          href="http://www.localhost:3000"
          className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Back to Home
        </Link>
        <Link
          href="http://www.localhost:3000/explore"
          className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Explore Other Stores
        </Link>
      </div>
    </div>
  );
}

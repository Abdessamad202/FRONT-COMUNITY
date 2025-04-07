import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">

        {/* Icon */}
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title & Message */}
        <h2 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
        <div className="text-gray-600 mt-2">
          The page you are looking for{"doesn't"} exist or has been moved.
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="mt-6 inline-block w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import { Rocket, User } from "lucide-react";
import { Link } from "react-router";

const CTASection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-xl overflow-hidden">
          <img
          src="http://localhost:8000/imgs/cards/pic5.jpg"
            alt="Community members"
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey today and connect with like-minded individuals who share your passions and interests.
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-4">
            <Link
              to={'/login'}
              className="flex px-6 py-3 bg-white text-indigo-600 border border-indigo-600 items-center gap-2 rounded-lg transition duration-200 shadow-md hover:bg-indigo-700 hover:border-white hover:text-white"
            >
              {/* "Get Started" icon */}
              <Rocket className="w-5 h-5" />
              Get Started
            </Link>

            <Link
              to={'/register'}
              className="flex px-6 py-3 bg-indigo-600 text-white border border-indigo-600 items-center gap-2 rounded-lg transition duration-200 shadow-md hover:bg-white hover:text-indigo-600 hover:border-indigo-600"
            >
              {/* "Sign Up" icon */}
              <User className="w-5 h-5" />
              Regiser
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CTASection;

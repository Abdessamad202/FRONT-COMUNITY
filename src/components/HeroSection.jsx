import { Link } from "react-router"
import { UserPlus } from "lucide-react"

// import { Link } from "react-router";
const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="http://localhost:8000/imgs/panners/pic1.jpg"
          alt="People collaborating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-90" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Our Community
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of members sharing knowledge, experiences, and building meaningful connections.
          </p>
          <div className="flex justify-center">
          <Link to={'/register'} className={`flex px-6 py-3 bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-700 hover:border-white hover:text-white  items-center gap-2 rounded-lg  transition duration-200 shadow-md`}>
              <UserPlus className="w-5 h-5" />
              Join the Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
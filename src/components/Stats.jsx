import { statsData } from "../data"
import Stat from "./Stat"

const Stats = () => {
  return (
    // {/* Community Stats with Background Image */}
    <div className="relative">
      <div className="absolute inset-0">
        <img
          src="http://localhost:8000/imgs/panners/pic2.jpg"
          alt="Community background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/90" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {statsData.map((stat, index) => (
            <Stat key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stats
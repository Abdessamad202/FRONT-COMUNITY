import { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Import UserContext to access the current user's data
import { useLocation } from "react-router"; // Import useLocation to get the current pathname
import {getStepColor} from '../utils/getStepColor'
const RegisterSteps = ({ status }) => {
  const { user } = useContext(UserContext); // Access the user data from context
  const location = useLocation(); // Get the current path using useLocation()

  

  return (
    <div className="text-center mb-8">
      {/* Step navigation container */}
      <div className="flex justify-around items-center steps">
        {/* Step 1 - Register */}
        <div className="flex flex-col items-center space-y-2 step">
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStepColor(1)}`}
          >
            <span>1</span>
          </div>
          {/* Step description */}
          <p className="text-xs text-gray-600">Register</p>
        </div>

        {/* Step 2 - Verify Email */}
        <div className="flex flex-col items-center space-y-2 step">
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStepColor(2)}`}
          >
            <span>2</span>
          </div>
          {/* Step description */}
          <p className="text-xs text-gray-600">Verify Email</p>
        </div>

        {/* Step 3 - Complete Profile */}
        <div className="flex flex-col items-center space-y-2 step">
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getStepColor(3)}`}
          >
            <span>3</span>
          </div>
          {/* Step description */}
          <p className="text-xs text-gray-600">Complete Profile</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSteps;

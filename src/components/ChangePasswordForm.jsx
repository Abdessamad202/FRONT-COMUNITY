import { Lock } from "lucide-react";
import { useContext, useState } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query"; // ✅ Import useMutation
import { handleInputChange } from "../utils/handlers";
import { UserContext } from "../context/UserContext";
import {resetPassword } from "../api/apiCalls";
import SubmitBtn from "./SubmitBtn";

const ChangePasswordForm = () => {
  // ✅ Access notification context for displaying messages
  const notify = useContext(NotificationContext);

  // ✅ Hook for navigation
  const navigate = useNavigate();

  // ✅ Form state for user input
  const [errors, setErrors] = useState({});
  
  // ✅ Access user context to update user state after password change
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email:user.email,password: "", password_confirmation: "" });

  // ✅ Handle password change mutation using React Query
  const { mutate: ChangePasswordMutation, isPending: isVerifying } = useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: (data) => {
      notify("success", data.message);
      setUser(data.user); // ✅ Update user state
      navigate("/home"); // ✅ Redirect user after successful password change
    },
    onError: (error) => {
      notify("error", "Password change failed. Try again.");
      setErrors(error.response?.data?.errors || { general: "Password change failed. Try again." });
    },
  });

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    // ✅ Call API mutation
    ChangePasswordMutation( formData );
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* New Password Input Field */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, setFormData, setErrors)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
              ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}
            `}
            placeholder="New Password"
            required
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>} {/* ✅ Show password error */}
      </div>

      {/* Confirm Password Input Field */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={(e) => handleInputChange(e, setFormData, setErrors)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
              ${errors.password_confirmation ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}
            `}
            placeholder="Confirm Password"
            required
          />
        </div>
        {errors.password_confirmation && (
          <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
        )} 
        {/* ✅ Show confirmation error */}
      </div>

      {/* General Error Message */}
      {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>} {/* ✅ Show general error */}

      {/* Submit Button */}
      <SubmitBtn title="Change Password" pandingTitle="Changing..." isPending={isVerifying} />
    </form>
  );
};

export default ChangePasswordForm;

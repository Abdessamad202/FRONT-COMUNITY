import { useMutation } from "@tanstack/react-query";
import { Mail, Lock } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { logIn } from "../api/apiCalls";
import { UserContext } from "../context/UserContext";
import { handleInputChange } from "../utils/handlers";
import { NotificationContext } from "../context/NotificationContext";
import SubmitBtn from "./SubmitBtn";

const LoginForm = () => {
  // ✅ Access notification context for displaying messages
  const notify = useContext(NotificationContext);

  // ✅ Hook for navigation
  const navigate = useNavigate();

  // ✅ Form state for user input
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // ✅ Access user context to update user state after login
  const { setUser } = useContext(UserContext);

  // ✅ Handle login mutation using React Query
  const { mutate: logInMutation, isPending: isLoggingIn } = useMutation({
    mutationFn: (formData) => logIn(formData),
    onSuccess: (data) => {
      notify("success", data.message);
      setUser(data.user);
      navigate("/home"); // Redirect to home if login is successful
    },
    onError: (error) => {
      const responseData = error.response?.data; // Get response data
  
      if (error.response?.status === 403) {
        notify("error", responseData?.message);
        setUser(responseData?.user);
  
        if (responseData?.registration_status === "pending") {
          navigate("/verify-email"); // Redirect to email verification page
        }else {
          navigate("/complete-profile"); // Redirect to email verification page
        }
      } else {
        notify("error", "Login failed. Try again.");
      }
  
      setErrors(responseData?.errors );
    },
  });
  
  


  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    logInMutation(formData);
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Input Field */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              onChange={(e) => handleInputChange(e, setFormData, setErrors)}
              value={formData.email}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
                ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}
              `}
              placeholder="Email address"
              required
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Password Input Field */}
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
              placeholder="Password"
              required
            />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        {/* General Error Message */}
        {/* {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>} */}

        {/* Submit Button */}
        <SubmitBtn isPending={isLoggingIn} title="Sign in" pandingTitle="Signing in ..." />
      </form>

      {/* Link to Register Page */}
      <p className="mt-4 text-center text-sm text-gray-600">
        {"Don't"} have an account?{" "}
        <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Create one
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        {"Forgot"} your password?{" "}
        <Link to="/check-email" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Reset
        </Link>
      </p>
    </>
  );
};

export default LoginForm;

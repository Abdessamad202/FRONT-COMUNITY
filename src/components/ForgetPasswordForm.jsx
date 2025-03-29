import { Mail } from "lucide-react";
import { useContext, useState } from "react";
import SubmitBtn from "./SubmitBtn";
import { handleInputChange } from "../utils/handlers";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router";
import { sendResetPasswordCode } from "../api/apiCalls";
import { UserContext } from "../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import LogInLink from "./LogInLink";

const ForgotPasswordForm = () => {
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
    const { mutate: verificationMutation, isPending: isVerifying } = useMutation({
      mutationFn: (formData) => sendResetPasswordCode(formData),
      onSuccess: (data) => {
        notify("success", data.message);
        setUser(data.user);
        navigate("/validate-code"); // Redirect user based on success status
      },
      onError: (error) => {
        notify("error", "Login failed. Try again.");
        setErrors(error.response?.data?.errors || { general: "Login failed. Try again." });
      },
    });

    // ✅ Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      verificationMutation(formData);
    };
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Input Field */}
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, setFormData, setErrors)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
              ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}`}
            placeholder="Email address"
            required
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Submit Button */}
      <SubmitBtn isPending={isVerifying} title="Send Reset Link" pandingTitle="Sending..." />
      <LogInLink />
    </form>
  );
};

export default ForgotPasswordForm;

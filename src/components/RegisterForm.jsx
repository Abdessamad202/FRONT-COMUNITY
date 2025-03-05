import { Mail, Lock } from 'lucide-react'; // Import icons for email and password fields
import { useNavigate } from 'react-router'; // Import Link for navigation and useNavigate for redirecting
import { useContext, useState } from 'react'; // Import hooks for context and state management
import { useMutation } from '@tanstack/react-query'; // Import mutation hook for API calls
import { UserContext } from '../context/UserContext'; // User context for managing user state
import { NotificationContext } from '../context/NotificationContext'; // Notification context for showing messages
import { register } from '../api/apiCalls'; // Register API call
import { handleInputChange } from '../utils/handlers'; // Input change handler utility function
import SubmitBtn from './SubmitBtn'; // Custom submit button component
import LogInLink from './LogInLink';

const RegisterForm = () => {
  // State and context initialization
  const navigate = useNavigate(); // For navigating to different routes
  const { setUser } = useContext(UserContext); // Access user context to set user after registration
  const notify = useContext(NotificationContext); // Access notification context to show success/error messages
  const [formData, setFormData] = useState({ email: '', password: '' }); // State to hold form data
  const [errors, setErrors] = useState({}); // State to hold form validation errors

  // React Query mutation for the registration API call
  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: (formData) => register(formData), // Define the API call function
    onSuccess: (data) => { // On successful registration
      notify("success", data.message); // Show success notification
      setUser(data.user); // Set user data in context
      navigate('/verify'); // Navigate to verification page
    },
    onError: (error) => { // On failed registration
      notify("error", "Registration failed. Try again."); // Show error notification
      setErrors(error.response?.data?.errors || { general: "Registration failed. Try again." }); // Set error messages
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    registerMutation(formData); // Call the mutation function to submit the registration data
    setErrors({}); // Clear any existing errors
  };

  return (
    <>
      {/* Registration Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Email Input */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, setFormData, setErrors)} // Handle input change
              className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
                  ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}`} // Conditional class for error state
              placeholder="Email address"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>} {/* Show error message if any */}
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              onChange={(e) => handleInputChange(e, setFormData, setErrors)} // Handle input change
              value={formData.password}
              placeholder="Password"
              className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
                  ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}`} // Conditional class for error state
            />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>} {/* Show error message if any */}
        </div>

        {/* Submit Button */}
        <SubmitBtn isPending={isPending} title="Create account" pandingTitle="Creating ..." />

      </form>
      {/* Login Link */}
      <LogInLink />
    </>
  );
};

export default RegisterForm;

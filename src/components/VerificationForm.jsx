import { Lock } from 'lucide-react'; // Icon for password input
import { Link, useLocation, useNavigate } from 'react-router'; // React Router hooks
import { useContext, useState } from 'react'; // React hooks
import { useMutation } from '@tanstack/react-query'; // React Query for data fetching and mutation
import { UserContext } from '../context/UserContext'; // Context to access user data
import { NotificationContext } from '../context/NotificationContext'; // Context for notifications
import {  reSendCode, verificationByLocation } from '../api/apiCalls'; // API calls for verification and resending code
import { handleInputChange } from '../utils/handlers'; // Utility for input change handling
import SubmitBtn from './SubmitBtn'; // Submit button component

const VerificationForm = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  console.log(pathname === "/verify-code");

  const [formData, setFormData] = useState({ code: '' }); // State to hold the verification code
  const notify = useContext(NotificationContext); // Notification context to show messages
  const { user, setUser } = useContext(UserContext); // Access user data from context
  const  id = user?.id; // Extract user ID from context
  const [errors, setErrors] = useState({}); // State to hold any validation errors

  // Mutation for verifying the code
  const { mutate: verifyCode, isPending: isVerifying } = useMutation({
    mutationFn: ({ pathname,id, formData }) => verificationByLocation(pathname,id,formData), // Dynamic data for user ID and form data
    onSuccess: (data) => {
      notify('success', data.message); // Notify on successful verification
      setUser((prev) => ({ ...prev, ...data.user})); // Update user context with new step
      navigate(pathname === "/verify-code" ? '/change-password' : '/profile'); // Redirect to verification code page
      setErrors({});
    },
    onError: (error) => {
      notify('error', 'Verification failed. Try again.'); // Notify on error
      setErrors(error.response?.data?.errors || { general: 'Verification failed. Try again.' }); // Set error messages
      console.log(error)
    },
  })

  // Mutation for resending the verification code
  const { mutate: resendingCode, isPending: isReSending } = useMutation({
    mutationFn: ({ pathname,id }) => reSendCode(pathname,id), // Dynamic user ID
    onSuccess: (data) => {
      console.log(data.user);

      notify('success', data.message); // Notify on successful resend
      setErrors({});
    },
    onError: (error) => {
      notify('error', 'Failed to resend code. Try again.'); // Notify on resend failure
      setErrors(error.response?.data?.errors || { general: 'Failed to resend code. Try again.' }); // Set error messages
    },
  });

  // Handle form submission for code verification
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode({ pathname ,id, formData }); // Pass dynamic user ID and form data
  };

  // Handle code resend request
  const resendCode = (e) => {
    e.preventDefault();
    resendingCode({pathname,id}); // Trigger resend code mutation
  };

  return (
    <>
      {/* Verification Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Code Input Field */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="code"
              onChange={(e) => handleInputChange(e, setFormData, setErrors)} // Handle input change
              value={formData.code}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
                ${errors.code ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500 focus:border-transparent'}
              `}
              placeholder="Verification code"
              required
            />
          </div>
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>} {/* Display error if any */}
        </div>

        {/* Submit Button */}
        <SubmitBtn isPending={isVerifying} title="Verify Code" pandingTitle="Verifying..." />
      </form>

      {/* Resend Code Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        {"Didn't"} receive the code?{' '}
        <Link
          to=""
          onClick={resendCode} // Trigger resend action
          className="text-indigo-600 hover:text-indigo-500 font-medium"
          disabled={isReSending} // Disable the link when resending
        >
          {isReSending ? 'Resending...' : 'Resend Code'} {/* Change text while resending */}
        </Link>
      </p>
    </>
  );
};

export default VerificationForm;

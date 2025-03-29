import { Outlet, useLocation } from "react-router"; // React Router hooks for dynamic routing
import FormHeader from "../components/FormHeader";
import ForgetPasswordSteps from "../components/ForgetPasswordSteps";
// import {  Key, Lock, ShieldCheck } from "lucide-react";

const ForgetPasswordLayout = () => {
  const location = useLocation(); // Get current route path

  // Define dynamic content based on the route
  let headerContent = null;
  switch (location.pathname) {
    case "/verify-email":
      headerContent = (
        <FormHeader title="Forget Password" description="Enter your email to reset your password">
          {/* <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div> */}
        </FormHeader>
      );
      break;
    case "/verify-code":
      headerContent = (
        <FormHeader title="Verify your email" description="Enter the verification code we sent to your email.">
          {/* <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div> */}
        </FormHeader>
      );
      break;
    case "/change-password":
      headerContent = (
        <FormHeader title="Change Password" description="Enter your new password" >
          {/* <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-indigo-600" />
          </div> */}
        </FormHeader>
      );
      break;
    default:
      return null; // If no matching route, return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main container with background gradient */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Steps component for the registration flow */}
        <ForgetPasswordSteps />
        {/* Dynamic header content based on the current route */}
        {headerContent}
        {/* Outlet for nested route components */}
        <Outlet />
      </div>
    </div>
  );
};

export default ForgetPasswordLayout;

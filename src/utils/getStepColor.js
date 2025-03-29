// Helper function to determine step color based on the current path and status
export const getStepColor = (stepNumber) => {
  if (stepNumber === 1) {
    // Step 1 - Register
    return location.pathname === "/register" ? "bg-indigo-600" : "bg-green-600";
  } else if (stepNumber === 2) {
    // Step 2 - Verify Email
    return location.pathname === "/verify-email"
      ? "bg-indigo-600"
      : location.pathname === "/complete-profile" 
      ? "bg-green-600"
      : "bg-gray-300";
  } else if (stepNumber === 3) {
    // Step 3 - Complete Profile
    return location.pathname === "/complete-profile"
      ? "bg-indigo-600"
      : location.pathname === "/verify-email" || location.pathname === "/register"
      ? "bg-gray-300"
      : "bg-green-600"
  }
};
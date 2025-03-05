export const getStepColor = (stepNumber, path, actualStep) => {
  if (actualStep >= stepNumber) return "bg-green-600"; // Completed
  else if (location.pathname === path) return "bg-indigo-600"; // In progress
  return "bg-gray-300"; // Not started
};

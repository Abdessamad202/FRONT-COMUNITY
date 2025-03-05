import PropTypes from "prop-types"; // Import PropTypes for type checking

const FormHeader = ({ title, description,children }) => {
  return (
    <div className="text-center mb-8">
      {/* Display the title and description passed as props */}
      {children}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

// Define PropTypes to ensure correct types for the props
FormHeader.propTypes = {
  children: PropTypes.node, // 'children' should be a required string
  title: PropTypes.string.isRequired, // 'title' should be a required string
  description: PropTypes.string.isRequired, // 'description' should be a required string
};

export default FormHeader;

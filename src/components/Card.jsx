import PropTypes from "prop-types";

const Card = ({ img,  title, description }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
    <img src={img} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);
Card.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
export default Card
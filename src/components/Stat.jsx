import PropTypes from "prop-types"

const Stat = ({ title, value }) => {
  return (
    <div>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-indigo-100">{title}</div>
    </div>
  )
}

Stat.propTypes = {
  value: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
}

export default Stat
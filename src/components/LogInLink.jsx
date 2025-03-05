import { Link } from "react-router"

const LogInLink = () => {
  return (
    <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Log in
        </Link>
      </p>
  )
}

export default LogInLink
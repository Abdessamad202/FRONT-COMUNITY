import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { handleInputChange } from "../utils/handlers";

// /**
//  * A reusable password input component with visibility toggle
//  * @param {Object} props - Component props
//  * @param {string|Object} props.name - Input name (string) or object containing name property
//  * @param {string} [props.placeholder] - Input placeholder text
//  * @param {string} [props.value] - Input value
//  * @param {Function} props.onChange - Function to handle input change
//  * @param {string} [props.error] - Error message to display
//  * @param {string} [props.label] - Label text for the input
//  * @param {string} [props.className] - Additional CSS classes for the input
//  * @param {boolean} [props.required] - Whether the input is required
//  */
export default function PasswordInput({
	name = "password",
	placeholder = "Enter password",
	value = "",
	label = null,
	setFormData,
	setErrors = null,
	className = "",
	required = false,
	error = "",
	...rest
}) {
	const [showPassword, setShowPassword] = useState(false);

	// Handle name if it's an object or string
	// const inputName = typeof name === 'object' ? name.value || 'password' : name;
	// const displayLabel = label || (typeof inputName === 'string' ?
	//   inputName.charAt(0).toUpperCase() + inputName.slice(1) : 'Password');
	// Toggle password visibility
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<>
			{/* Label */}
			{label && (
				<label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
					{label}
				</label>
			)}
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					id={name}
					autoComplete={""}
					// aut
					name={name}
					value={value}
					onChange={(e) => handleInputChange(e, setFormData, setErrors)}
					placeholder={placeholder}
					className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
        ${
					error
						? "border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500"
						: "border-gray-300 dark:border-gray-600"
				} 
        dark:bg-gray-700 dark:text-white ${className}`}
					required={required}
					{...rest}
				/>

				{/* Toggle visibility button */}
				<button
					type="button"
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
				{/* Error message */}
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
			)}
		</>
	);
}

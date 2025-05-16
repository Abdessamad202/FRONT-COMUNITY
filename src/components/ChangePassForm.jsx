import { Lock, Save } from "lucide-react"
import { useContext, useState } from "react"
import PasswordInput from "./PasswordInput"
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext"
export default function ChangePassForm() {
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    })
    const [errors, setErrors] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const notify = useContext(NotificationContext)
    const changePasswordMutation = useMutation({
        mutationFn : (data) => changePassword(data),
        onSuccess: (data) => {
            notify("success", data.message)
            setFormData({
                current_password: "",
                new_password: "",
                new_password_confirmation: ""
            })
            setErrors({})
            // Notify user of success
        },
        onError: (error) => {
            notify("error", error.response?.data?.message || "An error occurred")
            setErrors(error.response?.data?.errors || {})
            console.log(errors);
            
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        changePasswordMutation.mutate(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Password change form */}
            <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <Lock size={18} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                    Change Password
                </h3>

                <div className="space-y-4">
                    <div>
                        <PasswordInput label={"Current Password"} setFormData={setFormData} error={errors.current_password} name={"current_password"} placeholder="Enter current password" setErrors={setErrors} value={formData.current_password}/>
                    </div>
                    <div>
                        <PasswordInput label={"New Password"} setFormData={setFormData} error={errors.new_password} name={"new_password"} placeholder="Enter new password" setErrors={setErrors} value={formData.new_password}/>
                    </div>
                    <div>
                        <PasswordInput label={"Confirm Password"} setFormData={setFormData} error={errors.new_password_confirmation} name={"new_password_confirmation"} placeholder="Confirm new password" setErrors={setErrors} value={formData.new_password_confirmation}/>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                >
                    <Save size={16} className="mr-2" />
                    {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </button>
            </div>
        </form>
    )
}
import ForgotPasswordForm from "../components/ForgetPasswordForm";
import FormHeader from "../components/FormHeader";
import ValidateCodeForm from "../components/ValidateCodeForm";
export default function ValidateCode() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Main container with background gradient */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                {/* Dynamic header content based on the current route */}
                <FormHeader title="Validate Code" description="Enter your code that we send  to you in email" />
                {/* Outlet for nested route components */}
                <ValidateCodeForm />
            </div>
        </div>
    )
}

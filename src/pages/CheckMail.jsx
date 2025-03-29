import ForgetPasswordSteps from "../../../comunity_app_front/src/components/ForgetPasswordSteps";
import ForgotPasswordForm from "../components/ForgetPasswordForm";
import FormHeader from "../components/FormHeader";

export default function CheckMail() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Main container with background gradient */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                {/* Dynamic header content based on the current route */}
                <FormHeader title="Forget Password" description="Enter your email to reset your password" />
                {/* Outlet for nested route components */}
                <ForgotPasswordForm/>
            </div>
        </div>
    )
}
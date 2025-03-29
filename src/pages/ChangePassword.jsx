import ChangePasswordForm from "../components/ChangePasswordForm";
import FormHeader from "../components/FormHeader";

export default function ChangePassword() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Main container with background gradient */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                {/* Dynamic header content based on the current route */}
                <FormHeader title="Change Password" description="you can now change you password" />
                {/* Outlet for nested route components */}
                <ChangePasswordForm/>
            </div>
        </div>
    )
}
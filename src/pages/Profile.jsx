import FormHeader from "../components/FormHeader";
import ProfileCompletionForm from "../components/ProfileCompletionForm";
import RegisterForm from "../components/RegisterForm";
import RegisterSteps from "../components/RegisterSteps";
import VerificationForm from "../components/VerificationForm";

export default function Profile() {
  return (
    <div>
      <RegisterSteps />
      <FormHeader title="Verify your email" description="Enter the verification code we sent to your email." />
      <ProfileCompletionForm />
    </div>
  );

};

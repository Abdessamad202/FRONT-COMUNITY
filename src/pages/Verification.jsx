import FormHeader from "../components/FormHeader";
import RegisterForm from "../components/RegisterForm";
import RegisterSteps from "../components/RegisterSteps";
import VerificationForm from "../components/VerificationForm";

export default function Verification() {
  return (
    <div>
      <RegisterSteps status={"panding"} />
      <FormHeader title="Verify your email" description="Enter the verification code we sent to your email." />
      <VerificationForm />
    </div>
  );

};

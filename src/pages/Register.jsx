import FormHeader from "../components/FormHeader";
import RegisterForm from "../components/RegisterForm";
import RegisterSteps from "../components/RegisterSteps";

export default function Register() {
  return (
    <div>
      <RegisterSteps />
      <FormHeader title="Create an account" description="Join us today!" />
      <RegisterForm />
    </div>
  );

};

import { User, Calendar } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { NotificationContext } from '../context/NotificationContext';
import { UserContext } from '../context/UserContext';
import { completeProfile } from '../api/apiCalls';
import { handleInputChange } from '../utils/handlers';
import SubmitBtn from './SubmitBtn';

const ProfileCompletionForm = () => {
  const notify = useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const id = user?.id;

  // Navigation
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    date_of_birth: '',
  });

  // Errors state
  const [errors, setErrors] = useState({});

  // Mutation for profile completion
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: ({ id, formData }) => completeProfile(id, formData),
    onSuccess: (data) => {
      notify("success", data.message);
      navigate('/home');
    },
    onError: (error) => {
      const status = error.response?.status;
      const serverErrors = error.response?.data?.errors || { general: "Profile completion failed. Try again." };

      if (status === 409) { // Profile already completed
        notify("info", "Your profile is already completed.");
        navigate('/home');
      } else if(status === 403) {
        notify("info", "Your email verification is pending. Please verify your email to continue.");
        navigate('/verify-email'); // Redirect to verification page
      }else{
        notify("error", "Profile completion failed. Try again.");
        setErrors(serverErrors);

      }

      console.log(serverErrors);
    },
  });


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id, formData });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, setFormData, setErrors)}
            placeholder="Name"
            className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
                  ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}`}
          />
        </div>
        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
      </div>

      {/* Date of Birth Field */}
      <div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange(e, setFormData, setErrors)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition outline-none
                  ${errors.date_of_birth ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500 focus:border-transparent"}`}
          />
        </div>
        {errors.date_of_birth && <div className="text-red-500 text-xs mt-1">{errors.date_of_birth}</div>}
      </div>

      {/* Sex Selection - Radio Buttons */}
      <div>
        <div className="text-gray-700 font-medium mb-2">Select your sex:</div>
        <div className="flex gap-4 justify-center">
          {/* Male Option */}
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${formData.gender === 'M' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}>
            <input type="radio" name="gender" value="M" className="hidden" onChange={(e) => handleInputChange(e, setFormData, setErrors)} />
            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${formData.gender === 'M' ? 'border-indigo-500' : 'border-gray-400'}`}>
              {formData.gender === 'M' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
            </div>
            <span className="text-gray-700 font-medium">Male</span>
          </label>
          {/* Female Option */}
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${formData.gender === 'F' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}>
            <input type="radio" name="gender" value="F" className="hidden" onChange={(e) => handleInputChange(e, setFormData, setErrors)} />
            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${formData.gender === 'F' ? 'border-indigo-500' : 'border-gray-400'}`}>
              {formData.gender === 'F' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
            </div>
            <span className="text-gray-700 font-medium">Female</span>
          </label>
        </div>
        {errors.gender && <div className="text-red-500 text-xs text-center mt-1">{errors.gender}</div>}
      </div>

      {/* Submit Button */}
      <SubmitBtn isPending={isSubmitting} title="Submit" pandingTitle="Submitting ..." />
    </form>
  );
};

export default ProfileCompletionForm;

export const handleInputChange = (e, setFormData, setErrors = null) => {
  const { name, value } = e.target;

  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));

  if (setErrors) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      general: "",
    }));
  }
};
export const handleImageChange = (file,setFormData) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }
};

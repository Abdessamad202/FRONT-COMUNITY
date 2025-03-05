export const handleInputChange = (e, setFormData , setErrors) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => {
    return {
      ...prevFormData,
      [name]: value,
    }
  })
  setErrors((prevErrors) => {
    return {
      ...prevErrors,
      [name]: ""
    }
  })
}

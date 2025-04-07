import { useState, useEffect } from "react";
import { X, Camera, Save, Loader2, Trash2 } from "lucide-react"; // Added Trash2
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/apiCalls";
import { useParams } from "react-router";
import { useProfile } from "../hooks/useProfile";

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { id: userId } = useParams();
  const { data: userData, isLoading: isUserLoading } = useProfile(userId);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    picture: null,
    picturePreview: null,
    description: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData) => updateProfile(updatedData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries(["profile", userId]);
      const previousProfile = queryClient.getQueryData(["profile", userId]);
      queryClient.setQueryData(["profile", userId], (old) => {
        if (!old || !old.profile) return old;
        const newPicture = newData.get("picture")
          ? formData.picturePreview
          : newData.get("picture") === "null"
          ? "imgs/profiles/user.jpg"
          : old.profile.picture;
        return {
          ...old,
          profile: {
            ...old.profile,
            name: newData.get("name") || old.profile.name,
            gender: newData.get("gender") || old.profile.gender,
            description: newData.get("description") || old.profile.description,
            picture: newPicture,
          },
        };
      });
      return { previousProfile };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["profile", userId], context.previousProfile);
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", userId]);
      onClose();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["profile", userId]);
    },
  });

  useEffect(() => {
    if (userData && userData.profile) {
      const profile = userData.profile;
      console.log("profile"+profile);
      setFormData({
        name: profile.name || "",
        gender: profile.gender || "",
        picture: profile.picture,
        picturePreview: profile.picture || null,
        description: profile.description || "",
      });
    }
  }, [userData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        picture: file,
        picturePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemovePicture = () => {
    setFormData((prev) => ({
      ...prev,
      picture: null,
      picturePreview: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "picturePreview") {
        form.append(key, formData[key] === null ? "null" : formData[key]);
      }
    });
    updateProfileMutation.mutate(form);
  };

  if (!isOpen || isUserLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-indigo-200 cursor-pointer">
                  {formData.picturePreview ? (
                    <img
                      src={formData.picturePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                </div>
                {/* Trash icon for removing picture */}
                {formData.picturePreview && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {/* Camera icon for uploading new picture */}
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isLoading}
              className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {updateProfileMutation.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {updateProfileMutation.isError && (
          <div className="text-red-500 mt-4 text-sm">
            Error: {updateProfileMutation.error?.message || "Something went wrong. Please try again."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEditModal;
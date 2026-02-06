import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";

const formFields = [
  {
    label: "First Name*",
    name: "firstName",
    type: "text",
    placeholder: "Enter your first name",
  },
  {
    label: "Last Name*",
    name: "lastName",
    type: "text",
    placeholder: "Enter your last name",
  },
  {
    label: "Email Id*",
    name: "email",
    type: "email",
    placeholder: "xyz@gmail.com",
  },
  {
    label: "Nationality",
    name: "nationality",
    type: "text",
    placeholder: "Enter your nationality",
  },
  {
    label: "Photo URL",
    name: "photo",
    type: "url",
    placeholder: "Enter image URL",
  },
];

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    nationality: "",
    photo: "",
  });

  console.log(user);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, ...user }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    try {
      axios.patch(`${baseUrl}/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } catch (err) {}
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-8 max-w-7xl mx-auto">
      <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl w-full lg:w-1/2 border border-base-300">
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Profile
          </h2>
          <div className="space-y-4">
            {formFields.map(({ label, name, type, placeholder }) => (
              <div key={name} className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">{label}</span>
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered h-24 focus:textarea-primary"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
          <div className="card-actions justify-center mt-6">
            <button 
              onClick={handleUpdate} 
              className="btn btn-primary btn-lg px-10 hover:scale-105 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Update Profile
            </button>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <UserCard feedData={formData} />
      </div>
    </div>
  );
};

export default EditProfile;

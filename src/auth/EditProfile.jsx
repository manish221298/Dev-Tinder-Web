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
    <div className="flex flex-col sm:flex-row gap-5 my-5">
      <div className="card card-border bg-base-200 w-full sm:w-1/2">
        <div className="card-body">
          <h2 className="card-title justify-center">Update Profile</h2>
          <div className="w-full">
            {formFields.map(({ label, name, type, placeholder }) => (
              <fieldset key={name} className="fieldset">
                <legend className="fieldset-legend">{label}</legend>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input"
                  placeholder={placeholder}
                />
              </fieldset>
            ))}

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Bio</legend>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input h-24"
                placeholder="Tell us about yourself"
              />
            </fieldset>
          </div>
          <div className="card-actions justify-center">
            <button onClick={handleUpdate} className="btn btn-success px-10">
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/2 ">
        <UserCard feedData={formData} />
      </div>
    </div>
  );
};

export default EditProfile;

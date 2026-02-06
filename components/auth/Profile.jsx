'use client';

import { useSelector } from 'react-redux';
import EditProfile from './EditProfile';

const Profile = () => {
  const userData = useSelector((state) => state.user);

  return (
    <div className="flex justify-center my-10">
      <EditProfile user={userData} />
    </div>
  );
};

export default Profile;


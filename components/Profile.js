import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

function Profile() {
  const { userProfile, updateProfile } = useAuth();
  const [editedProfile, setProfile] = useState(userProfile);

  const saveProfile = () => {
    updateProfile(editedProfile);
  };

  return (
    <article className="card">
      <label htmlFor="address">
        Address
        <input
          type="text"
          id="address"
          name="address"
          defaultValue={userProfile?.address}
          placeholder="Address"
          disabled
        />
      </label>
      <div className="grid">
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            defaultValue={userProfile?.name}
            onChange={(e) =>
              setProfile({ ...editedProfile, name: e.target.value })
            }
          />
        </label>

        <label htmlFor="color">
          Favorite Color
          <input
            type="color"
            id="color"
            name="color"
            defaultValue={userProfile?.color}
            onChange={(e) =>
              setProfile({ ...editedProfile, color: e.target.value })
            }
          />
        </label>
      </div>

      <label htmlFor="info">Bio</label>
      <textarea
        id="info"
        name="info"
        placeholder="Your personal info"
        defaultValue={userProfile?.info}
        onChange={(e) => setProfile({ ...editedProfile, info: e.target.value })}
      />

      <button onClick={saveProfile}>Update Profile</button>
    </article>
  );
}

export default Profile;

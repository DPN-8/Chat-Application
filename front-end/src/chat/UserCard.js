import React from 'react';

const UserCard = ({ user, onClick }) => {
  return (
    <div className="user-card" onClick={() => onClick(user)}>
      <h3>{user.username}</h3>
      <p>Mobile Number: {user.mobile_number}</p>
    </div>
  );
};

export default UserCard;

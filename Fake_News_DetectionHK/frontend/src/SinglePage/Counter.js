import React, { useState, useEffect } from 'react';

function User() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/users/octocat')
      .then(response => response.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      {user && (
        <>
          <p>Name: {user.name}</p>
          <p>Location: {user.location}</p>
        </>
      )}
    </div>
  );
}

export default User;

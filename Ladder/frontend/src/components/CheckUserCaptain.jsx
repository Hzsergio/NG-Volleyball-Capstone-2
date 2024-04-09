import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckUserCaptain = ({ userId, divisionName }) => {
  const [isCaptain, setIsCaptain] = useState(false);

  useEffect(() => {
    const checkUserIsCaptain = async () => {
      try {
        // Make a request to the backend to check if the user is a captain of any team in the division
        const response = await axios.get(`http://localhost:8000/teamindivision/check-user-captain/${divisionName}/${userId}`);
        console.log('Info:', {userId} )
        console.log(response.data)
        setIsCaptain(response.data.isCaptain);
      } catch (error) {
        console.error('Error checking if user is a captain:', error);
      }
    };

    checkUserIsCaptain();
  }, [userId, divisionName]);

  return (
    <div>
      {isCaptain ? (
        
        <div> <button className='btn btn-primary'> You are a captain of a team in this division</button> </div>
      ) : (
        <p>You are not a captain of any team in this division.</p>
      )}
    </div>
  );
};

export default CheckUserCaptain;

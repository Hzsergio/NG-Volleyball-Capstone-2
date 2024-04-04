import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'


function CheckDivisionAdmin({ divisionName, userId }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/teamindivision/check-admin/${divisionName}/${userId}/`);
        setIsAdmin(response.data.is_admin);
        setError('');
      } catch (error) {
        setError('Error checking admin status');
        setIsAdmin(null);
      }
    };

    fetchAdminStatus();
  }, [divisionName, userId]);

  const handleAssignPositions = async () => {
    try {
      await axios.post(`http://localhost:8000/teamindivision/assign-positions/${divisionName}/`);
      setError('');
      // Optionally, you can perform additional actions after successful assignment
      console.log('Positions assigned successfully.');
      toast.success("Started Division")

    } catch (error) {
      setError('Error assigning positions');
    }
  };

  return (
    <div>
      {isAdmin !== null && (
        <div>
          <p>{isAdmin ? 'User is the admin' : 'User is not the admin'}</p>
          {isAdmin && (
            <button className='btn btn-primary' onClick={handleAssignPositions}>Assign Positions</button>
          )}
        </div>
      )}
      {error && <p>{error}</p>}
      <br/>
    </div>
  );
}

export default CheckDivisionAdmin;

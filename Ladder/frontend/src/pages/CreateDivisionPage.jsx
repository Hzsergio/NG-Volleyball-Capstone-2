import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; 
import { useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUserInfo } from '../features/auth/authSlice'

const CreateDivisionPage = () => {
  const dispatch = useDispatch()
  const [name, setName] = useState('');
  // Add other state variables if needed

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user information when the component mounts
    dispatch(getUserInfo());
  }, []); // Only run the effect once when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        'http://localhost:8000/division/',
        { name, admin: userInfo.id }, // Use the logged-in user's ID as the admin
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Division created successfully:', response.data);
        toast.success("Division created successfully")
        navigate("/dashboard")
      })
      .catch((error) => {
        console.error('Error creating division:', error);
        toast.error("Error creating division")
        // Handle errors
      });
  };

  return (
    <div>
      <h1 className="main__title">Create Division</h1>
      <form className="auth__form" onSubmit={handleSubmit}>
        Division Name:
        <input
          type="text"
          value={name}
          placeholder="Division Name"
          required
          onChange={(e) => setName(e.target.value)}
        />
        {/* Add other input fields for division creation */}
        <button className="btn btn-primary" type="submit">
          Create Division
        </button>
      </form>
    </div>
  );
};

export default CreateDivisionPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action

import CheckUserCaptain from '../components/CheckUserCaptain' // Import the CheckUserCaptain component
import CheckDivisionAdmin from '../components/CheckDivisionAdmin';

const DivisionDetailsPage = () => {
  const [divisionDetails, setDivisionDetails] = useState([]);
  const { name } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function



  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        // Fetch teams in the division along with their positions
        const teamsResponse = await axios.get(`http://localhost:8000/teamindivision/${name}/`);
        console.log('Teams in Division API response:', teamsResponse.data);
        setDivisionDetails(teamsResponse.data);
      } catch (error) {
        console.error('Error fetching division details:', error);
      }
    };

    fetchDivisionDetails();
    dispatch(getUserInfo());

  }, [name]);

  return (
    <div>
      <h1>Teams in {name} Division</h1>
      <div className="division-container">
        <ul>
          {divisionDetails.map((teamInfo, index) => (
            <li key={index} className="division-box" style={{ color: 'var(--color-white)' }}>
              <strong>Team Name:</strong> <br/> {teamInfo.team_name} <br/> <strong>Position:</strong> {teamInfo.position}
            </li>
          ))}
        </ul>
      </div>
      {/* Use the CheckUserCaptain component */}
      <CheckUserCaptain userId={userInfo.id} divisionName={name} />
      
      <CheckDivisionAdmin divisionName={name} userId={userInfo.id} />

      <Link to={`/joindivision/${name}`}>
        <button className="btn btn-primary">Join Division</button>
      </Link>


    </div>
  );
};

export default DivisionDetailsPage;

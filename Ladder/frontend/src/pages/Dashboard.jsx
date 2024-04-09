import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import GetChallenges from '../components/GetChallenges';


const Dashboard = () => {
  const [userTeams, setUserTeams] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        if (userInfo) { // Check if userInfo is available
          const response = await axios.get(`http://localhost:8000/team/user_teams/${userInfo.id}/`);
          console.log('Response:', response.data);
          setUserTeams(response.data);
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
        // Handle errors
      }
    };

    fetchUserTeams();
  }, [userInfo]); // Only run the effect when userInfo changes

  useEffect(() => {
    // Fetch user information when the component mounts
    dispatch(getUserInfo());
  }, []); // Only run the effect once when the component mounts

  return (
    <div>
      <h1 className='main__title'> {userInfo && userInfo.first_name} Teams</h1> {/* Use userInfo && userInfo.first_name to avoid rendering before userInfo is available */}
      <div className="division-container">
        {userTeams.map((team) => (
          <div key={team.id} className="division-box" >
            <Link to={`/team/${team.id}`} style={{ color: 'var(--color-white)' }}>
              <strong>{team.name}</strong> - Created by: {team.captain_username}
            </Link>
          </div>
        ))}
      </div>
      <Link to="/createteam">
        <button className="btn btn-primary">Create Team</button>
      </Link>

      <GetChallenges/>
      
    </div>
  );
};

export default Dashboard;

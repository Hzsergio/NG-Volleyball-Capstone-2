import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import CheckUserCaptain from '../components/CheckUserCaptain'; // Import the CheckUserCaptain component
import CheckDivisionAdmin from '../components/CheckDivisionAdmin';
import CustomizedTables from '../components/ranktable';

const DivisionDetailsPage = () => {
  const [divisionDetails, setDivisionDetails] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null); // State to store current team
  const { name } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function
  const [isCaptain, setIsCaptain] = useState(false);

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

    const fetchCurrentTeam = async () => {
      try {
        // Fetch current team of the user
        const currentTeamResponse = await axios.get(`http://localhost:8000/teamindivision/current-team/${name}/${userInfo.id}/`);
        console.log('Current Team:', currentTeamResponse.data);
        setCurrentTeam(currentTeamResponse.data.team_id);
      } catch (error) {
        console.error('Error fetching current team:', error);
      }
    };

    fetchDivisionDetails();
    fetchCurrentTeam();
    dispatch(getUserInfo());
  }, [name, userInfo.id]);

  return (
    <div>
      <h1>{name} Division</h1>

      <CustomizedTables/>
      
      {/* Use the CheckUserCaptain component */}
      <CheckUserCaptain userId={userInfo.id} divisionName={name} setIsCaptain={setIsCaptain}/>
      
      <CheckDivisionAdmin divisionName={name} userId={userInfo.id} />

      <Link to={`/joindivision/${name}`}>
        <button className="btn btn-primary">Join Division</button>
      </Link>

    </div>
  );
};

export default DivisionDetailsPage;

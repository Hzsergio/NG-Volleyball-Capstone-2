import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useNavigate} from 'react-router-dom'
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action



const JoinDivisionPage = () => {
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const { divisionName } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch(); // Get the dispatch function



  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/team/user_teams/${userInfo.id}/`);
        setUserTeams(response.data);
      } catch (error) {
        console.error('Error fetching user teams:', error);
        // Handle errors
      }
    };
    dispatch(getUserInfo());
    fetchUserTeams();
  }, [userInfo]);

  const handleTeamSelect = (event) => {
    const selectedTeamId = event.target.value;
    const selectedTeam = userTeams.find(team => team.id === parseInt(selectedTeamId));
    setSelectedTeam(selectedTeam);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!selectedTeam) {
        console.error('No team selected');
        return;
      }
      const response = await axios.post(`http://localhost:8000/teamindivision/join_division/${divisionName}/${selectedTeam.id}/`);
      console.log('Join division response:', response.data);
      toast.success("Successfully joined")
      navigate(`/division/${divisionName}`)
      // Handle success or display a message to the user
    } catch (error) {
      console.error('Error joining division:', error);
      // Handle errors
    }
  };

  return (
    <div>
      <h1>{userInfo.first_name} Teams</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="teamSelect">Select a Team to Join Division: <br/></label>
        <select id="teamSelect" value={selectedTeam ? selectedTeam.id : ''} onChange={handleTeamSelect}>
          <option value="">Select a Team</option>
          {userTeams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <br/>
        <button className="btn btn-primary">Join Division</button>
      </form>
      <br/>
      <Link to="/createteam">
        <button className="btn btn-primary">Create Team</button>
      </Link>
    </div>
  );
};

export default JoinDivisionPage;

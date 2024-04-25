import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import { Button, Label, TextInput, Select, TableRow, TableCell } from 'flowbite-react'; // Import TableRow and TableCell components
import CheckDivisionAdmin from '../components/CheckDivisionAdmin';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DivisionSettings = () => {
  const [divisionDetails, setDivisionDetails] = useState({});
  const [teams, setTeams] = useState([]);
  const { divisionName } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        const teamsindivisionResponse = await axios.get(`http://localhost:8000/teamindivision/${divisionName}/`);
        setTeams(teamsindivisionResponse.data);
      } catch (error) {
        console.error('Error fetching division details:', error);
      }
    };

    fetchDivisionDetails();
    dispatch(getUserInfo());
  }, []);

  const handleRemoveTeam = async (team_name) => {
    try {
      await axios.delete(`http://localhost:8000/teamindivision/leave_division/${divisionName}/${team_name}`);
      toast.success('Team removed successfully');
      // Refetch division details after removing the team
      const teamsindivisionResponse = await axios.get(`http://localhost:8000/teamindivision/${divisionName}/`);
      setTeams(teamsindivisionResponse.data);
    } catch (error) {
      console.error('Error removing team:', error);
      toast.error('Error removing team');
    }
  };

  return (
    <div>
      <CheckDivisionAdmin divisionName={divisionName} userId={userInfo.id} />
      <h1>{divisionDetails.name} Participants</h1>
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Position</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Ratio</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.team}>
              <td>{team.team_name}</td>
              <td>{team.position}</td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
              <td>{team.ratio}</td>
              <td>
                <Button onClick={() => handleRemoveTeam(team.team_name)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DivisionSettings;

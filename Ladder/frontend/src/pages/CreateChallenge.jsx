import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice';
import { useParams } from 'react-router-dom';
import Calendar from './Calendar';

const CreateChallenge = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { name, team1, team2 } = useParams();
  const [divisionDetails, setDivisionDetails] = useState([]);
  const [teamDetails, setTeamDetails] = useState({});
  const [matchID, setMatchID] = useState(null);
  const [challengeCreated, setChallengeCreated] = useState(false);

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        const divisionResponse = await axios.get(`http://localhost:8000/division/${name}`);
        console.log('Teams in Division API response:', divisionResponse.data);
        setDivisionDetails(divisionResponse.data);
      } catch (error) {
        console.error('Error fetching division details:', error);
      }
    };

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/team/${team2}/`);
        console.log('Team Details API response:', response.data);
        setTeamDetails(response.data);
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    fetchDivisionDetails();
    fetchTeamDetails();
    dispatch(getUserInfo());
  }, [name, dispatch]);

  const handleCreateChallenge = async () => {
    try {
      const challengeResponse = await axios.post('http://localhost:8000/MatchTable/', {
        team1Name: team1,
        team2Name: team2,
        division: name,
        ref: divisionDetails.admin,
        countDown: new Date().toISOString().split('T')[0],
        status: 's',
      });
      console.log(challengeResponse.data.id)
      console.log('Challenge created successfully');
      setMatchID(challengeResponse.data.id);
      setChallengeCreated(true);
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  return (
    <div>
      <h1 className="main__title">Create Challenge</h1>
      <div>
        <h1>Challenge {teamDetails.name}? <br/> Details</h1>
        <div>
          <h2>Name: {teamDetails.name}</h2>
          <p>Captain: {teamDetails.captain_username}</p>
          <p>Members: <br /></p>
          <ul>
            {teamDetails.member_usernames && teamDetails.member_usernames.map(username => (
              <li key={username}>{username}</li>
            ))}
          </ul>
        </div>

        <button className='btn btn-primary' onClick={handleCreateChallenge}>Challenge</button>
        <br/>
        <button className='btn btn-red' onClick={handleCreateChallenge}>Cancel</button>


        {challengeCreated && <Calendar matchID={matchID} />}
      </div>
    </div>
  );
};

export default CreateChallenge;

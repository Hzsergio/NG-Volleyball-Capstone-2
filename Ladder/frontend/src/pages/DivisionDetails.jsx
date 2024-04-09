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
  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility
  const { name } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function

  const openModal = () => setShowModal(true); // Function to open the modal
  const closeModal = () => setShowModal(false); // Function to close the modal

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
      <h1>Teams in {name} Division</h1>
      <div className="division-container">
        <ul>
        {divisionDetails.map((teamInfo, index) => (
  <li key={index} className="division-box" style={{ color: 'var(--color-white)' }}>
    <strong>Team Name:</strong> <br/> {teamInfo.team_name} <br/> <strong>Position:</strong> {teamInfo.position}
    <br/>
    {/* Check if the current team ID is not equal to the ID of the team being rendered */}
    {currentTeam !== teamInfo.team&& (
      <Link
      to={`/challenge/${name}/${currentTeam}/${teamInfo.team}`}
      onClick={() => {
        console.log("Team 1:", currentTeam);
        console.log("Team 2:", teamInfo.team);
      }}
    >
      <button className="btn btn-secondary">Challenge</button>
    </Link>
    )}
  </li>
))}

        </ul>
      </div>
<<<<<<< HEAD
      <CustomizedTables/>

=======
      
>>>>>>> MileStone1
      {/* Use the CheckUserCaptain component */}
      <CheckUserCaptain userId={userInfo.id} divisionName={name} />
      
      <CheckDivisionAdmin divisionName={name} userId={userInfo.id} />

      <Link to={`/joindivision/${name}`}>
        <button className="btn btn-primary">Join Division</button>
      </Link>
<<<<<<< HEAD
=======

      {/* Modal component */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Challenge Modal</h2>
            <p>This is the challenge modal content.</p>
            <button className="btn btn-secondary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
>>>>>>> MileStone1
    </div>
  );
};

export default DivisionDetailsPage;

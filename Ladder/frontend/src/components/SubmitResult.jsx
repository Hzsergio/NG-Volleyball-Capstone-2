import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'


function SubmitResults({ setOpenModal, selectedMatch }) {
  const [teamScores, setTeamScores] = useState({
    team1: '',
    team2: ''
  });

  // Function to handle score input changes
  const handleScoreChange = (team, score) => {
    setTeamScores(prevState => ({
      ...prevState,
      [team]: score
    }));
  };

  // Function to submit the results
  const handleSubmitResults = async () => {
    try {
      // Make sure both scores are filled out
      if (!teamScores.team1 || !teamScores.team2) {
        alert('Please enter scores for both teams.');
        return;
      }

      // Make the POST request to submit the results
      const response = await axios.post(`http://localhost:8000/MatchTable/submit-results/${selectedMatch.id}/`, {
        team1Wins: parseInt(teamScores.team1),
        team2Wins: parseInt(teamScores.team2),
        status: 'f'
      });

      // Log the response
      console.log('Results submitted:', response.data);
      toast.success("Result Submitted")

      // Close the modal
      setOpenModal(false);
      window.location.reload();

    } catch (error) {
      console.error('Error submitting results:', error);
      // Handle errors
    }
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={() => setOpenModal(false)}>X</button>
        </div>
        <div className="title">
          <h1>Report Score</h1>
        </div>
 
        <div className="table-wrapper">
          <table className="alt">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedMatch.team1_name}</td>
                <td><input type="number" value={teamScores.team1} onChange={e => handleScoreChange('team1', e.target.value)} placeholder="Enter score" /></td>
              </tr>
              <tr>
                <td>{selectedMatch.team2_name}</td>
                <td><input type="number" value={teamScores.team2} onChange={e => handleScoreChange('team2', e.target.value)} placeholder="Enter score" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer">
          <button onClick={() => setOpenModal(false)} id="cancelBtn">Cancel</button>
          <button onClick={handleSubmitResults}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default SubmitResults;

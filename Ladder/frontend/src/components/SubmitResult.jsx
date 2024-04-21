import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";

function SubmitResults({ selectedMatch }) {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [teamScores, setTeamScores] = useState({
    team1: selectedMatch.team1Wins|| '',
    team2: selectedMatch.team2Wins || ''
  });



  // Function to handle score input changes
  const handleScoreChange = (team, score) => {

    setTeamScores(prevState => ({
      ...prevState,
      [team]: score
    }));
  };

  useEffect(() => {
    dispatch(getUserInfo());
    console.log("Selected match: ", selectedMatch)
  }, []);
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
      window.location.reload();

    } catch (error) {
      console.error('Error submitting results:', error);
      // Handle errors
    }
  };

  return (
    <div >
      <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_1').showModal()}>Report Score</button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Report Score</h3>
          <div >
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

          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button className="btn btn-primary" onClick={handleSubmitResults}>Submit</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SubmitResults;

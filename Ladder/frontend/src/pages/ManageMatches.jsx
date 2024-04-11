import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice"; // Import the getUserInfo action
import { useParams } from "react-router-dom";
import ModalTest from "../components/ModalTest"

const ManageMatches = () => {
  const [divisionMatches, setDivisionMatches] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function
  const { divisionName } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDivisionMatches = async () => {
      try {
        if (userInfo) {
          // Check if userInfo is available
          const response = await axios.get(
            `http://localhost:8000/MatchTable/division-matches/${divisionName}`
          );
          console.log("Division Matches Response:", response.data);
          const challengesWithSchedule = await Promise.all(
            response.data.map(async (challenge) => {
              // Fetch CourtSchedule details for each challenge
              const scheduleResponse = await axios.get(
                `http://localhost:8000/CourtSchedule/match-court/${challenge.id}/`
              );
              return { ...challenge, courtSchedules: scheduleResponse.data };
            })
          );

          setDivisionMatches(challengesWithSchedule);
          console.log("TEST", divisionMatches);
        }
      } catch (error) {
        console.error("Error fetching division matches:", error);
        // Handle errors
      }
    };

    fetchDivisionMatches();
  }, [userInfo]); // Only run the effect when userInfo changes

  useEffect(() => {
    // Fetch user information when the component mounts
    dispatch(getUserInfo());
  }, []); // Only run the effect once when the component mounts

  return (

    <div className="reportResultsBox">
    <h1 className="main__title"> {divisionName} Matches </h1>

      <div className="division-container">
        {divisionMatches.map((challenge) => (
          <div key={challenge.id} className="team-box">
            <p>
              {challenge.team1_name} vs. {challenge.team2_name}
            </p>
            <p>
              Status:{" "}
              {challenge.status === "s"
                ? "Scheduled"
                : challenge.status === "i"
                ? "In Progress"
                : challenge.status}
            </p>
            {/* Display schedule details if available */}
            {challenge.courtSchedules && (
              <div>
                <p>
                  Location: <br /> {challenge.courtSchedules.location}
                </p>
                <p>
                  Start Time: <br /> {challenge.courtSchedules.startTime}
                </p>
                <p>
                  Match Detail: <br /> {challenge.courtSchedules.matchDetail}
                </p>
              </div>
            )}
            {/* Conditionally render the "Report Score" button based on the match status */}
            {challenge.status === "i" && (
              <button className="btn btn-primary"         
              onClick={() => {
                setModalOpen(true);
              }}>Report Score</button>
              

            )}

          </div>
        ))}
      </div>
      {modalOpen && <ModalTest setOpenModal={setModalOpen} />}
    </div>
  );
};

export default ManageMatches;

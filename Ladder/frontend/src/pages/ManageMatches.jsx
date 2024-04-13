import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice"; // Import the getUserInfo action
import { useParams } from "react-router-dom";
import SubmitResult from "../components/SubmitResult";
import CheckDivisionAdmin from '../components/CheckDivisionAdmin';


const ManageMatches = () => {
  const [divisionMatches, setDivisionMatches] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function
  const { divisionName } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null); // State to hold the selected match

  useEffect(() => {
    const fetchDivisionMatches = async () => {
      try {
        if (userInfo) {
          const response = await axios.get(
            `http://localhost:8000/MatchTable/division-matches/${divisionName}`
          );
          const challengesWithSchedule = await Promise.all(
            response.data.map(async (challenge) => {
              const scheduleResponse = await axios.get(
                `http://localhost:8000/CourtSchedule/match-court/${challenge.id}/`
              );
              return { ...challenge, courtSchedules: scheduleResponse.data };
            })
          );

          setDivisionMatches(challengesWithSchedule);
        }
      } catch (error) {
        console.error("Error fetching division matches:", error);
      }
    };

    fetchDivisionMatches();
  }, [userInfo]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  const handleReportScoreClick = (match) => {
    setSelectedMatch(match);
    setModalOpen(true);
  };
      <CheckDivisionAdmin divisionName={divisionName} userId={userInfo.id} />
  return (
    <div >
      <CheckDivisionAdmin divisionName={divisionName} userId={userInfo.id} />
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
                :challenge.status === "f"
                ? "Finished"
                : challenge.status}
            </p>
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
            {challenge.status === "i" && (
              <button
                className="btn btn-primary"
                onClick={() => handleReportScoreClick(challenge)} // Pass the challenge as an argument
              >
                Report Score
              </button>
            )}
          </div>
        ))}
      </div>
      {modalOpen && <SubmitResult setOpenModal={setModalOpen} selectedMatch={selectedMatch} />} 
      </div>
    </div>
  );
};

export default ManageMatches;

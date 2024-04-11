import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";

const UserChallenges = (isAdmin) => {
  const [userChallenges, setUserChallenges] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserChallenges = async () => {
      try {
        if (userInfo) {
          const response = await axios.get(
            `http://localhost:8000/MatchTable/user_challenges/${userInfo.id}/`
          );
          console.log("User Challenges:", response.data);
          const challengesWithSchedule = await Promise.all(
            response.data.map(async (challenge) => {
              // Fetch CourtSchedule details for each challenge
              const scheduleResponse = await axios.get(
                `http://localhost:8000/CourtSchedule/match-court/${challenge.id}/`
              );
              return { ...challenge, courtSchedules: scheduleResponse.data };
            })
          );
          setUserChallenges(challengesWithSchedule);
        }
      } catch (error) {
        console.error("Error fetching user challenges:", error);
      }
    };

    fetchUserChallenges();
  }, [userInfo]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  return (
    <div>
      <h1 className="main__title">
        {userInfo && userInfo.first_name}'s Challenges
      </h1>
      <div className="division-container">
        {userChallenges.map((challenge) => (
          <div key={challenge.id} className="team-box">
            {/* <p>Match ID: {challenge.id}</p> */}
            <p>Division: {challenge.division}</p>
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


                <button className="btn btn-secondary">Accept</button>
                <button className="btn btn-secondary">Reschedule</button>

              <button className="btn btn-primary">Report Score</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserChallenges;

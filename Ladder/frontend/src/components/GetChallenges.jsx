import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import EditSchedule from "./EditSchedule";
import ReportResult from "./ReportResult";

const UserChallenges = () => {
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

  const handleAccept = async (challengeId) => {
    // Ask for confirmation
    const confirmAccept = window.confirm("Are you sure you want to accept this challenge?");
    if (!confirmAccept) return; // If user cancels, do nothing

    try {
      await axios.put(
        `http://localhost:8000/MatchTable/${challengeId}/`,
        { status: "i" }
      );
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating match status:", error);
    }
  };


  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="nameofpage">My Challenges </h3>
      </div>
      <div className="mt-6">
        {userChallenges.reduce((chunks, challenge, index) => {
          if (index % 3 === 0) chunks.push([]);
          chunks[chunks.length - 1].push(challenge);
          return chunks;
        }, []).map((chunk, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {chunk.map(challenge => (
              <div key={challenge.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Challenge ID: {challenge.id}</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
                      <div className="px-4 py-2 sm:w-1/3">
                        <dt className="text-sm font-medium text-gray-500">Division</dt>
                        <dd className="mt-1 text-sm text-gray-900">{challenge.division}</dd>
                      </div>
                      <div className="px-4 py-2 sm:w-1/3">
                        <dt className="text-sm font-medium text-gray-500">Teams</dt>
                        <dd className="mt-1 text-sm text-gray-900">{challenge.team1_name} vs. {challenge.team2_name}</dd>
                      </div>
                      <div className="px-4 py-2 sm:w-1/3">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">{challenge.status === "s" ? "Scheduled" : challenge.status === "i" ? "In Progress" : challenge.status === "f" ? "Finished" : challenge.status === "r" ? "Score Reported" : challenge.status}</dd>
                      </div>
                    </div>
                    {challenge.courtSchedules && (
                      <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
                        <div className="px-4 py-2 sm:w-1/3">
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="mt-1 text-sm text-gray-900">{challenge.courtSchedules.location}</dd>
                        </div>
                        <div className="px-4 py-2 sm:w-1/3">
                          <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                          <dd className="mt-1 text-sm text-gray-900">{challenge.courtSchedules.startTime}</dd>
                        </div>
                        <div className="px-4 py-2 sm:w-1/3">
                          <dt className="text-sm font-medium text-gray-500">Match Detail</dt>
                          <dd className="mt-1 text-sm text-gray-900">{challenge.courtSchedules.matchDetail}</dd>
                        </div>
                      </div>
                    )}
                    <div className="px-4 py-2 sm:w-full">
                      <dt className="text-sm font-medium text-gray-500">Actions</dt>
                      <div className="inline-flex rounded-lg shadow-sm">
                        {challenge.status === "s" && (
                          <button type="button" onClick={() => handleAccept(challenge.id)} className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-blue-100 text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 sm:p-5">
                            Accept
                          </button>
                        )}
                        {challenge.status === "i" && (
                          <EditSchedule scheduleID={challenge.courtSchedules.id} />
                        )}

                        {/* Render ReportResult if challenge status is "i" or "r" */}
                        {(challenge.status === "i" || challenge.status === "r") && (
                          <ReportResult selectedMatch={challenge} />
                        )}
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserChallenges;

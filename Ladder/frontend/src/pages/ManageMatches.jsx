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

  return (
    <div >
      <CheckDivisionAdmin divisionName={divisionName} userId={userInfo.id} />

      <h1 className="main__title"> {divisionName} Matches </h1>


      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {divisionMatches.map((challenge) => (
          <div key={challenge.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Match ID: {challenge.id}</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
                  <div className="px-4 py-2 sm:w-1/3">
                    <dt className="text-sm font-medium text-gray-500">Teams</dt>
                    <dd className="mt-1 text-sm text-gray-900">{challenge.team1_name} vs. {challenge.team2_name}</dd>
                  </div>
                  <div className="px-4 py-2 sm:w-1/3">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{challenge.status === "s" ? "Scheduled" : challenge.status === "i" ? "In Progress" : challenge.status === "f" ? "Finished" : challenge.status}</dd>
                  </div>
                  <div className="px-4 py-2 sm:w-1/3">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{challenge.courtSchedules && challenge.courtSchedules.location}</dd>
                  </div>
                </div>
                {challenge.courtSchedules && (
                  <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
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
                  {challenge.status === "i" && (
                    <button className="btn btn-primary" onClick={() => handleReportScoreClick(challenge)}>Report Score</button>
                  )}
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && <SubmitResult setOpenModal={setModalOpen} selectedMatch={selectedMatch} />}

    </div>
  );
};

export default ManageMatches;

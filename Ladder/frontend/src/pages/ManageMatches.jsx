import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import { useParams } from "react-router-dom";
import SubmitResult from "../components/SubmitResult"; // Import the SubmitResults component
import CheckDivisionAdmin from '../components/CheckDivisionAdmin';

const ManageMatches = () => {
  const [divisionMatches, setDivisionMatches] = useState([]);
  const [searchTeam, setSearchTeam] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { divisionName } = useParams();

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
  }, [userInfo, divisionName]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  const handleSearch = () => {
    // Filter divisionMatches based on search criteria
    const filteredMatches = divisionMatches.filter(challenge => {
      const teamMatch = challenge.team1_name.toLowerCase().includes(searchTeam.toLowerCase()) ||
        challenge.team2_name.toLowerCase().includes(searchTeam.toLowerCase());
      const statusMatch = challenge.status === searchStatus || searchStatus === '';
      return teamMatch && statusMatch;
    });
    setDivisionMatches(filteredMatches);
  };

  const clearFilters = async () => {
    setSearchTeam('');
    setSearchStatus('');
    // Refetch division matches without filters
    await fetchDivisionMatches();
  };

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

  return (
    <div>
      <CheckDivisionAdmin divisionName={divisionName} userId={userInfo.id} />
      <h1 className="main__title"> {divisionName} Matches </h1>

      <div className="search-container flex justify-center items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              placeholder="Search by team"
              value={searchTeam}
              onChange={(e) => setSearchTeam(e.target.value)}
              className="flex-grow" // Ensures the input takes up remaining space
            />
            {/* SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70 ml-2">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>

          <select className="select select-bordered max-w-xs"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="s">Scheduled</option>
            <option value="i">In Progress</option>
            <option value="f">Finished</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <div >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {divisionMatches.map((challenge) => (
            <div key={challenge.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Challenge ID: {challenge.id}</h3>
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
                      {challenge.status === "i" && (
                        <SubmitResult selectedMatch={challenge} />
                      )}
                      <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 sm:p-5">
                        Edit Score
                      </button>
                      <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-red-100 text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 sm:p-5">
                        Change Status
                      </button>

                    </div>

                  </div>


                </dl>

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMatches;

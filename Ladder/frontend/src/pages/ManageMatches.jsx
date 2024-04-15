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

  const clearFilters = () => {
    setSearchTeam('');
    setSearchStatus('');
    // Refetch division matches without filters
    fetchDivisionMatches();
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
      <div className="reportResultsBox">
        <h1 className="main__title"> {divisionName} Matches </h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by team"
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="s">Scheduled</option>
            <option value="i">In Progress</option>
            <option value="f">Finished</option>
          </select>
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
        </div>
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
                    : challenge.status === "f"
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
                <SubmitResult selectedMatch={challenge} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMatches;

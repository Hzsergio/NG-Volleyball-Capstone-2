import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function CheckDivisionAdmin({ divisionName, userId }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState("");
  const [divisionDetails, setDivisionDetails] = useState({});

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/teamindivision/check-admin/${divisionName}/${userId}/`
        );
        setIsAdmin(response.data.is_admin);
        setError("");
      } catch (error) {
        setError("Error checking admin status");
        setIsAdmin(null);
      }
    };

    fetchAdminStatus();
    fetchDivisionDetails();
  }, [divisionName, userId]);

  const fetchDivisionDetails = async () => {
    try {
      const divisionResponse = await axios.get(
        `http://localhost:8000/division/${divisionName}/`
      );
      setDivisionDetails(divisionResponse.data);
    } catch (error) {
      console.error("Error fetching division details:", error);
    }

  };

  return (
    <div>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Hello
          </label>
          <select
            id="tabs"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Standings</option>
            {isAdmin && <option>Assign Positions</option>}
            <option>Settings</option>
            {isAdmin && <option>Manage Matches</option>}
          </select>
        </div>
        <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        {divisionDetails.tournament_type === "group" && (
        <li className="w-full focus-within:z-10">
          <Link
            to={`/division/${divisionName}/ladder`}
            className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Groups
          </Link>
        </li>
      )}
          <li className="w-full focus-within:z-10">
            <Link
              to={`/division/${divisionName}`}
              className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Standings
            </Link>
          </li>
          {isAdmin && (
            <li className="w-full focus-within:z-10">
              <Link
                to={`/division/manageteams/${divisionName}`}
                className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Manage Participants
              </Link>
            </li>
          )}
          {isAdmin && (
            <li className="w-full focus-within:z-10">
              <Link
                to={`/managematches/${divisionName}`}
                className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Manage Matches
              </Link>
            </li>
          )}
          {isAdmin && (
            <li className="w-full focus-within:z-10">
              <Link
                to={`/division/settings/${divisionName}`}
                className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Settings
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CheckDivisionAdmin;

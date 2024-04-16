import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


function CheckDivisionAdmin({ divisionName, userId }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState("");

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
  }, [divisionName, userId]);

  const handleAssignPositions = async () => {
    try {
      await axios.post(
        `http://localhost:8000/teamindivision/assign-positions/${divisionName}/`
      );
      setError("");
      // Optionally, you can perform additional actions after successful assignment
      console.log("Positions assigned successfully.");
      toast.success("Started Division");
    } catch (error) {
      setError("Error assigning positions");
    }
  };

  return (
    <div>
<div>
  <div className="sm:hidden">
    <label htmlFor="tabs" className="sr-only">Select your country</label>
    <select id="tabs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option>Standings</option>
      {isAdmin && <option>Assign Positions</option>}
      <option>Settings</option>
      {isAdmin && <option>Manage Matches</option>}
    </select>
  </div>
  <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
    <li className="w-full focus-within:z-10">
    <Link to={`/division/${divisionName}`} className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Standings</Link>
    </li>
    {isAdmin && (
      <li className="w-full focus-within:z-10">
        <a href="#" onClick={handleAssignPositions} className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Assign Positions</a>
      </li>
    )}
    <li className="w-full focus-within:z-10">
      <a href="#" className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Settings</a>
    </li>
    {isAdmin && (
      <li className="w-full focus-within:z-10">
        <Link to={`/managematches/${divisionName}`} className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Manage Matches</Link>
      </li>
    )}
  </ul>

</div>

    </div>
  );
}

export default CheckDivisionAdmin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import GetChallenges from '../components/GetChallenges';


const Dashboard = () => {
  const [userTeams, setUserTeams] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        if (userInfo) { // Check if userInfo is available
          const response = await axios.get(`http://localhost:8000/team/user_teams/${userInfo.id}/`);
          console.log('Response:', response.data);
          setUserTeams(response.data);
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
        // Handle errors
      }
    };
    console.log(userInfo)

    fetchUserTeams();

  }, [userInfo]); // Only run the effect when userInfo changes

  useEffect(() => {
    // Fetch user information when the component mounts
    dispatch(getUserInfo());
    console.log("Current User", userInfo.id)
  }, []); // Only run the effect once when the component mounts

  return (
    <div>
      <h1 className='nameofpage'> My Teams</h1> {/* Use userInfo && userInfo.first_name to avoid rendering before userInfo is available */}


      <div className="container flex">
        <div className="flex flex-wrap">
          {userTeams.map((team) => (
            <Link to={`/team/${team.id}`} key={team.id} className="block">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 m-4">
                <div className="p-4">
                  <img className="w-20 h-20 rounded" src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80" alt="Large avatar" />
                </div>
                <div className="flex flex-col justify-between flex-grow p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{team.name}</h5>
                  <div className="flex items-center mb-3">
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                    <p className="ml-2 font-normal text-gray-700 dark:text-gray-400">Captain: {team.captain_username}</p>
                  </div>
                  <Link to={`/team/${team.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    View Team
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link to="/createteam">
        <button className="btn btn-primary justify-center " >Create Team</button>
      </Link>

      <hr
        class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-500" />

      <GetChallenges isAdmin={false} />

    </div>
  );
};

export default Dashboard;

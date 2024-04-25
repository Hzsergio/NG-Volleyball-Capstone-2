import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import GetChallenges from '../components/GetChallenges';
import GetTeams from '../components/GetTeams';
import GetUserDivisions from '../components/GetUserDivisions';



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
      <GetChallenges isAdmin={false} />

      <hr
        class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-500" />
      <h1 className='nameofpage'> My Divisions</h1> 
      <GetUserDivisions/>
      <hr
        class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-500" />
      <h1 className='nameofpage'> My Teams</h1> 
      <GetTeams  userInfo={userInfo}/>
      <div className='flex justify-center py-5'>
      <Link to="/createteam">
        <button className="btn btn-primary justify-center " >Create Team</button>
      </Link>
</div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action

const TeamDetailsPage = () => {
  const [teamDetails, setTeamDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch(); // Get the dispatch function



  useEffect(() => {
    const fetchTeamDetails = async () => {
      setLoading(true);
      try {
        console.log('Team ID:', id);
        const response = await axios.get(`http://localhost:8000/team/${id}/`);
        console.log('Team Details API response:', response.data);
        setTeamDetails(response.data);
      } catch (error) {
        console.error('Error fetching team details:', error);
        setError('Error fetching team details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    dispatch(getUserInfo());
    fetchTeamDetails();
  }, [id]);

  const handleJoinTeam = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/team/join_team/${id}/${userInfo.id}/`);
      console.log('Join Team API response:', response.data);
      // Update team details after joining
      setTeamDetails(response.data);
      toast.success("Successfully joined")

      navigate("/dashboard")
    } catch (error) {
      console.error('Error joining team:', error);
      setError('Error joining team. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div class="flex justify-center mt-4">
      <h1 className='nameofpage'>{teamDetails.name} Details</h1>

      </div>


      <div class="max-w-2xl mx-auto ">
        <div class="p-4 max-w-md bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">{teamDetails.name}</h3>
          </div>
          <div class="flow-root">
            <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
              <li class="py-3 sm:py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img class="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Captain image" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Captain: {teamDetails.captain_username}
                    </p>
                  </div>
                </div>
              </li>
              {teamDetails.member_usernames && teamDetails.member_usernames.map(username => (
                <li key={username} class="py-3 sm:py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <img class="w-14 h-14 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Member image" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Member: {username}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button className="btn btn-primary" onClick={handleJoinTeam}>Join Team</button>

      </div>





    </div>
  );
};

export default TeamDetailsPage;

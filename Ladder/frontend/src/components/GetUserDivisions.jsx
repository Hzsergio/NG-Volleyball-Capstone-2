import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import { CiCalendar, CiUser } from 'react-icons/ci'; // Import the calendar icon


const GetUserDivisions = () => {
    const [userDivisions, setUserDivisions] = useState([]);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch(); // Get the dispatch function

    useEffect(() => {
        const fetchUserDivisions = async () => {
            try {
                if (userInfo) { // Check if userInfo is available
                    const response = await axios.get(`http://localhost:8000/teamindivision/user_divisions/${userInfo.id}/`);
                    setUserDivisions(response.data);
                }
            } catch (error) {
                console.error('Error fetching user teams:', error);
                // Handle errors
            }
        };

        fetchUserDivisions();

    }, [userInfo]); // Only run the effect when userInfo changes

    useEffect(() => {
        // Fetch user information when the component mounts
        dispatch(getUserInfo());
    }, []); // Only run the effect once when the component mounts

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {userDivisions.map((division, index) => (
                    <div key={division.name} className={`max-w-sm rounded overflow-hidden shadow-lg mb-4 ${index % 4 === 0 ? 'pl-4' : ''}`}>
                        <Link to={`/division/${division.name}`}>
                            <div className="division-card-wrapper">
                                <div className="division-card bg-white rounded overflow-hidden shadow-lg h-full">
                                    <img className="w-full" src="https://v1.tailwindcss.com/img/card-top.jpg" alt="" />
                                    <div className="px-6 py-4">
                                        <div className="font-bold text-xl mb-2">{division.name}</div>
                                        <div className="text-l mb-2">{division.category}</div>
                                        <div className="text-l mb-2">
                                            <CiUser className="inline-block mr-3" />
                                            Created by: {division.admin_username}
                                        </div>
                                        <div className="text-l mb-2">
                                            <CiCalendar className="inline-block mr-3" />
                                            {division.formatted_start_date} - {division.formatted_end_date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default GetUserDivisions;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CiCalendar, CiUser } from 'react-icons/ci'; // Import the calendar icon

const DivisionsPage = () => {
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/division/');
        console.log('Divisions API response:', response.data);
        setDivisions(response.data);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    fetchDivisions();
  }, []);

  return (
    <div>
      <h1 className="main__title">Divisions</h1>
      <div className="flex justify-center">
        <Link to="/createdivision">
          <button className="btn btn-primary">Create New Division</button>
        </Link>
      </div>

      <div style={{ transform: 'scale(0.9)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {divisions.map((division, index) => (
            <div key={division.name} className={`max-w-sm rounded overflow-hidden shadow-lg mb-4 ${index % 4 === 0 ? 'pl-4' : ''}`}>
              <Link to={`/division/${division.name}`}>
                <div className="division-card bg-white rounded overflow-hidden shadow-lg">
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
              </Link>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default DivisionsPage;

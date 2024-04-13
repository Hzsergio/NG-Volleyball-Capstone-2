import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      <h1 className="main__title" >Divisions</h1>



      <div style={{ transform: 'scale(0.9)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {divisions.map((division, index) => (
            <div key={division.name} className={`max-w-sm rounded overflow-hidden shadow-lg mb-4 ${index % 4 === 0 ? 'pl-4' : ''}`}>
              <Link to={`/division/${division.name}`} >
                <div className="max-w-sm rounded overflow-hidden shadow-lg mb-4">
                  <img className="w-full" src="https://v1.tailwindcss.com/img/card-top.jpg" alt="" />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{division.name}</div>
                    <div className="flex items-center mb-3">
                      <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                      </div>

                      <p className="text-gray-700 text-base">
                        Created by: {division.admin_username}
                      </p>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>


      <Link to="/createdivision">
        <button className="btn btn-primary">Create Division</button>
      </Link>



    </div>
  );
};

export default DivisionsPage;

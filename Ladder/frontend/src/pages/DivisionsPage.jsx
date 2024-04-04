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
      <div className="division-container">
        {divisions.map((division) => (
          <div key={division.name} className="division-box">
            <Link to={`/division/${division.name}`} style={{ color: 'var(--color-white)' }}>
              <strong>{division.name}</strong> - Created by: {division.admin_email}
            </Link>
          </div>
        ))}
      </div>

    <Link to="/createdivision">
      <button className="btn btn-primary">Create Division</button>
    </Link>
    </div>
  );
};

export default DivisionsPage;

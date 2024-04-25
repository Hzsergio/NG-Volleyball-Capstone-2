import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import { Card } from "flowbite-react";
import { Badge } from "flowbite-react";


export default function GroupTable() {
  const { divisionName } = useParams();
  const [divisionDetails, setDivisionDetails] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        const divisionResponse = await axios.get(
          `http://localhost:8000/teamindivision/${divisionName}/`
        );
        console.log("Teams in Division API response:", divisionResponse.data);
        setDivisionDetails(divisionResponse.data);
      } catch (error) {
        console.error("Error fetching division details:", error);
      }
    };

    fetchDivisionDetails();
    dispatch(getUserInfo());
  }, [divisionName, userInfo.id]);

  // Organize objects into lists based on position number
  const organizeByPosition = () => {
    const organized = {};
    divisionDetails.forEach((team) => {
      const position = team.position;
      if (!organized[position]) {
        organized[position] = [];
      }
      organized[position].push(team);
    });
    return organized;
  };

  const positions = organizeByPosition();
  const outerCardStyle = {
    backgroundColor: "#368EB4", 
    border: "1px solid #d1d5db", 
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "1rem",
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">{divisionName} Levels</h2>
      <div className="w-full max-w-md">
        {Object.entries(positions).map(([position, teams]) => (
          <Card key={position} className="max-w-sm mb-4" style={outerCardStyle}>
            <Badge color="info" size="sm">Level {position}</Badge>
            {teams.map((team, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
                <h6 className="text-lg font-medium">{team.team_name}</h6>
              </Card>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

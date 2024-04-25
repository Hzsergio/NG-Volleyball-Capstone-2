import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import { Card } from "flowbite-react";
import { Badge } from "flowbite-react";


export default function GroupTable() {
  const { name } = useParams();
  const [divisionDetails, setDivisionDetails] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        const teamsResponse = await axios.get(
          `http://localhost:8000/teamindivision/${name}/`
        );
        console.log("Teams in Division API response:", teamsResponse.data);
        setDivisionDetails(teamsResponse.data);
      } catch (error) {
        console.error("Error fetching division details:", error);
      }
    };

    fetchDivisionDetails();
    dispatch(getUserInfo());
  }, [name, userInfo.id]);

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
    backgroundColor: "#368EB4", // Change to the desired color
    border: "1px solid #d1d5db", // Change to the desired border color
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "1rem",
  };
  // Render lists for each position number inside a Card component
  return (
    <div>
      {Object.entries(positions).map(([position, teams]) => (
        <Card key={position} className="max-w-sm mb-4 " style={outerCardStyle} >
          <Badge color="info" size="sm">Level {position}</Badge>
          {teams.map((team, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
              <h6 className="text-lg font-medium">{team.team_name}</h6>
            </Card>
          ))}
        </Card>
      ))}
    </div>
  );
}

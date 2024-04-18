import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice"; // Import the getUserInfo action
import CheckUserCaptain from "../components/CheckUserCaptain"; // Import the CheckUserCaptain component
import CheckDivisionAdmin from "../components/CheckDivisionAdmin";
import CustomizedTables from "../components/ranktable";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";


const DivisionSettings = () => {
  const [divisionDetails, setDivisionDetails] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null); // State to store current team
  const { divisionName } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function
  const [isCaptain, setIsCaptain] = useState(false);

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        // Fetch teams in the division along with their positions
        const divisionResponse = await axios.get(
          `http://localhost:8000/division/${divisionName}/`
        );
        console.log("Division API response:", divisionResponse.data);
        setDivisionDetails(divisionResponse.data);
      } catch (error) {
        console.error("Error fetching division details:", error);
      }
    };


    fetchDivisionDetails();
    dispatch(getUserInfo());
  }, [divisionName, userInfo.id]);

  return (
    <div>
    <form className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name" value="Change Division Name" />
        </div>
        <TextInput id="name" type="email" placeholder={divisionDetails.name} required />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="category" value="Change Category" />
        </div>
        <TextInput id="category" type="text" placeholder={divisionDetails.category} required />
      </div>

      



      <Button type="submit">Submit</Button>
    </form>
    </div>
  );
};

export default DivisionSettings;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";

const CreateChallenge = ({ name, team1, team2 }) => {
  const [divisionDetails, setDivisionDetails] = useState([]);
  const [matchID, setMatchID] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    location: name.defaultLocation || "",
    description: "",
    match: "",
  });

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        const divisionResponse = await axios.get(
          `http://localhost:8000/division/${name}`
        );
        console.log("Teams in Division API response:", divisionResponse.data);
        setDivisionDetails(divisionResponse.data);
      } catch (error) {
        console.error("Error fetching division details:", error);
      }
    };

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/team/${team2}/`
        );
        console.log("Team Details API response:", response.data);
        setTeamDetails(response.data);
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchDivisionDetails();
    fetchTeamDetails();
    dispatch(getUserInfo());
  }, [name, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to submit the challenge?")) {
      handleCreateChallenge();
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeResponse = await axios.post(
        "http://localhost:8000/MatchTable/",
        {
          team1Name: team1,
          team2Name: team2,
          division: name,
          ref: divisionDetails.admin,
          countDown: new Date().toISOString().split("T")[0],
          status: "s",
        }
      );

      // Set matchID state
      setMatchID(challengeResponse.data.id);

      console.log("Challenge created successfully");
      console.log("Response data:", challengeResponse.data);
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  useEffect(() => {
    if (matchID !== "") {
      createSchedule();
    }
  }, [matchID]);

  const createSchedule = async () => {
    // Create CourtSchedule object with location and match detail

    try {
      // Sending challenge request to the server
      const scheduleResponse = await axios.post(
        "http://localhost:8000/CourtSchedule/",
        {
          match: matchID, // Use matchID passed as prop
          location: scheduleData.location || "", // Use location if provided, otherwise empty string
          startTime: new Date(scheduleData.date + " " + scheduleData.time), // Convert dayjs object to JavaScript Date object
          matchDetail: scheduleData.description || "", // Use match detail if provided, otherwise empty string
        }
      );
      console.log("Schedule Created Successfully");
      console.log(scheduleResponse.data);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }

    // Close the modal after creating schedule
    document.getElementById("my_modal_1").close();
    toast.success("Challenge Created Successfully");
    navigate("/dashboard"); // Optionally navigate to another page
  };

  const closeModal = () => {
    document.getElementById("my_modal_1").close();
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Challenge
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box" style={{ background: "#f4f4f4" }}>
          <h2>Schedule Math</h2>
          <div className="max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={scheduleData.date}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={scheduleData.time}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={divisionDetails.defaultLocation}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={scheduleData.description}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-32 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreateChallenge;

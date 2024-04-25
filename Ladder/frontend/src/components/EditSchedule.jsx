import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";

const EditSchedule = ({ scheduleID }) => {
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    location: "",
    matchDetail: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserInfo());
    console.log("ID?:", scheduleID)
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the schedule with the modified details
      await axios.put(`http://localhost:8000/CourtSchedule/${scheduleID}/`, {
        location: scheduleData.location || "", // Use location if provided, otherwise empty string
        startTime: new Date(scheduleData.date + " " + scheduleData.time), // Convert dayjs object to JavaScript Date object
        matchDetail: scheduleData.matchDetail || "", // Use match detail if provided, otherwise empty string
      });

      toast.success("Schedule updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
    }
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
        Edit Schedule
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box" style={{ background: "#f4f4f4" }}>
          <h2>Edit Schedule</h2>
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
                  value={scheduleData.location}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="matchDetail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="matchDetail"
                  name="matchDetail"
                  value={scheduleData.matchDetail}
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

export default EditSchedule;

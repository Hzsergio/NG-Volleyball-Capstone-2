import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice"; // Import the getUserInfo action
import { Button, Label, TextInput, Select } from "flowbite-react"; // Import Select component for dropdowns
import CheckDivisionAdmin from "../components/CheckDivisionAdmin";
import { toast } from "react-toastify";
import { useNavigate} from 'react-router-dom'


const DivisionSettings = () => {
  const [divisionDetails, setDivisionDetails] = useState({});
  const [updatedDivision, setUpdatedDivision] = useState({});
  const [error, setError] = useState(null);
  const { divisionName } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        const divisionResponse = await axios.get(
          `http://localhost:8000/division/${divisionName}/`
        );
        setDivisionDetails(divisionResponse.data);
        setUpdatedDivision(divisionResponse.data); // Initialize updated division details
      } catch (error) {
        console.error("Error fetching division details:", error);
      }
    };

    fetchDivisionDetails();
    dispatch(getUserInfo());
  }, [divisionName, userInfo.id, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDivision({ ...updatedDivision, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedResponse = await axios.put(
        `http://localhost:8000/division/${divisionName}/`,
        updatedDivision
      );
      console.log("Division updated:", updatedResponse.data);
      setDivisionDetails(updatedResponse.data);
      setUpdatedDivision(updatedResponse.data); // Reset updated division details
      setError(null);
    } catch (error) {
      console.error("Error updating division:", error);
      setError("Failed to update division. Please try again.");
    }
  };

  const handleAssignPositions = async () => {
    try {
      await axios.post(
        `http://localhost:8000/teamindivision/assign-positions/${divisionName}/`
      );
      setError("");
      console.log("Positions assigned successfully.");
      toast.success("Started Division");
      navigate(`/division/${divisionName}`)

    } catch (error) {
      setError("Error assigning positions");
    }
  };

  return (
    <div>
      <CheckDivisionAdmin divisionName={divisionName} userId={userInfo.id} />
      <div className="mx-auto px-4 text-center py-4">
        <h1>Division Settings</h1>
      </div>

      <form
        className="flex max-w-md flex-col gap-4 mx-auto"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="name" value="Change Division Name" />
          <TextInput
            id="name"
            type="text"
            name="name"
            value={updatedDivision.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="category" value="Change Category" />
          <TextInput
            id="category"
            type="text"
            name="category"
            value={updatedDivision.category || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description" value="Change Description" />
          <TextInput
            id="description"
            type="text"
            name="description"
            value={updatedDivision.description || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="tournament_type" value="Change Tournament Type" />
          <Select
            id="tournament_type"
            name="tournament_type"
            value={updatedDivision.tournament_type || ""}
            onChange={handleChange}
            required
          >
            <option value="single">Single</option>
            <option value="group">Group</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="start_date" value="Change Start Date" />
          <TextInput
            id="start_date"
            type="date"
            name="start_date"
            value={updatedDivision.start_date || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="end_date" value="Change End Date" />
          <TextInput
            id="end_date"
            type="date"
            name="end_date"
            value={updatedDivision.end_date || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="status" value="Change Status" />
          <Select
            id="status"
            name="status"
            value={updatedDivision.status || ""}
            onChange={handleChange}
            required
          >
            <option value="n">Not Started</option>
            <option value="i">In Progress</option>
            <option value="f">Finished</option>
            <option value="v">Void</option>
          </Select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit">Submit</Button>
      </form>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

      <div className="flex justify-between mx-auto max-w-md px-4 py-4">
    <Button color="success" onClick={handleAssignPositions} >Start Division</Button>
    <Button color="failure">Delete Division</Button>
    <Button>Fix Positions</Button>
  </div>
    </div>
  );
};

export default DivisionSettings;

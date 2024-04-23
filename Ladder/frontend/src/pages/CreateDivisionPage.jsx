import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserInfo } from "../features/auth/authSlice";
import { Button, Label, TextInput, Select } from "flowbite-react"; // Import Select component for dropdowns

const CreateDivisionPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    tournament_type: "single", // Default to single tournament type
    defaultLocation: "",
    start_date: "",
    end_date: "",
    // Add other fields here as needed
  });

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user information when the component mounts
    dispatch(getUserInfo());
  }, []); // Only run the effect once when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert start_date and end_date to YYYY-MM-DD format
    const formattedFormData = {
      ...formData,
      start_date: formatDate(formData.start_date),
      end_date: formatDate(formData.end_date),
      admin: userInfo.id,
    };

    axios
      .post(
        "http://localhost:8000/division/",
        formattedFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Division created successfully:", response.data);
        toast.success("Division created successfully");
        navigate(`/division/${formData.name}`);
      })
      .catch((error) => {
        console.error("Error creating division:", error);
        toast.error("Error creating division");
        // Handle errors
      });
  };

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h1 className="main__title">Create Division</h1>
      <form
        className="flex max-w-md flex-col gap-4 mx-auto"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="name" value="Division Name:" />
          <TextInput
            id="name"
            value={formData.name}
            placeholder="Division Name"
            required
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="category" value="Category:" />
          <TextInput
            id="category"
            value={formData.category}
            placeholder="Category"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="description" value="Description:" />
          <TextInput
            id="description"
            value={formData.description}
            placeholder="Description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="location" value="Default Location:" />
          <TextInput
            id="location"
            value={formData.defaultLocation}
            placeholder="Location"
            onChange={(e) =>
              setFormData({ ...formData, defaultLocation: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="tournamentType" value="Tournament Type:" />
          <Select
            id="tournamentType"
            value={formData.tournament_type}
            onChange={(e) =>
              setFormData({ ...formData, tournament_type: e.target.value })
            }
          >
            <option value="single">Single</option>
            <option value="group">Group</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate" value="Start Date:" />
          <TextInput
            type="date"
            id="startDate"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="endDate" value="End Date:" />
          <TextInput
            type="date"
            id="endDate"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
        </div>
        <Button type="submit" className="btn btn-primary">
          Create Division
        </Button>
      </form>
    </div>
  );
};

export default CreateDivisionPage;

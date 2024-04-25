import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserInfo } from "../features/auth/authSlice";
import { Button, Label, TextInput, Select } from "flowbite-react";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

const CreateDivisionPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to manage accordion panel open/close
  const [defaultAmount, setDefaultAmount] = useState(1);
  const [rows, setRows] = useState([{ level: "", teams: "" }]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    tournament_type: "single", // Default to single tournament type
    defaultLocation: "",
    challengeDistance: 3,
    start_date: "",
    end_date: "",
    status: "n"
  });

  const handleDefaultChange = (e) => {
    setDefaultAmount(parseInt(e.target.value));
  };

  const handleRowChange = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { level: "", teams: "" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const generateJSON = () => {
    const json = {};
    rows.forEach((row, index) => {
      if (row.level && row.teams) {
        json[row.level] = parseInt(row.teams);
      }
    });
    json["default"] = defaultAmount;
    return json;
  };
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
      group_settings: generateJSON(),
    };

    axios
      .post("http://localhost:8000/division/", formattedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Division created successfully:", response.data);
        toast.success("Division created successfully");
        navigate(`/division/${formData.name}`);
      })
      .catch((error) => {
        console.error("Error creating division:", error);
        toast.error("Error creating division");
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        <Accordion>
          <AccordionPanel>
            <AccordionTitle onClick={() => setIsOpen(!isOpen)}>
              Advanced Settings
            </AccordionTitle>
            <AccordionContent style={{ display: isOpen ? "block" : "none" }}>
            <div>
                    <Label
                      htmlFor="challengeDistance"
                      value="How many teams above you should you be able to challenge?:"
                    />
                    <TextInput
                      id="challengeDistance"
                      value={formData.challengeDistance}
                      type="number"
                      placeholder="3"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          challengeDistance: e.target.value,
                        })
                      }
                    />
                  </div>
              <div>
                <Label htmlFor="tournamentType" value="Tournament Type:" />
                <Select
                  id="tournamentType"
                  value={formData.tournament_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tournament_type: e.target.value,
                    })
                  }
                >
                  <option value="single">Single</option>
                  <option value="group">Group</option>
                </Select>
              </div>

              {formData.tournament_type === "group" && (
                <>


                  <div>
                    <Label>
                      Default Amount of teams that can be in a level?:
                      <TextInput
                        type="number"
                        value={defaultAmount}
                        onChange={handleDefaultChange}
                      />
                    </Label>
                    Customize Levels
                    {rows.map((row, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ marginRight: "10px" }}>
                          <input
                            type="text"
                            placeholder="Level"
                            value={row.level}
                            onChange={(e) =>
                              handleRowChange(index, "level", e.target.value)
                            }
                          />
                        </div>
                        <div style={{ marginRight: "10px" }}>
                          <input
                            type="number"
                            placeholder="Teams"
                            value={row.teams}
                            onChange={(e) =>
                              handleRowChange(index, "teams", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          color="failure"
                          onClick={() => handleRemoveRow(index)}
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      color="success"
                      onClick={handleAddRow}
                    >
                      +
                    </Button>
                    <pre>
                      {JSON.stringify(
                        { group_settings: generateJSON() },
                        null,
                        2
                      )}
                    </pre>{" "}
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <Button type="submit" className="btn btn-primary">
          Create Division
        </Button>
      </form>
    </div>
  );
};

export default CreateDivisionPage;

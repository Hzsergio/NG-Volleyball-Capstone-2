import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import { Link } from 'react-router-dom';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CenteredTableContainer = styled(TableContainer)({
  display: "flex",
  justifyContent: "center",
  maxWidth: "70%", // Adjust as needed
  margin: "0 auto", // Center horizontally
});

export default function CustomizedTables() {
  const { name } = useParams();
  const [divisionDetails, setDivisionDetails] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null); 
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Get the dispatch function


  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        // Fetch teams in the division along with their positions
        const teamsResponse = await axios.get(
          `http://localhost:8000/teamindivision/${name}/`
        );
        console.log("Teams in Division API response:", teamsResponse.data);
        setDivisionDetails(teamsResponse.data);
      } catch (error) {
        console.error("Error fetching division details:", error);
      }
    };
    const fetchCurrentTeam = async () => {
      try {
        // Fetch current team of the user
        const currentTeamResponse = await axios.get(`http://localhost:8000/teamindivision/current-team/${name}/${userInfo.id}/`);
        console.log('Current Team:', currentTeamResponse.data);
        setCurrentTeam(currentTeamResponse.data.team_id);
      } catch (error) {
        console.error('Error fetching current team:', error);
      }
    };

    fetchDivisionDetails();
    fetchCurrentTeam();
    dispatch(getUserInfo());
  }, [name, userInfo.id]);


  return (
    <CenteredTableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Team</StyledTableCell>
            <StyledTableCell align="right">Rank</StyledTableCell>
            <StyledTableCell align="right">Wins</StyledTableCell>
            <StyledTableCell align="right">Loses</StyledTableCell>
            <StyledTableCell align="right">Ratio</StyledTableCell>
            <StyledTableCell align="right">Challenge</StyledTableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {divisionDetails.map((team) => (
            <StyledTableRow key={team.id}>
              <StyledTableCell component="th" scope="row">
                {team.team_name}
              </StyledTableCell>
              <StyledTableCell align="right">{team.position}</StyledTableCell>
              <StyledTableCell align="right">{team.wins}</StyledTableCell>
              <StyledTableCell align="right">{team.losses}</StyledTableCell>
              <StyledTableCell align="right">{team.ratio}</StyledTableCell>
              <StyledTableCell align="right">
                {currentTeam !== team.team && (
                  <Link
                    to={`/challenge/${name}/${currentTeam}/${team.team}`}

                  >
                    <button className="btn btn-primary">Challenge</button>
                  </Link>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </CenteredTableContainer>
  );
}

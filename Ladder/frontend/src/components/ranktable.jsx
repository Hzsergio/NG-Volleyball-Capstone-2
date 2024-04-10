import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CenteredTableContainer = styled(TableContainer)({
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '70%', // Adjust as needed
  margin: '0 auto', // Center horizontally
});

export default function CustomizedTables() {
  const { name } = useParams();
  const [divisionDetails, setDivisionDetails] = useState([]);

  useEffect(() => {
    const fetchDivisionDetails = async () => {
      try {
        // Fetch teams in the division along with their positions
        const teamsResponse = await axios.get(`http://localhost:8000/teamindivision/${name}/`);
        console.log('Teams in Division API response:', teamsResponse.data);
        setDivisionDetails(teamsResponse.data);
      } catch (error) {
        console.error('Error fetching division details:', error);
      }
    };
    fetchDivisionDetails();
  }, [name]); // Add divisionName as a dependency to useEffect

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
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </CenteredTableContainer>
  );
}

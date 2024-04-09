import * as React from 'react';
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

function createData(name, rank, wins, loses, ratio) {
  return { name, rank, wins, loses, ratio };
}

const rows = [
  createData('Tigers', 1, 3, 0, 1.0),
  createData('Icees', 2, 2, 1, .66),
  createData('Falcons', 3, 2, 1, .66),
  createData('Cupcakes', 4, 1, 2, .33),
  createData('Vikings', 5, 0, 3, .00),
];

const CenteredTableContainer = styled(TableContainer)({
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '70%', // Adjust as needed
  margin: '0 auto', // Center horizontally
});

export default function CustomizedTables() {
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
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.rank}</StyledTableCell>
              <StyledTableCell align="right">{row.wins}</StyledTableCell>
              <StyledTableCell align="right">{row.loses}</StyledTableCell>
              <StyledTableCell align="right">{row.ratio}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </CenteredTableContainer>
  );
}
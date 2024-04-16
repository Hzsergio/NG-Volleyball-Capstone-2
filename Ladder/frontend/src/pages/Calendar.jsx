import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Calendar({ matchID }) {
  const [match, setMatch] = React.useState({ value: dayjs(), location: '', matchDetail: '' });
  const [openDialog, setOpenDialog] = React.useState(false);
  const [teamName, setTeamName] = React.useState("team_name"); // Example team name, replace with actual team name variable
  const navigate = useNavigate()

  const handleDateChange = (newValue) => {
    setMatch({ ...match, value: newValue });
  };

  const handleLocationChange = (event) => {
    setMatch({ ...match, location: event.target.value });
  };

  const handleMatchDetailChange = (event) => {
    setMatch({ ...match, matchDetail: event.target.value });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    // Create CourtSchedule object with location and match detail

    try {
    // Sending challenge request to the server
    const scheduleResponse = await axios.post('http://localhost:8000/CourtSchedule/', {
      match: matchID, // Use matchID passed as prop
      location: match.location || '', // Use location if provided, otherwise empty string
      startTime: match.value.toDate(), // Convert dayjs object to JavaScript Date object
      matchDetail: match.matchDetail || '', // Use match detail if provided, otherwise empty string
    });
    console.log('Schedule Created Successfully');
    console.log(scheduleResponse.data)
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
    
    alert('Challenge request sent!'); // Placeholder for success message
    setOpenDialog(false);
    toast.success("Challenge Created Successfully")
    navigate('/dashboard')
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const deleteChallenge = async () => {
    try {
    const deleteResponse = await axios.delete(`http://localhost:8000/MatchTable/${matchID}`);
    console.log('Delete response:', deleteResponse.data);
    navigate(`/division/${matchID}`)
    } catch (error){
      console.error('Error deleting details:', error);

    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <Stack spacing={3} >
        <Typography variant="h4" gutterBottom>
          Schedule
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <DateTimePicker
            renderInput={(props) => <TextField {...props} fullWidth />}
            label={`Match Date and Time`}
            value={match.value}
            onChange={handleDateChange}
          />
          <TextField
            label={`Location`}
            value={match.location}
            onChange={handleLocationChange}
          />
          <TextField
            label={`Match Details`}
            value={match.matchDetail}
            onChange={handleMatchDetailChange}
          />
        </Stack>
        <Button variant="outlined" onClick={handleOpenDialog} >Send Challenge Request</Button>
        <button className='btn btn-red' onClick={deleteChallenge}>Cancel</button>
      </Stack>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Challenge Request"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure this is the correct date and time for your challenge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

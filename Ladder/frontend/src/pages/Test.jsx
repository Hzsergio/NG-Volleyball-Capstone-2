import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice';



const Test = ({name, team1, team2}) => {
  const dispatch = useDispatch();

  return (
    <div>Test </div>
  );
}

export default Test;

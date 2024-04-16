import TestComponent from '../components/TestComponent'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action


const Test = () => {
    const dispatch = useDispatch(); // Get the dispatch function

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserInfo());
      }, [dispatch]);

    useEffect(() => {
        console.log(userInfo);

      }, [userInfo]);

    return (
        <div>
            Hello
        </div>
    );
};

export default Test;

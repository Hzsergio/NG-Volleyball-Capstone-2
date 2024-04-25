import { Sidebar } from "flowbite-react";
import {
  HiChartPie, HiClipboard,
  HiCollection, HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers
} from "react-icons/hi";
import React, { useState, useEffect } from 'react';
import { HiMiniUsers } from "react-icons/hi2";
import { BsLadder } from "react-icons/bs";
import { FaCalendarCheck } from "react-icons/fa";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import GetTeams from "../components/GetTeams";
import GetChallenges from "../components/GetChallenges";
import Inbox from "./Inbox";
import GetUserDivisions from "../components/GetUserDivisions";
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice'; // Import the getUserInfo action
import { HiMenu } from "react-icons/hi";


const Test = ({ name, team1, team2 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLink, setSelectedLink] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClose = () => setIsOpen(false);
  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  useEffect(() => {
    dispatch(getUserInfo());
  }, []); 
  

  return (
    <div className="flex flex-col h-screen md:flex-row">
            <div className="lg:hidden">
        <button className="btn btn-square" onClick={toggleSidebar}>
          <HiMenu />
        </button>
      </div>
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-200">
        <Sidebar aria-label="Sidebar with multi-level dropdown" className={isSidebarOpen ? "" : "hidden lg:block"}>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item onClick={() => handleLinkClick('my-teams')} icon={HiMiniUsers}>
                My Teams
              </Sidebar.Item>
              <Sidebar.Item onClick={() => handleLinkClick('my-divisions')} icon={BsLadder}>
                My Divisions
              </Sidebar.Item>
              <Sidebar.Item onClick={() => handleLinkClick('my-challenges')} icon={FaCalendarCheck}>
                My Challenges
              </Sidebar.Item>
              <Sidebar.Item onClick={() => handleLinkClick('inbox')} icon={BiSolidMessageSquareDetail}>
                Inbox
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {selectedLink === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the Dashboard!</p>
          </div>
        )}
        {selectedLink === 'my-teams' && <GetTeams userInfo={userInfo} />}
        {selectedLink === 'my-divisions' && <GetUserDivisions />}
        {selectedLink === 'my-challenges' && <GetChallenges />}
        {selectedLink === 'inbox' && <Inbox />}

      </div>
    </div>
  );
};

export default Test;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";

const Nav = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate("/");
    };

    if (!user) {
        // Render a simplified version of the navbar for users who are not logged in
        return (
            <Navbar fluid rounded>
                <NavLink className="logo" to="/login">Ladder</NavLink>
                <Navbar.Link href="/login">Login</Navbar.Link>

            </Navbar>
        );
    }

    // Render the full version of the navbar for logged-in users
    return (
        <Navbar fluid rounded>
            <NavLink className="logo" to="/dashboard">Ladder</NavLink>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{user.username}</span>
                        <span className="block truncate text-sm font-medium">{user.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                    <Dropdown.Item href="/myprofile">Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/" onClick={handleLogout} >Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="#" active>
                    Home
                </Navbar.Link>
                <Navbar.Link href="/divisions">Divisions</Navbar.Link>
                <Navbar.Link href="/allteams">Teams</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Nav;

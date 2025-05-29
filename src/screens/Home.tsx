import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importamos React Router

import Button from "@mui/material/Button";

import SideMenu from "./SideMenu";
import SignUsers from "./SignUser";
import SignClass from "./SignClass";


import UserScreens from "./UserScreens";
import ClassScreens from "./ClassScreens";
import { Box } from "@mui/material";
import EditUser from "../components/EditUser";


const Home = () => {
    return (
        <Router>
            <Box sx={{ display: "flex", height: "100vh" }}>
                <Box sx={{ flex: 1 }}><SideMenu /></Box>

                <Box sx={{ flex: 5 }}>

                    <Routes>
                        <Route path="/users" element={<UserScreens />} />
                        <Route path="/classes" element={<ClassScreens />} />
                        <Route path="/sign-users" element={<SignUsers />} />
                        <Route path="/sign-class" element={<SignClass />} />
                        <Route path="/edit-user/:userId" element={<EditUser />} />


                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default Home;
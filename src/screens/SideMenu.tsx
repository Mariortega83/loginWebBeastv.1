import React from "react";
import { Button, Stack, Box } from "@mui/material";
import { useAuth } from '../context/AuthContext';
import UserProfile from "../components/UserProfile";
import SideMenuHd from "../components/SideMenuHd";
import SideMenuBt from "../components/SideMenuBt";

const SideMenu = () => {
    const { onLogout } = useAuth();

    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{
                position: "fixed",
                width: "300px",
                height: "100%",
                padding: "1rem 2rem",
                borderTopRightRadius: "10px", 
                borderBottomRightRadius: "10px",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                overflowY: "auto",
            }}
        >
            <SideMenuHd />

            <Box

            >
                <Stack
                    direction="column"
                    gap={2}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    sx={{
                        width: "100%",
                        marginTop: "4rem",
                    
                    }}
                >
                    <SideMenuBt content="Usuarios" act="/users" />
                    <SideMenuBt content="Clases" act="/classes" />
                    <SideMenuBt content="Dar de alta" act="/sign-users" />
                </Stack>
            </Box>

            <Box sx={{ marginTop: "auto" }}>
                <Button
                    onClick={onLogout}
                    sx={{
                        color: "#ECF0F1",
                        backgroundColor: "#E74C3C",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        width: "100%",
                        "&:hover": {
                            backgroundColor: "#C0392B",
                        },
                    }}
                >
                    Sign out
                </Button>


                <Box sx={{ marginTop: ".4rem", marginBottom: "1rem" }}>
                    <UserProfile />
                </Box>
            </Box>
        </Stack>
    );
};

export default SideMenu;

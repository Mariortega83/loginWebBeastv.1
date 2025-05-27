import React from "react";
import { Typography, Stack } from "@mui/material";
import InputBar from "../components/InputBar";

const CustomBoardScreen = () => {
    return (
        <Stack direction="column" justifyContent="space-between" alignItems="center" sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ padding: '20px', textAlign: 'center' }}>
                Plano Screens
            </Typography>
            <InputBar />
        </Stack >
    );
}
export default CustomBoardScreen;
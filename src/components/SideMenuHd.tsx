import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  gymId?: string;
}

const SideMenuHd = () => {
  const { authState } = useAuth();
  interface Gym {
    name?: string;
    address?: string;
  }
  const [gym, setGym] = useState<Gym>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        setLoading(true);
        const token = authState?.token;
        let gymId = "";
        if (token) {
          const payload = jwtDecode<JwtPayload>(token);
          gymId = payload.gymId || "";
        }
        const response = await axios.get(`${API_URL}/api/gyms/${gymId}`);
        setGym(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching gym:", error);
        setError("Error al cargar el gimnasio");
      } finally {
        setLoading(false);
      }
    };

    fetchGym();
  }, [authState]);

  return (
    <AppBar
      position="sticky"
      sx={{
        width: "100%",
        height: "180px",  
        background: "transparent",
        boxShadow: "none",
        zIndex: 1300, 
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem 3rem",
          textAlign: "center",
        }}
      >
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem", 
          }}
        >
          <img
            src={`../../public/logowb.png`}
            alt="Logo"
            loading="lazy"
            style={{
              width: "80px",
              height: "80px", 
              borderRadius: "50%",
            }}
          />
        </Box>

        {/* Gym Name and Address */}
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "600",
            fontSize: "2rem",
            marginBottom: "0.5rem",
            textTransform: "uppercase", 
          }}
        >
          BeastMode
        </Typography>

        {/* Loading or Gym Information */}
        <Box sx={{ textAlign: "center", maxWidth: "320px", width: "100%" }}>
          {loading ? (
            <CircularProgress sx={{ color: "white" }} />
          ) : error ? (
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontSize: "1rem",
                fontStyle: "italic",
                marginBottom: "0.5rem",
              }}
            >
              {error}
            </Typography>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  borderBottom: "2px solid white",
                  paddingBottom: "0.5rem",
                  fontSize: "1.2rem",
                }}
              >
                {gym?.name || "Nombre del gimnasio no disponible"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: ".8rem",
                  marginTop: "0.5rem",
                }}
              >
                {gym?.address || "Dirección no disponible"}
              </Typography>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SideMenuHd;

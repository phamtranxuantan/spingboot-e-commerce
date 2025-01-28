import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Grid
} from "@mui/material";
// import { Layout } from "./Layout";
import { blue } from "@mui/material/colors";
import { authProvider } from "./authProvider";
import { useEffect, useState } from "react";

export const DashBoard = () => {
  const [authStatus, setAuthStatus] = useState("Not Authenticated");

  useEffect(() => {
    authProvider.checkAuth().then(() => {
      setAuthStatus("Authenticated");
    }).catch(() => {
      setAuthStatus("Not Authenticated");
    });
  }, []);

  return (
    <Grid container justifyContent="center" style={{ marginTop: 50 }}>
      <Grid item xs={12} md={8} lg={6}>
        <Card style={{
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: `linear-gradient(135deg, ${blue[500]}, ${blue[300]} 90%)`,
          color: "white"
        }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: "white", color: blue[500] }}>A</Avatar>}
            title="Welcome to the Administration"
            titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          />
          <CardContent>
            <Typography variant="body1" style={{ marginBottom: 16 }}>
              Welcome to Admin
            </Typography>
          </CardContent>
          {authStatus === null ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress size={24} style={{ color: "white", marginRight: 8 }} />
              <Typography variant="body2">
                Checking Auth
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {authStatus}
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

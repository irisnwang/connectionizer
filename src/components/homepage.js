import { Box, Typography } from "@mui/material";

export const Homepage = () => {
  return (
    <Box align="center" justify="center">
      <Typography fontSize="30px" className="container">
        Welcome To Connectionizer
      </Typography>
      <Typography className="container">
        Connectionizer is a tool for creating playing, and sharing custom NYT Connections-style puzzles developed by Iris Wang.
      </Typography>
    </Box>
  );
};

export default Homepage;

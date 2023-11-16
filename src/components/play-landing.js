import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const PlayLanding = () => {
  const navigate = useNavigate();
  return (
    <Box align="center">
      <Typography>
        Welcome to Connectionizer! To play a custom puzzle, enter a shared link.
      </Typography>
      <Button
        variant="outline"
        rounded="full"
        onClick={() => navigate("/create")}
      >
        Create a puzzle
      </Button>
      <Button
        variant="outline"
        rounded="full"
        onClick={() => navigate("/play/65558033af5dfc13c5883280")}
      >
        Play an example puzzle
      </Button>
    </Box>
  );
};

export default PlayLanding;

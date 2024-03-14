import { Box, Button, Typography } from "@mui/material";
import { findAllPuzzleIds } from "../services/puzzles-service";
import { useNavigate } from "react-router-dom";

export const PlayLanding = () => {
  const navigate = useNavigate();
  const randomizePuzzle = async () => {
    const puzzles = await findAllPuzzleIds();
    const randomPuzzleId = puzzles[Math.floor(Math.random() * puzzles.length)];
    navigate("/play/" + randomPuzzleId);
  };
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
        onClick={() => randomizePuzzle()}
      >
        Play a random puzzle
      </Button>
    </Box>
  );
};

export default PlayLanding;

import { Box, Button, Typography } from "@mui/material";
import { BASE_URL } from "./utils";
import { findAllPuzzleIds } from "../services/puzzles-service";

export const PlayLanding = () => {
  const randomizePuzzle = async () => {
    const puzzles = await findAllPuzzleIds();
    const randomPuzzleId = puzzles[Math.floor(Math.random() * puzzles.length)];
    window.location.replace(BASE_URL + "play/" + randomPuzzleId);
  }
  return (
    <Box align="center">
      <Typography>
        Welcome to Connectionizer! To play a custom puzzle, enter a shared link.
      </Typography>
      <Button
        variant="outline"
        rounded="full"
        onClick={() => window.location.replace(BASE_URL + "create")}
      >
        Create a puzzle
      </Button>
      <Button variant="outline" rounded="full" onClick={() => randomizePuzzle()}>
        Play a random puzzle
      </Button>
    </Box>
  );
};

export default PlayLanding;

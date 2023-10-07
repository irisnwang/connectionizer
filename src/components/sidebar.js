import {
  AppBar,
  Button,
  Toolbar,
} from "@mui/material";
import { Outlet } from "react-router-dom";

function Game() {
  return (
    <>
      <AppBar position="static" color="secondary" sx={{ marginBottom: "20px" }}>
        <Toolbar variant="dense">
          <Button href="/" sx={{ color: "black" }} disableRipple>
            Home
          </Button>
          <Button href="/create" sx={{ color: "black" }} disableRipple>
            Create
          </Button>
          <Button href="/play" sx={{ color: "black" }} disableRipple>
            Play
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

export default Game;

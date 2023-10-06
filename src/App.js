import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShareCreated from "./components/share-created";
import Homepage from "./components/homepage";
import Game from "./components/play";
import Creator from "./components/creator";
import Sidebar from "./components/sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PlayLanding from "./components/play-landing";

const theme = createTheme({
  palette: {
    primary: { main: "#efefe6" },
    info: { main: "#fbd400" },
    error: { main: "#b5e352" },
    warning: { main: "#729eeb" },
    success: { main: "#bc70c4" },
    secondary: { main: "#5a594e" },
    action: {
      disabledBackground: "", // don't set the disable background color
      disabled: "#efefe6", // set the disable foreground color
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<Sidebar />}>
              <Route path="" element={<Homepage />} />
              <Route path="/play" element={<PlayLanding />} />
              <Route path="/play/:id" element={<Game />} />
              <Route path="/create" element={<Creator />} />
              <Route path="/create/:id" element={<ShareCreated />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

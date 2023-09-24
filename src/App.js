import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "./components/homepage";
import Game from "./components/play";
import Creator from "./components/creator";
import Sidebar from "./components/sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#efefe6" },
    info: { main: "#fbd400" },
    error: { main: "#b5e352" },
    warning: { main: "#729eeb" },
    success: { main: "#bc70c4" },
    secondary: {main: "#5a594e"}
  },
});


export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<Sidebar />}>
              <Route path="index"
                element={<Homepage />} />
              <Route path="/play/:id"
                element={<Game />} />
              <Route path="/create"
                exact={true}
                element={<Creator />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>);
};

export default App;
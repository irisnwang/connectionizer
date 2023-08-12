import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "./components/homepage";
import Game from "./components/play";
import Creator from "./components/creator";
import Sidebar from "./components/sidebar";

export const App = () => {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Sidebar />}>
            <Route path="index" 
              element={<Homepage />} />
            <Route path="/play"
              element={<Game />} />
            <Route path="/create"
              exact={true}
              element={<Creator />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>);
};

export default App;
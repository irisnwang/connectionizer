import {Outlet} from "react-router-dom";

function Game() {
  return (
      <div className="my-4">
        <div className="row mt-2">
          <h1 className="text-center">
            <a href="/" className="text-decoration-none">Home</a>
          </h1>
          <h1 className="text-center">
            <a href="/play" className="text-decoration-none">Play</a>
          </h1>
          <h1 className="text-center">
            <a href="/create" className="text-decoration-none">Create</a>
          </h1>
        </div>
        <div className="container">
          <Outlet/>
        </div>
      </div>
  );
}

export default Game;
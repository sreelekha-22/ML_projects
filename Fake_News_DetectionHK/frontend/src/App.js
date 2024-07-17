import React, { useState } from "react";
import "./App.css";
import Prediction from "./components/Prediction";

function App() {
  const [page, setPage] = useState("Home");

  const Home = () => (
    <div className="home">
      <h4>This is the home page content about fake news detection.</h4>
      <img
        src="/PROJECTImages/fakehome.JPEG"
        alt="Fake News"
        className="fakeimage"
      />
    </div>
  );

  // const Feedback = () => (
  //   <div className="content">
  //     <h1>Feedback</h1>
  //     <p>Output will be displayed here after execution.</p>
  //   </div>
  // );

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => setPage("Home")}>Home</button>
        <button className="prediction" onClick={() => setPage("Prediction")}>
          Prediction
        </button>
      </nav>

      {page === "Home" && <Home />}
      {page === "Prediction" && <Prediction />}
      {/* {page === "Feedback" && <Feedback />} */}
    </div>
  );
}

export default App;

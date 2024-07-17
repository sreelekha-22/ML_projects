import React, { useState } from "react";
import "../App.css";
function Prediction() {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/pred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ news: inputText }),
      });
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="content">
      <div className="outerprediction">
        <form onSubmit={handleSubmit}>
          <textarea
            className="news_art"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            cols={100}
          />

          <br />
          <input type="submit" value="Predict" className="prediction-button" />
        </form>
      </div>
      <div className="predictionbox">
        <h1 className="res"> {prediction} </h1>
      </div>
    </div>
  );
}

export default Prediction;

//  PredictionResults.js

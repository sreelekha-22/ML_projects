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
          <label>
            Enter text:
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </label>
          <br />
          <input type="submit" value="Submit" className="prediction-button" />
        </form>
      </div>
      <div className="predictionbox">
        <p>{prediction}</p>
      </div>
    </div>
  );
}

export default Prediction;

// import React from 'react'; // Add semicolon at the end

// const PredictionResults = ({ isFake, relevantNews }) => {
//     return (
//         <div>
//             {isFake ? (
//                 <p>This news is likely fake.</p>
//             ) : (
//                 <p>This news seems genuine.</p>
//             )}
//             {relevantNews && <p>Relevant news: {relevantNews}</p>}
//         </div>
//     );
// };

// export default PredictionResults;

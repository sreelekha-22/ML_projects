import React, { useState } from "react";
import "../App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";

function Prediction() {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const stopListening = () => SpeechRecognition.stopListening();
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

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
          <div className="micro">
            <div
              className="main-content"
              onClick={() => setTextToCopy(transcript)}
            >
              Get content:
              <input type="text" value={transcript} />
            </div>
          </div>
          <div className="btn-style">
            <button onClick={setCopied}>
              {isCopied ? "Copied!" : "Copy to clipboard"}
            </button>
            {browserSupportsSpeechRecognition && (
              <>
                <button onClick={startListening}>Start Listening</button>
                <button onClick={stopListening}>Stop Listening</button>
              </>
            )}
          </div>
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

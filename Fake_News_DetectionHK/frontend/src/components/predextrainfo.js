import React, { useState } from "react";
import "../App.css";

function Prediction() {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchNews(inputText);
      const data = await response.json();
      setPrediction(data.prediction);
      if (data.prediction === "real") {
        // If news is predicted as fake, fetch additional news data
        const newsResponse = await fetchNewsData(inputText);
        const newsData = await newsResponse.json();
        console.log(newsData);
        setNewsData(newsData);
      } else {
        setNewsData(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async (text) => {
    return fetch("/pred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ news: text }),
    });
  };

  const fetchNewsData = async (query) => {
    // Make a request to your chosen news API here
    const apiKey = "c1b2057eacd74dfdae03aa29dd285acd";
    query = query.length > 500 ? query.substring(0, 500) : query;

    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
    return fetch(apiUrl);
  };

  return (
    <div className="content">
      {/* <div className="outerprediction"> */}
      <form onSubmit={handleSubmit}>
        <textarea
          style={{ border: "1px solid black" }}
          name="postContent"
          rows={4}
          cols={150}
          maxLength={2500}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <br />
        <input type="submit" value="Submit" className="prediction-button" />
      </form>
      {/* </div> */}
      <div className="predictionbox">
        <p>{prediction}</p>
        {loading && <p>Loading...</p>}
        {newsData && (
          <div>
            <h3>Additional News Information</h3>
            <ul>
              {newsData.articles.map((article, index) => (
                <li key={index}>
                  <strong>Source:</strong> {article.source.name}
                  <br />
                  <strong>Title:</strong> {article.title}
                  <br />
                  <strong>Description:</strong> {article.description}
                  <br />
                  <strong>Published At:</strong> {article.publishedAt}
                  <br />
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prediction;

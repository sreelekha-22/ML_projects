# 🧠 Fake News Detection System

**Full Stack AI Web Application — React + Flask + LSTM (94% Accuracy)**


## 📌 Overview

A real-time fake news detection system that uses a **deep learning LSTM model** to classify news as **REAL or FAKE**. The project is fully implemented as a **full stack application** with a React frontend, Flask backend, and an AI model trained on a real-world Kaggle dataset.


## 🧾 Dataset

Trained on the **Kaggle Fake News Dataset**, containing labeled news articles. Preprocessing includes:

* Tokenization
* Stopword removal
* Lowercasing
* Sequence padding
* Word embeddings



## 🛠 Tech Stack

| Layer       | Technology Used         |
| ----------- | ----------------------- |
| Frontend    | React                   |
| Backend API | Flask                   |
| Model Type  | LSTM (Deep Learning)    |
| Dataset     | Kaggle (Fake News)      |
| Libraries   | TensorFlow, Keras, NLTK |


## 📈 Model Performance

| Metric    | Value            |
| --------- | ---------------- |
| Accuracy  | **94%**          |
| Latency   | < 400ms          |
| Framework | TensorFlow/Keras |


## ⚙️ Features

* Real-time prediction using Flask API
* User-friendly React UI
* Confidence score for each prediction
* Trained on a real-world Kaggle dataset
* Modular & scalable architecture


## 🌐 API Example

**POST /predict**

json
{
  "text": "Breaking news: Scientists confirm aliens are living on Mars!"
}

**Response**

json
{
  "prediction": "FAKE",
  "confidence": 0.92
}



## 🔮 Future Enhancements

* Real-time news scraping
* Automatic retraining with new data (continuous learning)
* Transformer models (BERT / RoBERTa)
* Explainable AI (word-level attention)
* Analytics dashboard (fake vs real statistics)
* Cloud deployment (AWS / Render / Railway / Docker)


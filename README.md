# ML Projects

A collection of applied machine-learning work — each project taking real data from a notebook
through a trained model to a running application.

| Project | Task | Approach | Link |
|---|---|---|---|
| **Fake News Detection** | Classify news as real or fake from raw text | LSTM sequence classifier + Flask API + React UI | [Fake_News_DetectionHK](Fake_News_DetectionHK) |
| **Medicinal Plant Detection** | Identify plant conditions from leaf images | VGG19 / CNN image classifier | [Med_Plant_Detection](Med_Plant_Detection) |
| **Poultry Disease Detection** | Detect poultry disease from images | CNN image classifier | [Poultry_disease_detection](Poultry_disease_detection) |

---

## Fake News Detection

The full-stack one: an LSTM model behind a Flask inference API behind a React frontend.

**Pipeline**

```
article text
  → strip non-alpha  →  stopword removal (NLTK)  →  Porter stemming
  → one-hot encode (vocab 5,000)  →  pad_sequences
  → LSTM model  →  argmax  →  FAKE / REAL (+ confidence)
```

**Details**
- Model: `lstm1tr3_lg_text_trained_model.keras`, trained on a Kaggle fake-news dataset (~94% accuracy)
- Text preprocessing: regex clean → NLTK stopwords → PorterStemmer → `one_hot` at `voc_size = 5000`
  → `pad_sequences`
- Backend: Flask, returns JSON
- Frontend: React 18 (CRA), proxied to `http://localhost:5000`, with speech recognition and
  clipboard helpers

**Run it**

```bash
# backend
cd Fake_News_DetectionHK/backend
pip install flask tensorflow nltk numpy
python server.py            # → http://localhost:5000

# frontend
cd Fake_News_DetectionHK/frontend
npm install
npm start                   # → http://localhost:3000
```

> **Note** — `server.py` currently hardcodes an absolute Windows path for the model:
> `C:\Users\vaish\OneDrive\Documents\fakenews\...`. Change `load_model(...)` to a relative path such
> as `os.path.join(os.path.dirname(__file__), 'lstm1tr3_lg_text_trained_model.keras')` before running
> it on another machine.

Training work lives in `backend/trial-tr-text-lg.ipynb`.

---

## Medicinal Plant Detection

A convolutional image classifier that identifies plant condition from leaf photographs, served as a
small Flask app (`mePD2.py`) with the training pipeline in `Med_plant_det.ipynb`.

- **Model** — VGG19-based classifier (`plD_vgg19.h5`), 224×224 input, ImageNet preprocessing
- **Inference** — `argmax` over the class probabilities, mapped to a readable label
- **Serving** — Flask routes `GET /` for the upload page and `POST /predict` for inference
- **Stack** — TensorFlow 2.2, Keras, OpenCV, NumPy, scikit-learn

---

## Poultry Disease Detection

Image classification for early detection of disease in poultry flocks.

- **Model** — CNN image classifier, trained in `plD_1.ipynb`
- **Serving** — `Pdc.py` exposes the trained model for prediction
- **Classes** — `cocci` (coccidiosis), `healthy`, `ncd` (Newcastle disease), `salmo` (salmonella)
- **Stack** — TensorFlow, Keras, OpenCV, NumPy

---

## Notes

- The classifier projects share the same four-class label space, so a model trained for one
  (`Poultry_disease_detection/plD_1.ipynb`) is also what powers the plant-detection app's
  `plD_vgg19.h5` weights.
- The trained `.keras` / `.h5` weights are committed for Fake News Detection. For the classifier
  projects, supply or retrain the weights — the serving code loads them at import time.
- Classifier environments are pinned to **Python 3.7/3.8** (TensorFlow 2.2 era).

## License

MIT

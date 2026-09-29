# ML Projects

A collection of applied machine-learning work — each project taking real data from a notebook
through a trained model to a running application.

| Project | Task | Approach | Link |
|---|---|---|---|
| **Fake News Detection** | Classify news as real or fake from raw text | LSTM sequence classifier + Flask API + React UI | [Fake_News_DetectionHK](Fake_News_DetectionHK) |
| **Medicinal Plant Detection** | Identify 1 of 80 Ayurvedic plant species from a leaf image | VGG19 transfer learning, frozen backbone | [Med_Plant_Detection](Med_Plant_Detection) |
| **Poultry Disease Detection** | Detect 1 of 4 poultry conditions from an image | VGG19 transfer learning, frozen backbone | [Poultry_disease_detection](Poultry_disease_detection) |

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

An **80-class Ayurvedic medicinal-plant identifier** — it classifies a leaf image as Tulsi, Neem,
Amla, Turmeric, Ashoka, Brahmi and 72 more.

- **Model** — VGG19 with the ImageNet head removed, frozen, plus a single `Dense(80, softmax)`
  classification layer
- **Dataset** — `FMLd/`, one folder per species, loaded via `ImageDataGenerator`
- **Weights** — `model_2_vgg19.h5`
- **Augmentation** — `rescale=1/255`, `shear_range=0.2`, `zoom_range=0.2`, `horizontal_flip=True`,
  80/20 train/val split
- **Training** — categorical crossentropy + Adam, up to 500 epochs with `EarlyStopping`
  (`monitor='val_loss'`, `patience=5`, `restore_best_weights=True`) — run on Colab T4
- **Serving** — a deployed Flask app lives in the standalone
  [Medicinal-Plant-Identification](https://github.com/sreelekha-22/Medicinal-Plant-Identification) repo

| File | Role |
|---|---|
| `mePD2.py` | The training script — VGG19 + dense head, `ImageDataGenerator`, early stopping |
| `Med_plant_det.ipynb` | Colab notebook that mounts Drive and runs `mePD2.py` |

**The 80 classes**

<details>
<summary>Full class list</summary>

Aloevera · Amla · Amruthaballi · Arali · ashoka · Astma_weed · Badipala · Balloon_Vine · Bamboo ·
Beans · Betel · Bhrami · Bringaraja · camphor · Caricature · Castor · Catharanthus · Chakte ·
Chilly · Citron lime (herelikai) · Coffee · Common rue(naagdalli) · Coriender · Curry · Doddpathre ·
Drumstick · Ekka · Eucalyptus · Ganigale · Ganike · Gasagase · Ginger · Globe Amarnath · Guava ·
Henna · Hibiscus · Honge · Insulin · Jackfruit · Jasmine · kamakasturi · Kambajala · Kasambruga ·
kepala · Kohlrabi · Lantana · Lemon · Lemongrass · Malabar_Nut · Malabar_Spinach · Mango · Marigold ·
Mint · Neem · Nelavembu · Nerale · Nooni · Onion · Padri · Palak(Spinach) · Papaya · Parijatha ·
Pea · Pepper · Pomoegranate · Pumpkin · Raddish · Rose · Sampige · Sapota · Seethaashoka ·
Seethapala · Spinach1 · Tamarind · Taro · Tecoma · Thumbe · Tomato · Tulsi · Turmeric

</details>

**Result** — final logged epoch reached `accuracy: 0.8931` train / `val_accuracy: 0.5067`, so the
model is overfitting. Tightening augmentation or adding a regulariser (weight decay / dropout before
the dense head) is the obvious next step.

---

## Poultry Disease Detection

A **4-class** image classifier for early detection of disease in poultry flocks.

- **Model** — same VGG19 + dense-head architecture, trained on a different dataset
- **Dataset** — `plD/`, one folder per condition
- **Weights** — `plD_vgg19.h5`
- **Augmentation** — same generator settings; `EarlyStopping` with `patience=10`

| Class | Condition |
|---|---|
| `cocci` | Coccidiosis |
| `healthy` | Healthy bird |
| `ncd` | Newcastle disease |
| `salmo` | Salmonellosis |

| File | Role |
|---|---|
| `Pdc.py` | The training script — VGG19 + dense head over `plD/` |
| `plD_1.ipynb` | Colab notebook driving the training run |

> The four labels are condensed in the notebook outputs (e.g. `salmo` appears ~6.8k times against
> `healthy` ~55) — the dataset is heavily imbalanced, so training accuracy will look strong while
> the minority classes generalise poorly. Class weighting or resampling would be the fix.

---

## Notes

- **The two classifiers are independent** — different datasets (`FMLd/` vs `plD/`), different label
  spaces (80 plant species vs 4 poultry conditions), different weights
  (`model_2_vgg19.h5` vs `plD_vgg19.h5`).
- The standalone [Medicinal-Plant-Identification](https://github.com/sreelekha-22/Medicinal-Plant-Identification)
  repo currently loads **`plD_vgg19.h5`** — the *poultry* weights — despite its name. See that
  repo's README for the details.
- The trained `.keras` weights are committed for Fake News Detection. The `.h5` classifier weights
  are not committed; the serving code loads them at import time, so supply or retrain first.
- Classifier environments are pinned to **Python 3.7/3.8** (TensorFlow 2.2 era).

## License

MIT

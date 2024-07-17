from flask import Flask, request, jsonify
import re
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import one_hot
# import tensorflow
# from tensorflow import keras
# from keras.models import load_model
# from keras.preprocessing.sequence import pad_sequences
# from keras.preprocessing.text import one_hot

app = Flask(__name__)

nltk.download('stopwords')

print("Before loading model")
best_model = load_model(r'C:\Users\vaish\OneDrive\Documents\fakenews\lstm1tr3_lg_text_trained_model.keras')
print("After loading model")

def text_preprocessing(t):
    voc_size=5000
    ps = PorterStemmer()
    corpus = []
    for i in range(0, len(t)):
        # print(i)
        review = re.sub('[^a-zA-Z]', ' ', t[i])
        review = review.lower()
        review = review.split()

        review = [ps.stem(word) for word in review if not word in stopwords.words('english')]
        review = ' '.join(review)
        corpus.append(review)

    onehot_repr=[one_hot(words,voc_size)for words in corpus] 
    return onehot_repr

def pred_input_psg_new(text):
    sent_length=5000
    encd=text_preprocessing(text)
    padded_encoded_title = pad_sequences(encd,maxlen=sent_length,padding = 'pre')
    output = best_model.predict(padded_encoded_title)
    output = np.where(0.5>output,0,1)
    if output[0][0] == 1:
        return 'fake'
    return 'real' 

@app.route('/pred', methods=['POST'])
def predict_news():
    # Assuming the request body contains the news text
    data = request.get_json()
    news_text = data['news']
    # print(type(news_text))
    # print(news_text)
    # print([news_text])
    prediction = pred_input_psg_new([news_text])
    print(prediction)
    return jsonify({'prediction': prediction})


# print(pred_input_psg_new(['dtfygh fvgbhn']))

# @app.route('/')
# def hello():
#     return "Hello, world! This is my Flask server."

if __name__=='__main__':
    app.run(debug=True)

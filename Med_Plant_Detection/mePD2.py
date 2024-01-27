from keras.models import load_model
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Input, Lambda, Dense, Flatten, Conv2D
from tensorflow.keras.models import Model
from tensorflow.keras.applications.vgg19 import VGG19
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img
from tensorflow.keras.models import Sequential
from tensorflow.keras.callbacks import EarlyStopping
import numpy as np
from glob import glob
import matplotlib.pyplot as plt

IMAGE_SIZE = [224, 224]
vgg = VGG19(input_shape=IMAGE_SIZE + [3],
            weights='imagenet', include_top=False)

# don't train existing weights
for layer in vgg.layers:
    layer.trainable = False

folders = glob('FMLd/*')
len(folders)

# our layers - you can add more if you want
x = Flatten()(vgg.output)

prediction = Dense(len(folders), activation='softmax')(x)

# create a model object
model = Model(inputs=vgg.input, outputs=prediction)

model.summary()

model.compile(
    loss='categorical_crossentropy',
    optimizer='adam',
    metrics=['accuracy']
)


# Directory containing all your class folders
data_directory = 'FMLd'

# Create an ImageDataGenerator for data augmentation and preprocessing
datagen = ImageDataGenerator(
    rescale=1./255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2  # You can adjust the validation split ratio
)

# Set the target size for resizing the images
target_size = (224, 224)

# Create a generator for the entire dataset
batch_size = 32  # You can adjust the batch size
class_mode = 'categorical'  # Assuming you have class labels

# Create a generator for training data
train_generator = datagen.flow_from_directory(
    data_directory,
    target_size=target_size,
    batch_size=batch_size,
    class_mode=class_mode,
    subset='training'  # Use 'training' to specify the training split
)

# Create a generator for validation data
validation_generator = datagen.flow_from_directory(
    data_directory,
    target_size=target_size,
    batch_size=batch_size,
    class_mode=class_mode,
    subset='validation'  # Use 'validation' to specify the validation split
)

early_stopping = EarlyStopping(
    monitor='val_loss',  # Monitor validation loss
    # Number of epochs with no improvement after which training will be stopped
    patience=5,
    restore_best_weights=True  # Restore the best model weights when training is stopped
)

# Train the model with early stopping
r = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=500,  # You can set this to a larger value since early stopping will prevent overfitting
    steps_per_epoch=len(train_generator),
    validation_steps=len(validation_generator),
    callbacks=[early_stopping]  # Add the early stopping callback
)


model.save('model_2_vgg19.h5')

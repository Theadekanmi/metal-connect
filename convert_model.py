import tensorflow as tf
import os

# Path to the original .h5 model
model_path = r"C:\Users\HP\OneDrive\Documents\3mtt hackathon\models\keras.h5.h5"

# Load the Keras model
model = tf.keras.models.load_model(model_path)
print("Model loaded successfully!")

# Directory where the model will be saved
saved_model_dir = r"C:\Users\HP\OneDrive\Documents\3mtt hackathon\models\tensorflow_model"

# Debugging: Ensure the directory exists before saving
if not os.path.exists(saved_model_dir):
    print(f"Creating directory: {saved_model_dir}")
    os.makedirs(saved_model_dir)

# Save the model in TensorFlow SavedModel format
print("Saving the model...")
model.save(saved_model_dir, save_format='tf')
print(f"Model saved in TensorFlow SavedModel format at: {saved_model_dir}")

# Check the contents of the directory after saving
print("Checking directory contents...")
for root, dirs, files in os.walk(saved_model_dir):
    for name in files:
        print(f"Found file: {name}")


import tensorflow as tf
import tensorflow_decision_forests as tfdf

print("TensorFlow version:", tf.__version__)
print("TensorFlow Decision Forests version:", tfdf.__version__)

let model;

// Load the trained model
async function loadModel() {
  // Load the TensorFlow.js model that was exported from Teachable Machine
  model = await tf.loadGraphModel('model.json');
  console.log('Model loaded!');
}

// Handle image upload and prediction
document.getElementById('uploadImage').addEventListener('change', handleImageUpload);

async function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    // Display image on the canvas
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async function() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Preprocess the image for the model (resize it to match input size)
      const tensorImg = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([224, 224])  // Resize to match model input size (adjust as needed)
        .toFloat()
        .expandDims(0);  // Add batch dimension

      // Get prediction from the model
      const prediction = await model.predict(tensorImg);

      // Get the predicted class (you can map the index to labels if needed)
      const predictedClass = prediction.argMax(-1).dataSync()[0]; // Get the class index
      document.getElementById('predictionResult').textContent = `Prediction: Class ${predictedClass}`;

      // Optionally, display more details based on the prediction
      // For example, you could map index to class names (e.g., "Happy", "Sad")
      const classNames = ["Happy", "Sad"]; // Replace with your actual class labels
      document.getElementById('predictionResult').textContent = `Prediction: ${classNames[predictedClass]}`;
    };
  }
}

// Load the model once the page is ready
window.onload = loadModel;
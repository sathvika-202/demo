// ⚠️ Make sure index.html, model.json, metadata.json, weights.bin are in the same folder

let model, maxPredictions;

// Load the Teachable Machine model
async function loadTMModel() {
  const modelURL = "model.json";
  const metadataURL = "metadata.json";

  try {
    const tmModel = await tmImage.load(modelURL, metadataURL);
    model = tmModel;
    maxPredictions = model.getTotalClasses();
    console.log("Model loaded successfully!");
  } catch (err) {
    console.error("Model loading failed:", err);
  }
}

document.getElementById("uploadImage").addEventListener("change", handleUpload);

async function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the uploaded image into a Tensor
    const prediction = await model.predict(canvas);

    // Build result text
    let resultText = "";
    for (let i = 0; i < prediction.length; i++) {
      const p = prediction[i];
      resultText += `${p.className} : ${(p.probability * 100).toFixed(2)}%\n`;
    }

    document.getElementById("predictionResult").textContent = resultText;
  };
}

// Auto-load the model on page open
window.onload = loadTMModel;

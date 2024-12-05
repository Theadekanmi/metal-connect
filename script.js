document.addEventListener('DOMContentLoaded', async function () {
    // Initialize active link for navigation
    const links = document.querySelectorAll('.item a');
    const currentPath = window.location.pathname.split('/').pop();
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');
        });
    });

    // Load the model
    await loadModel();

    // Set up camera
    await setupCamera();

    // Set up capture button
    document.getElementById('captureBtn').addEventListener('click', captureFrame);

    // Set up image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
});

// Load TensorFlow.js model
async function loadModel() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // Show loading spinner
    try {
        window.model = await tf.loadLayersModel('/assets/model/model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading the model:', error);
        alert('Failed to load the model. Please check your network or file path.');
    } finally {
        loadingElement.style.display = 'none'; // Hide loading spinner
    }
}

// Set up the camera to capture video feed
async function setupCamera() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions.');
    }
}

// Capture a frame from the video and make predictions
function captureFrame() {
    const video = document.getElementById('video');
    if (!video || video.readyState !== 4) {
        alert('Camera feed not ready. Please ensure camera permissions are enabled.');
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const tensor = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
    makePrediction(tensor);
}

// Handle image upload and display the uploaded image
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            document.getElementById('results').innerHTML = ''; // Clear previous results
            document.getElementById('results').appendChild(img); // Display uploaded image
            processImage(img);
        };
        img.onerror = (error) => {
            console.error('Error loading image:', error);
            alert('Error loading the image. Please try a different file.');
        };
    } else {
        alert('Please upload a valid image file.');
    }
}

// Process the uploaded image
function processImage(image) {
    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224]) // Resize to model's input size
        .toFloat()
        .expandDims(); // Add batch dimension
    makePrediction(tensor);
}

// Make a prediction using the model
async function makePrediction(inputTensor) {
    if (!window.model) {
        alert('Model not loaded. Please reload the page.');
        return;
    }
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // Show loading spinner
    try {
        const prediction = await window.model.predict(inputTensor).data();
        const materialType = classifyMaterial(prediction); // Classify material
        displayResults(materialType);
    } catch (error) {
        console.error('Error making prediction:', error);
        alert('Failed to make a prediction. Please try again.');
    } finally {
        loadingElement.style.display = 'none'; // Hide loading spinner
    }
}

// Classify material based on predictions
function classifyMaterial(prediction) {
    const classes = ['Aluminum', 'Copper', 'Iron', 'Plastic', 'Glass', 'Paper']; // Model output labels
    const maxIndex = prediction.indexOf(Math.max(...prediction)); // Get the index of the highest confidence
    const predictedClass = classes[maxIndex];

    // Determine if the material is a metal or non-metal
    const metalClasses = ['Aluminum', 'Copper', 'Iron'];
    const isMetal = metalClasses.includes(predictedClass);

    return {
        name: predictedClass,
        category: isMetal ? 'Metal' : 'Non-Metal',
    };
}

// Display the results on the page
function displayResults(material) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <h3>Prediction Results</h3>
        <p><strong>Material:</strong> ${material.name}</p>
        <p><strong>Category:</strong> ${material.category}</p>
    `;
}

// Add functionality for the "Give Feedback" button
document.addEventListener('DOMContentLoaded', () => {
    const feedbackButton = document.querySelector('.feedback-button');
    const feedbackForm = document.querySelector('.feedback-form');

    feedbackButton.addEventListener('click', () => {
        feedbackForm.style.display = 'block'; // Show feedback form
        feedbackButton.style.display = 'none'; // Hide feedback button
    });

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        const formData = new FormData(feedbackForm);
        console.log('Feedback submitted:', Object.fromEntries(formData.entries()));
        alert('Thank you for your feedback!');
        feedbackForm.reset();
        feedbackForm.style.display = 'none'; // Hide feedback form
        feedbackButton.style.display = 'block'; // Show feedback button
    });
});


const navlink = document.getElementById("navLink");
Menu.addEventListener("click",()=>{ 
navLink.classList.toggle("hidden");
});


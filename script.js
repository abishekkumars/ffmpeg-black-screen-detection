document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('videoInput');
    const detectButton = document.getElementById('detectButton');
    const resultDiv = document.getElementById('result');
    const outputDiv = document.getElementById('output');

    detectButton.addEventListener('click', function (event) {
        outputDiv.innerHTML = "";
        event.preventDefault();
        const videoFile = videoInput.files[0];

        if (videoFile) {
            resultDiv.innerHTML = 'Detecting black screens...';

            const formData = new FormData();
            formData.append('video', videoFile);

            fetch('http://localhost:3000/detect-black-screen', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        return response.text(); // Read the response as text
                    } else {
                        throw new Error('Request failed with status: ' + response.status);
                    }
                })
                .then(blackScreenData => {
                    event.preventDefault();
                    resultDiv.innerHTML = 'Black screen detected in the video.';
                    outputDiv.innerHTML = blackScreenData; // Display the response text
                    event.preventDefault();
                })
                .catch(error => {
                    resultDiv.innerHTML = 'Error: ' + error.message;
                    console.log('Fetch error:', error);
                });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const fileNameElement = document.getElementById('file-name');
    const convertBtn = document.getElementById('convert-btn');
    const backBtn = document.getElementById('back-btn');
    const formatSelect = document.getElementById('format-select');
    const fileDropArea = document.querySelector('.border-dashed');
    const loadingSpinner = document.getElementById('loading-spinner');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    fileDropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameElement.textContent = fileInput.files[0].name;
        } else {
            fileNameElement.textContent = 'No file selected';
        }
    });

    // Drag and drop functionality
    fileDropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileDropArea.classList.add('border-blue-500');
    });

    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('border-blue-500');
    });

    fileDropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        fileDropArea.classList.remove('border-blue-500');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileNameElement.textContent = files[0].name;
        }
    });

    convertBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const selectedFormat = formatSelect.value;

            // Show spinner and progress bar
            loadingSpinner.classList.remove('hidden');
            progressContainer.classList.remove('hidden');
            convertBtn.disabled = true;

            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    loadingSpinner.classList.add('hidden');
                    // In a real application, you would trigger the download or show a success message here.
                    setTimeout(() => {
                        progressContainer.classList.add('hidden');
                        convertBtn.disabled = false;
                        progressBar.style.width = `0%`;
                        progressBar.textContent = `0%`;
                    }, 2000);
                }
            }, 200);

        } else {
            // In a real application, you would show an error message to the user.
            console.log("Please select a file to convert.");
        }
    });

    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});

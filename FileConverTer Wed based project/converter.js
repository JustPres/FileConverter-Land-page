document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const fileNameElement = document.getElementById('file-name');
    const convertBtn = document.getElementById('convert-btn');
    const backBtn = document.getElementById('back-btn');
    const formatSelect = document.getElementById('format-select');
    const fileDropArea = document.querySelector('.border-dashed');

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
            alert(`Converting ${file.name} to ${selectedFormat.toUpperCase()}`);
            // Here you would add the actual file conversion logic
        } else {
            alert('Please select a file to convert.');
        }
    });

    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});

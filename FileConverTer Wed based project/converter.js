document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const fileNameElement = document.getElementById('file-name');
    const convertBtn = document.getElementById('convert-btn');
    const backBtn = document.getElementById('back-btn');
    const formatSelect = document.getElementById('format-select');
    const fileDropArea = document.querySelector('.border-dashed');
    const progressModal = document.getElementById('progress-modal');
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

            // Show modal
            progressModal.classList.remove('hidden');
            progressModal.classList.add('modal-enter');
            convertBtn.disabled = true;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        saveAs(blob, `${file.name.split('.')[0]}.${selectedFormat}`);

                        // Hide modal after conversion
                        setTimeout(() => {
                            progressModal.classList.add('modal-leave');
                            setTimeout(() => {
                                progressModal.classList.add('hidden');
                                progressModal.classList.remove('modal-enter', 'modal-leave');
                                convertBtn.disabled = false;
                                progressBar.style.width = `0%`;
                                progressBar.textContent = `0%`;
                            }, 300);
                        }, 1000);

                    }, `image/${selectedFormat}`);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);

        } else {
            // In a real application, you would show an error message to the user.
            console.log("Please select a file to convert.");
        }
    });

    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});

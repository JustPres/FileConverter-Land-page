document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const fileInput = document.getElementById('file-input');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileInfo = document.getElementById('file-info');
    const formatSelect = document.getElementById('format-select');
    const convertBtn = document.getElementById('convert-btn');
    const progressSection = document.getElementById('progress-section');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const successContainer = document.getElementById('success-container');
    const successMessage = document.getElementById('success-message');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // File validation constants
    const MAX_FILE_SIZE = {
        image: 10 * 1024 * 1024, // 10MB for images
        document: 5 * 1024 * 1024  // 5MB for documents
    };

    const SUPPORTED_FORMATS = {
        image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
        document: ['pdf', 'txt', 'doc', 'docx']
    };

    let selectedFile = null;
    let isConverting = false;

    // Utility functions
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.hidden = false;
        successContainer.hidden = true;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.hidden = true;
        }, 5000);
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successContainer.hidden = false;
        errorContainer.hidden = true;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            successContainer.hidden = true;
        }, 3000);
    }

    function updateProgress(percentage) {
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }

    function resetProgress() {
        updateProgress(0);
        progressSection.hidden = true;
    }

    function validateFile(file) {
        // Check file size
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isImage = SUPPORTED_FORMATS.image.includes(fileExtension);
        const isDocument = SUPPORTED_FORMATS.document.includes(fileExtension);

        if (!isImage && !isDocument) {
            throw new Error('Unsupported file format. Please select an image or document file.');
        }

        const maxSize = isImage ? MAX_FILE_SIZE.image : MAX_FILE_SIZE.document;
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            throw new Error(`File size too large. Maximum size is ${maxSizeMB}MB.`);
        }

        return { isImage, fileExtension };
    }

    function updateConvertButton() {
        const hasFile = selectedFile !== null;
        const hasFormat = formatSelect.value !== '';
        const canConvert = hasFile && hasFormat && !isConverting;

        convertBtn.disabled = !canConvert;

        if (canConvert) {
            convertBtn.setAttribute('aria-describedby', 'convert-help');
        } else {
            convertBtn.removeAttribute('aria-describedby');
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // File input handling
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        handleFileSelection(file);
    });

    // Drag and drop functionality
    fileDropArea.addEventListener('click', function () {
        fileInput.click();
    });

    fileDropArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    fileDropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        fileDropArea.classList.add('dragover');
    });

    fileDropArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        fileDropArea.classList.remove('dragover');
    });

    fileDropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        fileDropArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });

    function handleFileSelection(file) {
        if (!file) {
            selectedFile = null;
            fileInfo.textContent = 'No file selected';
            updateConvertButton();
            return;
        }

        try {
            const validation = validateFile(file);
            selectedFile = file;

            fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            fileInput.files = new DataTransfer().files; // Clear the input
            fileInput.files = new DataTransfer().files; // This is a workaround for the file input

            // Auto-select appropriate format if none selected
            if (!formatSelect.value) {
                if (validation.isImage) {
                    formatSelect.value = 'png';
                } else if (file.name.toLowerCase().endsWith('.pdf')) {
                    formatSelect.value = 'txt';
                } else {
                    formatSelect.value = 'pdf';
                }
            }

            updateConvertButton();
            errorContainer.hidden = true;

        } catch (error) {
            showError(error.message);
            selectedFile = null;
            fileInfo.textContent = 'No file selected';
            updateConvertButton();
        }
    }

    // Format selection handling
    formatSelect.addEventListener('change', function () {
        updateConvertButton();
        errorContainer.hidden = true;
    });

    // Convert button handling
    convertBtn.addEventListener('click', function () {
        if (!selectedFile || !formatSelect.value || isConverting) {
            return;
        }

        startConversion();
    });

    function startConversion() {
        isConverting = true;
        convertBtn.disabled = true;
        btnText.hidden = true;
        btnLoading.hidden = false;
        progressSection.hidden = false;
        errorContainer.hidden = true;
        successContainer.hidden = true;

        const targetFormat = formatSelect.value;
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            updateProgress(Math.round(progress));
        }, 200);

        // Perform conversion
        setTimeout(() => {
            clearInterval(progressInterval);
            updateProgress(100);

            setTimeout(() => {
                performConversion(selectedFile, targetFormat);
            }, 500);
        }, 2000);
    }

    function performConversion(file, targetFormat) {
        try {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const isImage = SUPPORTED_FORMATS.image.includes(fileExtension);

            if (isImage) {
                convertImage(file, targetFormat);
            } else {
                convertDocument(file, targetFormat);
            }
        } catch (error) {
            showError('Conversion failed: ' + error.message);
            resetConversion();
        }
    }

    function convertImage(file, targetFormat) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(function (blob) {
                    const fileName = file.name.split('.')[0] + '.' + targetFormat;
                    saveAs(blob, fileName);

                    showSuccess('File converted successfully!');
                    resetConversion();
                }, `image/${targetFormat}`);
            };

            img.onerror = function () {
                throw new Error('Failed to load image');
            };

            img.src = e.target.result;
        };

        reader.onerror = function () {
            throw new Error('Failed to read file');
        };

        reader.readAsDataURL(file);
    }

    function convertDocument(file, targetFormat) {
        // For documents, we'll create a simple text representation
        // In a real application, you would use a proper document conversion library
        const reader = new FileReader();

        reader.onload = function (e) {
            let content = '';

            if (targetFormat === 'txt') {
                content = e.target.result;
            } else if (targetFormat === 'pdf') {
                // Simple PDF-like content (in real app, use a PDF library)
                content = `Converted from: ${file.name}\n\n${e.target.result}`;
            }

            const blob = new Blob([content], { type: 'text/plain' });
            const fileName = file.name.split('.')[0] + '.' + targetFormat;

            saveAs(blob, fileName);
            showSuccess('File converted successfully!');
            resetConversion();
        };

        reader.onerror = function () {
            throw new Error('Failed to read document');
        };

        reader.readAsText(file);
    }

    function resetConversion() {
        isConverting = false;
        convertBtn.disabled = false;
        btnText.hidden = false;
        btnLoading.hidden = true;
        resetProgress();
        updateConvertButton();
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // Escape key to cancel conversion
        if (e.key === 'Escape' && isConverting) {
            resetConversion();
            showError('Conversion cancelled');
        }
    });

    // Accessibility improvements
    fileDropArea.addEventListener('focus', function () {
        this.setAttribute('aria-describedby', 'file-instructions');
    });

    fileDropArea.addEventListener('blur', function () {
        this.removeAttribute('aria-describedby');
    });

    // Error handling for FileSaver.js
    if (typeof saveAs === 'undefined') {
        console.error('FileSaver.js not loaded');
        showError('File saving library not available. Please refresh the page.');
    }

    // Performance monitoring
    const startTime = performance.now();
    window.addEventListener('load', function () {
        const loadTime = performance.now() - startTime;
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Initialize
    updateConvertButton();
    console.log('File converter initialized successfully');
}); 
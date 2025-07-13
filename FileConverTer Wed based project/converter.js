document.getElementById('convert-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length > 0) {
        alert(`Converting ${fileInput.files[0].name}`);
    } else {
        alert('Please select a file to convert.');
    }
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
});

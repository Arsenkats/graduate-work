
const uploadModalBtn = document.getElementById('upload-modal-btn');
const body = document.body;
const uploadModal = document.getElementById('upload-modal');
const uploadForm = document.forms['upload-form'];
const namebox = document.getElementById('namebox');
const desbox = document.getElementById('desbox');
const myimg = document.getElementById('myimg');

uploadModalBtn.addEventListener('click', () => {
    uploadModal.style.display = 'flex';
    body.style.overflow = 'hidden';
});


const closeModalIcon = document.getElementById('close-modal');


closeModalIcon.addEventListener('click', () => {
    uploadModal.style.display = 'none';
    body.style.overflow = 'visible';
    namebox.value = '';
    desbox.value = '';
    myimg.src = '';
   
});


window.addEventListener('click', (event) => {
  if (event.target === uploadModal) {
    uploadModal.style.display = 'none';
  }
});

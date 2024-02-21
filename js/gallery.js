import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Визначте firebaseConfig тут або вкажіть його значення
const firebaseConfig = {
  apiKey: "AIzaSyB-RglbxUd5dK3_4M20YrX2QZ3d2BqyV1U",
  authDomain: "graduate-work-8158d.firebaseapp.com",
  projectId: "graduate-work-8158d",
  storageBucket: "graduate-work-8158d.appspot.com",
  messagingSenderId: "841243249721",
  appId: "1:841243249721:web:c2e67654baa82aabfb91e8",
  measurementId: "G-PKXSE610X7"
};

const app = initializeApp(firebaseConfig);
const clouddb = getFirestore();
const auth = getAuth(app);

async function displayImages(auth, clouddb) {
  const galleryContainer = document.getElementById('gallery');
  galleryContainer.innerHTML = '';

  try {
    const imageLinksCollection = collection(clouddb, 'ImageLinks');
    const querySnapshot = await getDocs(imageLinksCollection);

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('img-item');

      const imageElement = document.createElement('img');
      imageElement.src = data.ImageURL;
      imageDiv.appendChild(imageElement);

      const imageInfoDiv = document.createElement('div');
      imageInfoDiv.classList.add('img-info');
      
      const displayNameElement = document.createElement('h3');
      displayNameElement.textContent = data.userDisplayName;
      imageInfoDiv.appendChild(displayNameElement);

      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = data.ImgDescription;
      imageInfoDiv.appendChild(descriptionElement);

const downloadLink = document.createElement('a');
downloadLink.href = "#";  
downloadLink.target = '_blank'; 
downloadLink.textContent = 'Завантажити';
downloadLink.classList.add('download-links');

downloadLink.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(data.ImageURL);
    const blob = await response.blob();

    // Викликати завантаження файлу
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = data.ImgName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Видалити тимчасовий URL
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Помилка завантаження:', error);
  }
});

imageInfoDiv.appendChild(downloadLink);

        
      imageInfoDiv.appendChild(downloadLink);

      imageDiv.appendChild(imageInfoDiv);
      galleryContainer.appendChild(imageDiv);
    });
  } catch (error) {
    console.error('Помилка отримання даних Firestore:', error);
  }
}



// Виклик функції displayImages() при завантаженні сторінки
window.onload = () => displayImages(auth, clouddb);


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc,  query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

async function searchImagesByDescription(searchText) {
  const searchGalleryContainer = document.getElementById('searchGallery');
  searchGalleryContainer.innerHTML = '';

  try {
    const imageLinksCollection = collection(clouddb, 'ImageLinks');
    const querySnapshot = await getDocs(imageLinksCollection);

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Перевірка, чи опис фотографії містить введений текст
      if (data.ImgDescription.includes(searchText)) {
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

        // Додайте тут інші елементи, які вам потрібні

        imageDiv.appendChild(imageInfoDiv);
        searchGalleryContainer.appendChild(imageDiv);
      }
    });
  } catch (error) {
    console.error('Помилка отримання даних Firestore:', error);
  }
}

// Отримання форми та елементів для пошуку
const searchForm = document.forms['searchForm'];
const searchInput = searchForm.querySelector('input');
const searchButton = searchForm.querySelector('button');
const mainGallerySection = document.getElementById('mainGallery');
const searchGalleryContainer = document.getElementById('searchGallery');

// Додавання слухача подій для кнопки пошуку
searchButton.addEventListener('click', () => {
  const searchText = searchInput.value;

  // Змінити текст кнопки на "Скасувати"
  searchButton.textContent = 'Скасувати';

  if (mainGallerySection.style.display === 'none') {
    // Приховати елемент searchGalleryContainer та відображення mainGallery
    mainGallerySection.style.display = 'block';
    searchGalleryContainer.style.display = 'none';

    // Змінити текст кнопки на "Пошук" при скасуванні
    searchButton.textContent = 'Пошук';

    // Очистити поле вводу при скасуванні
    searchInput.value = '';
  } else {
    // Виклик функції пошуку
    searchImagesByDescription(searchText);

    // Приховати елемент mainGallery при виконанні пошуку
    mainGallerySection.style.display = 'none';

    // Показати елемент searchGalleryContainer при виконанні пошуку
    searchGalleryContainer.style.display = 'flex';
  }
});

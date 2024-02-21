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


async function deleteImage(imageURL, imageName) {
  try {
    // Отримати посилання на файл у Firebase Storage
    const storageRef = sRef(getStorage(), 'Images/' + imageName);
    const fileURL = await getDownloadURL(storageRef);

    // Видалити файл з Firebase Storage
    await deleteObject(storageRef);
    console.log('Файл успішно видалено з Firebase Storage');

    // Видалити документ з колекції Firestore
    const imageQuery = query(collection(clouddb, 'ImageLinks'), where('ImageURL', '==', imageURL));
    const querySnapshot = await getDocs(imageQuery);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log('Документ успішно видалено з колекції ImageLinks');
      });
    } else {
      console.log('Документи не знайдено для видалення');
    }
  } catch (error) {
    console.error('Помилка видалення:', error);
  }
}




async function displayImages(auth, clouddb) {
  const galleryContainer = document.getElementById('userGallery');
  galleryContainer.innerHTML = '';

  try {
    const imageLinksCollection = collection(clouddb, 'ImageLinks');
    const querySnapshot = await getDocs(imageLinksCollection);

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      
      // Перевірка, чи фото належить поточному користувачеві
      if (data.userId === auth.currentUser.uid) {
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

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.classList.add('delete-button');

       deleteButton.addEventListener('click', async () => {
  // Викликаємо підтвердження перед видаленням
  const userConfirmed = confirm('Ви впевнені, що хочете видалити це зображення?');
  if (userConfirmed) {
    // Викликаємо функцію для видалення запису з колекції
    await deleteImage(data.ImageURL, data.ImgName);

    // Оновлюємо галерею після видалення
    await displayImages(auth, clouddb);
  }
});


        imageInfoDiv.appendChild(deleteButton);
        imageDiv.appendChild(imageInfoDiv);
        galleryContainer.appendChild(imageDiv);
      }
    });
  } catch (error) {
    console.error('Помилка отримання даних Firestore:', error);
  }
}

// Виклик функції displayImages() при завантаженні сторінки
window.onload = () => displayImages(auth, clouddb);

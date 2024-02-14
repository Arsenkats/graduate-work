  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  
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
  const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'ua'
const provider = new GoogleAuthProvider();


const googleLogin = document.getElementById("registration");
googleLogin.addEventListener("click", function () {
    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "../profile.html"
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
})

function updateUI(user) {
  const registrationButton = document.getElementById('registration');
  const loginList = document.getElementById('log-in-list');

  if (user) {
    // Користувач автентифікований, ховаємо кнопку реєстрації
    if (registrationButton) {
      registrationButton.style.display = 'none';
    }

    // Показуємо список log-in-list та заповнюємо його інформацією про користувача
    if (loginList) {
      loginList.style.display = 'flex'; // Змінено display на 'flex'
    }
  } else {
    // Користувач не автентифікований, відображаємо кнопку реєстрації
    if (registrationButton) {
      registrationButton.style.display = 'block';
    }

    // Ховаємо список log-in-list
    if (loginList) {
      loginList.style.display = 'none';
    }
  }
}

onAuthStateChanged(auth, (user) => {
  updateUI(user);
});


const exitButton = document.getElementById('exit');

exitButton.addEventListener('click', () => {
  // Використовуйте функцію signOut() для виходу з акаунту
  signOut(auth).then(() => {
    // Якщо вихід успішний, можна виконати додаткові дії
    alert('Ви вийшли з акаунту.');
    window.location.href = '../index.html'; // Перенаправлення на головну сторінку або іншу
  }).catch((error) => {
    // Обробка помилок в разі неуспішного виходу
    console.error('Помилка виходу:', error);
  });
});


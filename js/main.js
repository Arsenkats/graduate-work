  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
  import { getFirestore, doc, getDoc, setDoc, collection, addDoc }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
  
  
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
  const clouddb = getFirestore();


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
  const notLogInSection = document.getElementById('not-log-in');
  const profileInfoSection = document.getElementById('profile-info');

  if (user) {
    // Користувач автентифікований, ховаємо кнопку реєстрації
    if (registrationButton) {
      registrationButton.style.display = 'none';
    }

    // Показуємо список log-in-list та заповнюємо його інформацією про користувача
    if (loginList) {
      loginList.style.display = 'flex'; // Змінено display на 'flex'
    }

    // Показуємо секцію для авторизованого користувача
    if (profileInfoSection) {
      profileInfoSection.style.display = 'block';
    }

    // Ховаємо секцію для неавторизованого користувача
    if (notLogInSection) {
      notLogInSection.style.display = 'none';
    }
  } else {
    // Користувач не автентифікований, відображаємо кнопку реєстрації
    if (registrationButton) {
      registrationButton.style.display = 'block'; // Змінено display на 'block'
    }

    // Ховаємо список log-in-list
    if (loginList) {
      loginList.style.display = 'none';
    }

    // Показуємо секцію для неавторизованого користувача
    if (notLogInSection) {
      notLogInSection.style.display = 'block';
    }

    // Ховаємо секцію для авторизованого користувача
    if (profileInfoSection) {
      profileInfoSection.style.display = 'none';
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

// =======================UPLOAD PHOTO=====================================

 var files = [];
  var reader = new FileReader();
  
  var namebox = document.getElementById('namebox');
  var extlab = document.getElementById('extlab');
  var myimg = document.getElementById('myimg');
  var proglab = document.getElementById('upprogres');
  var SelBtn = document.getElementById('selbtn');
  var desbox = document.getElementById('desbox');
  var UpBtn = document.getElementById('upbtn');
  
  var input = document.createElement('input');
  input.type = 'file';

  input.onchange = e =>{
      files = e.target.files;

      var extention = GetFileExt(files[0]);
      var name = GetFileName(files[0]);

      namebox.value= name;
      extlab.innerHTML = extention;

      reader.readAsDataURL(files[0]);
  }
  
  reader.onload = function(){
      myimg.src = reader.result;
  }
  
  SelBtn.onclick = function(){
      input.click();
  }
  
  function  GetFileExt(file){
      var temp = file.name.split('.');
      var ext = temp.slice((temp.length - 1), (temp.length));
      return '.' + ext[0];
  } 
  
  function GetFileName(file){
      var temp = file.name.split('.');
      var fname = temp.slice(0, -1).join('.');
      return fname;
} 

// ====================UPLOAD PROCESS=======================

async function Uploadprocess() {
  var ImgToUpload = files[0];

  var ImgName = namebox.value + extlab.innerHTML;

  const metaData = {
    contentType: ImgToUpload.type
  }

  const storage = getStorage();
  const storageRef = sRef(storage, "Images/"+ImgName);
  const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);
  UploadTask.on('state-changed', (snapshot) => {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    proglab.innerHTML = "Upload " + progress + "%";
  },
    (error) => {
      alert("Помилка: зображення не завантажилося!");
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
        SaveURLtoFirestore(downloadURL);
      });
    }
  );
  
}

// ====================Function for FIRESTORE DATABASE===============================
// ====================Function for FIRESTORE DATABASE===============================
async function SaveURLtoFirestore(url) {
  var name = namebox.value;
  var ext = extlab.innerHTML;
  var ImgDescription = desbox.value;
  var userId = auth.currentUser ? auth.currentUser.uid : null; // Отримати ідентифікатор користувача
  var userDisplayName = auth.currentUser ? auth.currentUser.displayName : null; // Отримати ім'я користувача

  var ref = doc(clouddb, "ImageLinks/" + name);

  await setDoc(ref, {
    ImgName: (name + ext),
    ImgDescription: ImgDescription,
    ImageURL: url,
    userId: userId, // Додати ідентифікатор користувача до документа
    userDisplayName: userDisplayName // Додати ім'я користувача до документа
  });
  location.reload();
}




UpBtn.onclick = Uploadprocess;



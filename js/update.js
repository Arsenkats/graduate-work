import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
  import { getAuth, GoogleAuthProvider, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  
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

const user = auth.currentUser;

function updateUserProfile(user) {
  const userNameElement = document.querySelector("#userName");
  const userNameSectionElement = document.querySelector("#userNameSection");
  const userProfilePictureElement = document.querySelector("#userProfilePicture")

  if (userNameElement) {
    const userName = user.displayName;
    userNameElement.textContent = userName;
  }

  if (userNameSectionElement) {
    const userName = user.displayName;
    userNameSectionElement.textContent = userName;
  }

  if (userProfilePicture) {
    const userProfilePicture = user.photoURL;
    userProfilePictureElement.src = userProfilePicture;
  }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserProfile(user);
        const uid = user.uid;
        return uid;
    } else {
       
    }
});
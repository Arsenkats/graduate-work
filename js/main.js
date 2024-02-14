  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup,} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  
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

function updateUserProfile(user) {
    const userName = user.displayName;

    document.getElementById("userName").textContent = userName;
}

updateUserProfile()
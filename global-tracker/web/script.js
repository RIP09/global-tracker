// ==============================
// FIREBASE CONFIG
// Replace with your Firebase project config
// ==============================

const firebaseConfig = {
    apiKey: "AIzaSyDT8P_hSxZon_HYD7ODiZ_u9YMmnhiEmYg",
    authDomain: "globaltracker-c7cc5.firebaseapp.com",
    databaseURL: "https://globaltracker-c7cc5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "globaltracker-c7cc5",
    storageBucket: "globaltracker-c7cc5.firebasestorage.app",
    messagingSenderId: "971232520372",
    appId: "1:971232520372:web:3805eebedf0f7e798d0fe1",
    measurementId: "G-2JNF0TZQ72"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();


// ==============================
// MAP INITIALIZATION (Leaflet)
// ==============================

let map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// Store markers for users
let markers = {};


// ==============================
// LOGIN FUNCTION
// ==============================

function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
  .then(() => {
    alert("Login successful");
  })
  .catch(err => {
    alert(err.message);
  });

}


// ==============================
// REGISTER FUNCTION
// ==============================

function register() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
  .then(() => {
    alert("Account created");
  })
  .catch(err => {
    alert(err.message);
  });

}


// ==============================
// LOGOUT
// ==============================

function logout(){
  auth.signOut();
}


// ==============================
// AUTH STATE LISTENER
// ==============================

auth.onAuthStateChanged(user => {

  if(user){

    console.log("User logged in:", user.uid);

    startLocationSharing(user.uid);
    listenForLocations();

  }else{

    console.log("User logged out");

  }

});


// ==============================
// SHARE USER LOCATION
// ==============================

function startLocationSharing(userId){

  if(!navigator.geolocation){
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.watchPosition(position => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    console.log("Location:", lat, lng);

    db.ref("locations/" + userId).set({
      lat: lat,
      lng: lng,
      timestamp: Date.now()
    });

  },
  error => {
    console.error(error);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  });

}


// ==============================
// LISTEN FOR LIVE LOCATIONS
// ==============================

function listenForLocations(){

  db.ref("locations").on("value", snapshot => {

    const users = snapshot.val();

    if(!users) return;

    for(let id in users){

      const lat = users[id].lat;
      const lng = users[id].lng;

      if(!markers[id]){

        markers[id] = L.marker([lat,lng])
        .addTo(map)
        .bindPopup("User: " + id);

      }else{

        markers[id].setLatLng([lat,lng]);

      }

    }

  });

}

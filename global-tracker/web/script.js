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


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let map = L.map("map").setView([20,0],2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
 attribution:"© OpenStreetMap"
}).addTo(map);

let markers={};

function login(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

auth.signInWithEmailAndPassword(email,password);

}

function register(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

auth.createUserWithEmailAndPassword(email,password);

}

auth.onAuthStateChanged(user=>{

if(user){

startTracking(user.uid);
listenLocations();

}

});

function startTracking(uid){

navigator.geolocation.watchPosition(pos=>{

const lat=pos.coords.latitude;
const lng=pos.coords.longitude;

db.ref("locations/"+uid).set({
lat:lat,
lng:lng,
time:Date.now()
});

});

}

function listenLocations(){

db.ref("locations").on("value",snap=>{

const users=snap.val();

for(let id in users){

const lat=users[id].lat;
const lng=users[id].lng;

if(!markers[id]){

markers[id]=L.marker([lat,lng]).addTo(map);

}else{

markers[id].setLatLng([lat,lng]);

}

}

});

}

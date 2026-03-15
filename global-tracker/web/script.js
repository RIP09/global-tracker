// ------------------ Firebase Config ------------------
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
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

firebase.database().ref("locations").on("value", snapshot => {

  const data = snapshot.val();

  for (let id in data) {

    const lat = data[id].lat;
    const lng = data[id].lng;

    if (!markers[id]) {
      markers[id] = L.marker([lat, lng]).addTo(map);
    } else {
      markers[id].setLatLng([lat, lng]);
    }

  }

});

// ------------------ Leaflet Map ------------------
let map;
let markers = {};

// Initialize map
function initMap(lat=20, lon=0){
    if(map) return; // already initialized
    map = L.map('map').setView([lat, lon], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// ------------------ User Auth ------------------
function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email,password)
    .then(user=>{
        alert("Logged in as "+email);
        shareLocation(email);
    })
    .catch(e=>alert(e.message));
}

function register(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email,password)
    .then(user=>{
        alert("Registered: "+email);
        shareLocation(email);
    })
    .catch(e=>alert(e.message));
}

// ------------------ Share Location ------------------
function shareLocation(user){
    if(!navigator.geolocation){
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.watchPosition(pos=>{
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        db.ref("locations/"+user).set({lat, lon, time: Date.now()});

        initMap(lat, lon);
    }, err=>{
        alert("Allow location access!");
    });
}

// ------------------ Multi-User Live Map ------------------
db.ref("locations").on("value", snapshot=>{
    const data = snapshot.val();
    if(!map) initMap();

    // Remove old markers
    for(let key in markers){
        map.removeLayer(markers[key]);
    }
    markers = {};

    // Add markers for each user
    for(let user in data){
        const loc = data[user];
        markers[user] = L.marker([loc.lat, loc.lon])
            .addTo(map)
            .bindPopup(user);
    }
});

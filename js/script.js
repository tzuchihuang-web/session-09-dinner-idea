// Dinner options with search terms
const dinnerOptions = [
    { name: 'Pizza', searchTerm: 'pizza restaurant' },
    { name: 'Pasta', searchTerm: 'italian restaurant' },
    { name: 'Sushi', searchTerm: 'sushi restaurant' },
    { name: 'Burger', searchTerm: 'burger restaurant' },
    { name: 'Salad', searchTerm: 'salad restaurant healthy' },
    { name: 'Tacos', searchTerm: 'mexican restaurant' },
    { name: 'Stir Fry', searchTerm: 'chinese restaurant' },
    { name: 'Curry', searchTerm: 'indian restaurant' }
];

let map;
let service;
let currentPosition;

// Initialize the wheel
function initializeWheel() {
    const wheel = document.getElementById('dinner-wheel');
    const sliceAngle = 360 / dinnerOptions.length;
    
    dinnerOptions.forEach((option, index) => {
        const slice = document.createElement('div');
        slice.style.position = 'absolute';
        slice.style.width = '100%';
        slice.style.height = '100%';
        slice.style.transform = `rotate(${index * sliceAngle}deg)`;
        slice.style.clipPath = `polygon(50% 50%, 50% 0%, ${50 + Math.cos(sliceAngle * Math.PI / 180) * 50}% ${50 - Math.sin(sliceAngle * Math.PI / 180) * 50}%)`;
        slice.style.backgroundColor = `hsl(${index * (360 / dinnerOptions.length)}, 70%, 60%)`;
        
        const text = document.createElement('span');
        text.textContent = option.name;
        text.style.position = 'absolute';
        text.style.left = '60%';
        text.style.top = '20%';
        text.style.transform = 'rotate(90deg)';
        text.style.color = 'white';
        text.style.fontWeight = 'bold';
        
        slice.appendChild(text);
        wheel.appendChild(slice);
    });
}

// Spin the wheel
function spinWheel() {
    const wheel = document.getElementById('dinner-wheel');
    const button = document.getElementById('spin-button');
    const result = document.getElementById('dinner-choice');
    
    button.disabled = true;
    
    // Random number of rotations (3-5 full rotations)
    const rotations = 3 + Math.random() * 2;
    // Random final angle
    const finalAngle = Math.random() * 360;
    const totalRotation = (rotations * 360) + finalAngle;
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // Calculate which option was selected
    setTimeout(() => {
        const selectedIndex = Math.floor(((360 - (finalAngle % 360)) / (360 / dinnerOptions.length))) % dinnerOptions.length;
        result.textContent = dinnerOptions[selectedIndex];
        button.disabled = false;
    }, 3000);
}

// Initialize Google Maps
function initMap() {
    // Request user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Initialize map
                map = new google.maps.Map(document.getElementById('map'), {
                    center: currentPosition,
                    zoom: 14
                });

                // Add marker for user's location
                new google.maps.Marker({
                    position: currentPosition,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                });

                // Initialize Places service
                service = new google.maps.places.PlacesService(map);
            },
            (error) => {
                console.error('Error getting location:', error);
                document.getElementById('map').innerHTML = 'Error getting your location. Please enable location services.';
            }
        );
    } else {
        document.getElementById('map').innerHTML = 'Geolocation is not supported by your browser.';
    }
}

// Search for nearby restaurants
function searchNearbyRestaurants(searchTerm) {
    const request = {
        location: currentPosition,
        radius: '1500', // Search within 1.5km
        type: ['restaurant'],
        keyword: searchTerm,
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Clear existing markers
            clearMarkers();
            // Display results
            displayResults(results);
        }
    });
}

let markers = [];

// Clear existing markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Display restaurant results
function displayResults(results) {
    const listElement = document.getElementById('restaurants-list');
    listElement.innerHTML = '';

    results.slice(0, 5).forEach((place, index) => {
        // Add marker
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);

        // Create list item
        const item = document.createElement('div');
        item.className = 'restaurant-item';
        item.innerHTML = `
            <div class="restaurant-info">
                <h3>${place.name}</h3>
                <p>${place.vicinity}</p>
            </div>
            <div class="restaurant-rating">
                ${place.rating ? '⭐ ' + place.rating : 'N/A'}
            </div>
        `;

        // Add click event to center map on restaurant
        item.addEventListener('click', () => {
            map.setCenter(place.geometry.location);
            map.setZoom(16);
        });

        listElement.appendChild(item);
    });
}

// Modified spinWheel function to include restaurant search
function spinWheel() {
    const wheel = document.getElementById('dinner-wheel');
    const button = document.getElementById('spin-button');
    const result = document.getElementById('dinner-choice');
    
    button.disabled = true;
    
    const rotations = 3 + Math.random() * 2;
    const finalAngle = Math.random() * 360;
    const totalRotation = (rotations * 360) + finalAngle;
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(() => {
        const selectedIndex = Math.floor(((360 - (finalAngle % 360)) / (360 / dinnerOptions.length))) % dinnerOptions.length;
        const selectedOption = dinnerOptions[selectedIndex];
        result.textContent = selectedOption.name;
        button.disabled = false;
        
        // Search for nearby restaurants based on selection
        searchNearbyRestaurants(selectedOption.searchTerm);
    }, 3000);
}

// Initialize when the page loads
window.addEventListener('load', () => {
    initializeWheel();
    initMap();
    document.getElementById('spin-button').addEventListener('click', spinWheel);
});
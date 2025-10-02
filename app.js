// Cities with their timezones and coordinates
const CITIES = [
    { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
    { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
    { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
    { name: 'London', timezone: 'Europe/London', country: 'UK' },
    { name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
    { name: 'New York', timezone: 'America/New_York', country: 'USA' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA' },
    { name: 'Chicago', timezone: 'America/Chicago', country: 'USA' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
    { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong' },
    { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Thailand' },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey' },
    { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
    { name: 'Cairo', timezone: 'Africa/Cairo', country: 'Egypt' },
    { name: 'Johannesburg', timezone: 'Africa/Johannesburg', country: 'South Africa' }
];

// Unsplash API configuration (using public access)
const UNSPLASH_ACCESS_KEY = 'hG38e4msUS7eVVPNlf3T2t9ABIl4icQjD15Qvm5BFas'
// State
let userLocation = null;
let updateInterval = null;

// Initialize the app
async function init() {
    showStatus('Initializing...');
    await detectUserLocation();
    updateDisplay();

    // Update every minute
    updateInterval = setInterval(updateDisplay, 60000);
}

// Detect user's location and timezone
async function detectUserLocation() {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Try to get city name from timezone
        const cityName = timezone.split('/').pop().replace('_', ' ');

        userLocation = {
            city: cityName,
            timezone: timezone
        };

        showStatus('Location detected');
    } catch (error) {
        console.error('Error detecting location:', error);
        userLocation = {
            city: 'Unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        showStatus('Using system timezone');
    }
}

// Check if it's daytime in a given timezone
function isDaytime(timezone) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit'
    });
    const hour = parseInt(timeString);

    // Consider daytime as 6 AM to 6 PM
    return hour >= 6 && hour < 18;
}

// Get formatted time for a timezone
function getFormattedTime(timezone) {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Find a city where it's the opposite (day/night) of user's current time
function findOppositeCity() {
    const userIsDaytime = isDaytime(userLocation.timezone);

    // Filter cities that are in opposite time (day/night)
    const oppositeCities = CITIES.filter(city =>
        isDaytime(city.timezone) !== userIsDaytime
    );

    if (oppositeCities.length === 0) {
        // Fallback to any city if no opposite found
        return CITIES[Math.floor(Math.random() * CITIES.length)];
    }

    // Return a random city from the opposite list
    return oppositeCities[Math.floor(Math.random() * oppositeCities.length)];
}

// Fetch image from Unsplash
async function fetchCityImage(cityName, isDaytime) {
    const timeOfDay = isDaytime ? 'day' : 'night';

    // Check if API key is set
    if (UNSPLASH_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        console.warn('No Unsplash API key set. Please add your API key to get city-specific images.');
        console.warn('Get a free key at: https://unsplash.com/developers');
        // Return a placeholder
        return `https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80`;
    }

    try {
        const query = `${cityName} skyline cityscape buildings ${timeOfDay}`;
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch image');

        const data = await response.json();
        return data.urls.regular;
    } catch (error) {
        console.error('Error fetching image:', error);
        // Fallback to a generic cityscape
        return `https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80`;
    }
}

// Update the display
async function updateDisplay() {
    if (!userLocation) return;

    // Update user info
    const userIsDaytime = isDaytime(userLocation.timezone);
    document.getElementById('userCity').textContent = userLocation.city;
    document.getElementById('userTime').textContent = getFormattedTime(userLocation.timezone);
    document.getElementById('userTimezone').textContent = userLocation.timezone;

    // Set background image for user location section
    const userImageUrl = await fetchCityImage(userLocation.city, userIsDaytime);
    document.getElementById('userInfo').style.backgroundImage = `url('${userImageUrl}')`;

    // Find opposite city (opposite day/night from user)
    const destinationCity = findOppositeCity();
    const destinationIsDaytime = isDaytime(destinationCity.timezone);

    // Update title based on what we're showing (the opposite of user's time)
    const titleText = destinationIsDaytime ?
        `Right now, it's daytime in...` :
        `Right now, it's nighttime in...`;

    document.getElementById('displayTitle').textContent = titleText;
    document.getElementById('destinationCity').textContent = destinationCity.name;
    document.getElementById('destinationTime').textContent = getFormattedTime(destinationCity.timezone);
    document.getElementById('destinationTimezone').textContent = `${destinationCity.country} (${destinationCity.timezone})`;

    // Fetch and set background image for destination (opposite of user's time)
    showStatus('Loading image...');
    const destinationImageUrl = await fetchCityImage(destinationCity.name, destinationIsDaytime);
    document.getElementById('mainDisplay').style.backgroundImage = `url('${destinationImageUrl}')`;
    showStatus('');
}

// Show status message
function showStatus(message) {
    const statusEl = document.getElementById('status');
    if (message) {
        statusEl.textContent = message;
        statusEl.classList.add('show');
    } else {
        statusEl.classList.remove('show');
        setTimeout(() => {
            statusEl.textContent = '';
        }, 300);
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

# Where Is It Daylight?

A web app that shows you where in the world it's currently daytime or nighttime, based on your local time.

## Features

- Automatically detects your timezone and local time
- Shows a beautiful city where it's the opposite time of day (if it's night for you, shows a city in daytime, and vice versa)
- Dynamic background images from Unsplash
- Real-time updates every minute
- Responsive design for all devices

## How It Works

1. **Detects Your Location**: Uses your browser's timezone to determine your local time
2. **Calculates Day/Night**: Determines if it's daytime (6 AM - 6 PM) or nighttime for you
3. **Finds Opposite City**: Selects a random city from around the world where it's the opposite time
4. **Shows Beautiful Images**: Fetches relevant daytime or nighttime city images from Unsplash

## Setup

### Option 1: Quick Start (No API Key)

1. Open `index.html` in your web browser
2. The app will work immediately using Unsplash Source (free, no key required)

### Option 2: Better Image Quality (With API Key)

For higher quality and more relevant images:

1. Get a free Unsplash API key:
   - Go to https://unsplash.com/developers
   - Create an account and register a new application
   - Copy your Access Key

2. Edit `app.js`:
   - Find the line: `const UNSPLASH_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';`
   - Replace `YOUR_ACCESS_KEY_HERE` with your actual API key

3. Open `index.html` in your browser

## Local Development

Simply open `index.html` in any modern web browser. No build process or server required!

For a better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Customization

### Adding More Cities

Edit the `CITIES` array in `app.js`:

```javascript
const CITIES = [
    { name: 'Your City', timezone: 'Region/City', country: 'Country' },
    // ... more cities
];
```

### Changing Day/Night Hours

Modify the `isDaytime()` function in `app.js`:

```javascript
// Current: 6 AM to 6 PM is daytime
return hour >= 6 && hour < 18;
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT License - Feel free to use and modify!

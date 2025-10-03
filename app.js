// Create animated stars
function createStars() {
  const starsContainer = document.getElementById("stars");
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";
    starsContainer.appendChild(star);
  }
}

createStars();

// Enter key support
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchDestination();
    }
  });

function searchFor(destination) {
  document.getElementById("searchInput").value = destination;
  searchDestination();
}

async function searchDestination() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const container = document.getElementById("resultsContainer");
  container.innerHTML =
    '<div class="loading"><div class="spinner"></div>Loading amazing content...</div>';
  container.scrollIntoView({ behavior: "smooth" });

  try {
    // Fetch images and weather in parallel
    const [images, weather] = await Promise.all([
      fetchImages(query),
      fetchWeather(query),
    ]);

    displayResults(query, images, weather);
  } catch (error) {
    container.innerHTML = `<div class="error">Unable to fetch data. Please try again or check your API keys.</div>`;
  }
}

async function fetchImages(query) {
  const UNSPLASH_KEY = "_yEjCeeQVizt9lTesoxoZcVy3UkxPC5NmB_QLlutHWw";
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${UNSPLASH_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch images");
  const data = await response.json();
  return data.results;
}

async function fetchWeather(query) {
  const WEATHER_KEY = "fb1071f03468fa6779d5260127e4ce9a";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${WEATHER_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch weather");
  return await response.json();
}

function displayResults(query, images, weather) {
  const container = document.getElementById("resultsContainer");

  let html = `
                <h2 class="section-title">Exploring ${query}</h2>
                
                <div class="weather-card">
                    <h3 style="font-size: 2em; margin-bottom: 20px;">Current Weather</h3>
                    <div class="weather-main">
                        <div>
                            <div class="weather-temp">${Math.round(
                              weather.main.temp
                            )}°C</div>
                            <div style="font-size: 1.5em; color: var(--text-dim); text-transform: capitalize;">
                                ${weather.weather[0].description}
                            </div>
                        </div>
                        <div class="weather-icon">${getWeatherIcon(
                          weather.weather[0].main
                        )}</div>
                    </div>
                    <div class="weather-details">
                        <div class="weather-detail-item">
                            <div class="weather-detail-label">Feels Like</div>
                            <div class="weather-detail-value">${Math.round(
                              weather.main.feels_like
                            )}°C</div>
                        </div>
                        <div class="weather-detail-item">
                            <div class="weather-detail-label">Humidity</div>
                            <div class="weather-detail-value">${
                              weather.main.humidity
                            }%</div>
                        </div>
                        <div class="weather-detail-item">
                            <div class="weather-detail-label">Wind Speed</div>
                            <div class="weather-detail-value">${
                              weather.wind.speed
                            } m/s</div>
                        </div>
                        <div class="weather-detail-item">
                            <div class="weather-detail-label">Pressure</div>
                            <div class="weather-detail-value">${
                              weather.main.pressure
                            } hPa</div>
                        </div>
                    </div>
                </div>

                <h3 style="font-size: 2em; margin-bottom: 30px; text-align: center;">Photo Gallery</h3>
                <div class="gallery-grid">
            `;

  images.forEach((img) => {
    html += `
                    <div class="gallery-item" onclick="openModal('${
                      img.urls.regular
                    }')">
                        <img src="${img.urls.small}" alt="${
      img.alt_description || query
    }">
                        <div class="gallery-overlay">
                            <div style="font-weight: 600; margin-bottom: 5px;">📷 by ${
                              img.user.name
                            }</div>
                            <div style="font-size: 0.9em; opacity: 0.8;">Click to view full size</div>
                        </div>
                    </div>
                `;
  });

  html += "</div>";
  container.innerHTML = html;
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
  };
  return icons[condition] || "🌤️";
}

function openModal(imageUrl) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = imageUrl;
  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("imageModal").classList.remove("active");
}

// Close modal on background click
document.getElementById("imageModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Newsletter subscription
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector(".newsletter-input").value;
  alert("Thank you for subscribing! We'll send travel updates to " + email);
  event.target.reset();
}

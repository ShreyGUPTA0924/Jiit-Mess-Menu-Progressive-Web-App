// DOM Elements
const days = document.querySelectorAll(".day-choice"); // Day picker buttons
const menuContainer = document.getElementById("actual-menu"); // Menu container

let messMenu = {}; // To store the JSON data

// Fetch menu data from menu.json
async function fetchMenu() {
    try {
        const response = await fetch("menu.json");
        messMenu = await response.json(); // Parse JSON data
        displayMenu("Monday"); // Display Monday's menu by default
        setSelectedDay(0); // Highlight Monday button as selected
    } catch (error) {
        console.error("Failed to fetch menu data:", error);
        menuContainer.innerHTML = "<p class='error-message'>Failed to load the menu. Please try again later.</p>";
    }
}

// Function to display menu for a given day
function displayMenu(day) {
    const meals = messMenu[day]; // Get meals for the selected day

    if (!meals) {
        menuContainer.innerHTML = `<p class="error-message">No menu available for ${day}.</p>`;
        return;
    }

    // Adjust timings for Sunday
    const breakfastTiming = day === "Sunday" ? "7:30AM - 9:30AM" : "7:30AM - 9:00AM";
    const lunchTiming = day === "Sunday" ? "12PM - 2:30PM" : "12PM - 2:00PM";
    const dinnerTiming = "7:30PM - 9:30PM"; // Dinner timing is constant for all days

    // Generate HTML for Breakfast, Lunch, and Dinner containers (with loading effect initially)
    const breakfastHTML = generateMealHTML("Breakfast", breakfastTiming, "loading", "B");
    const lunchHTML = generateMealHTML("Lunch", lunchTiming, "loading", "L");
    const dinnerHTML = generateMealHTML("Dinner", dinnerTiming, "loading", "D");

    // Display the structure of the containers immediately
    menuContainer.innerHTML = breakfastHTML + lunchHTML + dinnerHTML;

    // After 2 seconds, load the actual menu items
    setTimeout(() => {
        const breakfastItems = meals.B;
        const lunchItems = meals.L;
        const dinnerItems = meals.D;

        // Update only the items inside each container
        document.querySelector("#B .menu__items").innerHTML = breakfastItems.map(item => `<div class="menu__item">${item}</div>`).join("");
        document.querySelector("#L .menu__items").innerHTML = lunchItems.map(item => `<div class="menu__item">${item}</div>`).join("");
        document.querySelector("#D .menu__items").innerHTML = dinnerItems.map(item => `<div class="menu__item">${item}</div>`).join("");

        // Remove loading effect after the menu items are displayed
        removeLoadingEffect();
    }, 1000); // Updated delay of 2 seconds to simulate loading time
}

// Helper function to generate meal section HTML with loading effect
function generateMealHTML(mealName, timing, status, id) {
    return `
    <div class="menu-category" id="${id}">
        <div class="menu-category-inner">
            <header class="menu-category__header">
                <span class="meal-name">${mealName}</span>
                <span class="meal-timing">${timing}</span>
            </header>
            <div class="menu__items">
                ${status === "loading" ? generateLoadingItems() : ""}
            </div>
        </div>
    </div>`;
}

// Function to generate loading effect items (glowing line)
function generateLoadingItems() {
    return `
        <div class="menu__item menu__item--loading"><div class="loading-line"></div></div>
        <div class="menu__item menu__item--loading"><div class="loading-line"></div></div>
        <div class="menu__item menu__item--loading"><div class="loading-line"></div></div>
        <div class="menu__item menu__item--loading"><div class="loading-line"></div></div>
        <div class="menu__item menu__item--loading"><div class="loading-line"></div></div>
    `;
}

// Function to remove loading effect (glowing line) after menu items are loaded
function removeLoadingEffect() {
    document.querySelectorAll('.menu__item--loading').forEach(item => item.classList.remove('menu__item--loading'));
}

// Function to set the selected day style
function setSelectedDay(index) {
    days.forEach((dayElement, i) => {
        if (i === index) {
            dayElement.classList.add("day-choice--selected"); // Highlight selected day
        } else {
            dayElement.classList.remove("day-choice--selected"); // Remove highlight
        }
    });
}

// Select modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");

// Add click event to all images inside the logo container
document.querySelectorAll(".logo img").forEach((img) => {
    img.addEventListener("click", (event) => {
        modal.style.display = "block";
        modalImg.src = event.target.src; // Set modal image source
        captionText.textContent = event.target.alt || "Image"; // Set caption (fallback to 'Image' if no alt)
    });
});

// Close modal on clicking the close button
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal on clicking outside the image
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Add click event listeners to all day buttons
days.forEach((dayElement, index) => {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    dayElement.addEventListener("click", () => {
        displayMenu(dayNames[index]); // Display the menu for the selected day
        setSelectedDay(index); // Update selected day highlight
    });
});

// Initial load
fetchMenu();

// Register the Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
} else {
    console.log('Service Workers are not supported in this browser.');
}

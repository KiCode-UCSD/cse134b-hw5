// ************ LIGHT/DARK MODE ************ //
const toggleContainer = document.getElementById("toggle_container");
const modeToggle = document.getElementById("mode_toggle");
const root = document.documentElement;
let selectedTheme = "dark";

document.addEventListener("DOMContentLoaded", init());
function init() {
    console.log(`DOM Content has loaded...`);

    // make button visible again (js is already loaded now)
    toggleContainer.style.opacity = 1;

    // load mode preference from localStorage
    try {
        selectedTheme = localStorage.getItem("theme");
        console.log(`saved preference is: ${selectedTheme}`);
    }
    catch {
        console.log(`localStorage fetch error. Theme defaults to: ${selectedTheme}`);
    }

    // set theme based on preference
    setTheme(selectedTheme);

    // update toggle button to match
    if (selectedTheme === "dark") {
        modeToggle.checked = true;
    }
    else if (selectedTheme === "light") {
        modeToggle.checked = false;
    }
    else {
        console.log("unexpected preference sent to selectedTheme");
    } 
}

function setTheme(mode) {
    // theme = mode
    console.log(`Set theme to: ${mode}`);
    console.log(root.classList.value);
    root.classList.value = mode;
}

// listen for toggle and change theme accordingly (store in localstorage)
modeToggle.addEventListener("change", (event) => {
    if (modeToggle.checked) {
        //console.log("user preference is dark mode");
        selectedTheme = "dark";
    }
    else {
        //console.log("user preference is light mode");
        selectedTheme = "light";
    }

    // Persistence is required when storage is available; 
    // when it is blocked, switching must still work on the current page
    try {
        // update preference in local storage
        localStorage.setItem("theme", selectedTheme);
        console.log(`User theme set to: ${selectedTheme}`);

        // update theme on page
        setTheme(selectedTheme);
    } catch (error) {
        console.warn("The theme preference could not be saved.");
    }
});

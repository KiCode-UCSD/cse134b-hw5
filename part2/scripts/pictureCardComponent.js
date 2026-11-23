// my custom html picture card element (for a hermia picture slideshow)

class PictureCard extends HTMLElement {
    static observedAttributes = ["visibility"];
    static NUM_PICTURES = 3;

    constructor() {
        super();
    }

    static getNumPictures() {
        return this.NUM_PICTURES;
    }

    // called on load of custom element on page
    connectedCallback() {
        console.log("Custom cat component loading...");
        
        // get picture-card custom element
        let pictureCardEl = document.querySelector("picture-card");

        // create heading element
        const headingEl = document.createElement("h4");
        headingEl.textContent = `Hermia Slideshow`;

        // create control buttons to go between pictures
        const controlsContainerEl = document.createElement("div");
        const prevButtonEl = document.createElement("button");
        prevButtonEl.setAttribute("id", "prev_button");
        prevButtonEl.textContent = `<`;

        const nextButtonEl = document.createElement("button");
        nextButtonEl.setAttribute("id", "next_button");
        nextButtonEl.textContent = `>`;

        // create container for cat pictures
        const imageContainerEl = document.createElement("div");
        imageContainerEl.setAttribute("id", "image_container");

        // create image element for picture slideshow
        const imageEl = document.createElement("img");
        imageEl.setAttribute("alt", "cute hermia");

        // create status message for cat picture
        const statusMessageEl = document.createElement("p");
        statusMessageEl.setAttribute("id", "component_status_msg");
        statusMessageEl.innerHTML = `Picture <span id="status_num">1</span>/3`;

        // append elements to DOM tree
        pictureCardEl.appendChild(headingEl);
        pictureCardEl.appendChild(controlsContainerEl);
        pictureCardEl.appendChild(imageContainerEl);

        controlsContainerEl.appendChild(prevButtonEl);
        controlsContainerEl.appendChild(nextButtonEl);

        imageContainerEl.appendChild(imageEl);
        imageContainerEl.appendChild(statusMessageEl);

        // set initial visibility to hidden
        toggleCard();
        //changeVisibilityStyle(pictureCardEl, "hidden");
    }

    // event triggered whenever toggleAttribute() is called to add, modify, or delete an attribute in observedAttributes
    attributeChangedCallback(name, oldValue, newValue) {
        //console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
        if (name === "visibility" && newValue === null) {
            console.log("visibility: shown");
            changeVisibilityStyle(this, "shown");
        }
        if (name === "visibility" && newValue === "") {
            console.log("visibility: hidden");
            changeVisibilityStyle(this, "hidden");
        }
    }

    /*  Use DOM methods to create the component’s interface, including a heading, a place to display the current item, 
            a control, and a status message. Use at least two sample items stored in JavaScript. 
        Add an event listener to a control inside the component so the visitor can switch items. 
        Update the displayed content and status without reloading the page. 
        For example, a fact panel could show the next fact and update its status to “Fact 2 of 3.” 
    */
}

document.addEventListener("DOMContentLoaded", init);

// TODO: implement global event handler with bubbled up events instead of localized event handlers
// initialize custom element and event listeners on DOM load
function init() {
    customElements.define("picture-card", PictureCard);

    const togglePictureCard = document.getElementById("picture_component_toggle");
    togglePictureCard.addEventListener("click", toggleCard);

    const statusNum = document.getElementById("status_num");

    const prevButton = document.getElementById("prev_button");
    prevButton.addEventListener("click", (event) => pictureControlHandler(event, "prev", statusNum));

    //const pictureCard = document.querySelector("picture-card");
    const nextButton = document.getElementById("next_button");
    nextButton.addEventListener("click", (event) => pictureControlHandler(event, "next", statusNum));

}

function pictureControlHandler(event, direction, statusNum) {
    //console.log(`Num pictures: ${PictureCard.getNumPictures()}`);

    let picNum = Number(statusNum.textContent);
    if (direction === "prev") {
        console.log(`${direction}...`);
        if (picNum > 1) {
            picNum--;

            //TODO: update picture
            loadImage(picNum);
        }
    }
    else if (direction === "next") {
        console.log(`${direction}...`);
        if (picNum < PictureCard.getNumPictures()) {
            picNum++;

            //TODO: update picture
            loadImage(picNum);
        }
    }
    else {
        throw new ErrorEvent("unrecognized picture control command.");
    }

    // replace status message with new message
    statusNum.textContent = picNum;
}

/*  List that attribute in observedAttributes and use attributeChangedCallback() to update the component when the attribute changes. 
    Make the effect visible in both states. For example, toggling a compact attribute could hide or reveal extra details about the current item.
*/
// called on click of "picture_component_toggle" button
function toggleCard() {
    const pictureCard = document.querySelector("picture-card");
    pictureCard.toggleAttribute("visibility");
}

// triggered by attributeChangedCallback() on PictureCard. Toggles visibility of PictureCard element based on toggle button
function changeVisibilityStyle(elem, visibility) {
    const toggleButton = document.getElementById("picture_component_toggle");

    if (visibility === "shown") {
        // TODO: just for visibility, change later
        elem.style.border = "3px solid green";
        
        // show all child elements of component
        const children = elem.children;
        for (const child of children) {
            child.style = "display: block";
        }

        // update toggle button text
        toggleButton.textContent = "Hide Pictures";

        // load in picture at current index
        console.log("attempt load initial image");
        const statusNum = document.getElementById("status_num");
        let picNum = Number(statusNum.textContent);
        loadImage(picNum);
    }
    if (visibility === "hidden") {
        // TODO: just for visibility, change later
        elem.style.border = "3px solid red";

        // hide all child elements of component
        const children = elem.children;
        for (const child of children) {
            child.style = "display: none";
        }

        // update toggle button text
        toggleButton.textContent = "Show Pictures";
    }
}

// fetch image w HTTP GET request from API Endpoint (aka AJAX)
async function loadImage(imageNum) {
    console.log(`fetch image number ${imageNum}`);

    const assetPath = `./assets/hermia${imageNum}.JPG`;

    // Run these steps in order. If one throws an error, jump to catch.
    try {
        /* check validity of url
        if (!URL.canParse(assetPath, "C:/Users/kiann/Documents/UCSD/CSE134B/hwk5/part2/")) {
            console.log("ERROR: bad URL");
            throw new Error("Could not parse URL");
        }*/

        // Send a GET request for sample.json in the same folder as this page.
        // Wait for the server to return a response before continuing.
        const response = await fetch(assetPath);
        // Even an HTTP error such as 404 returns a response. Check its status.

        if (!response.ok) {
            // Stop here and pass the status code to the catch block.
            throw new Error(`HTTP status ${response.status}`);
        }
        // Read the response body and parse the JSON into a JavaScript value.
        const data = await response.blob();
        // Check that message contains text. The ?. lets us check safely
        // even if the parsed response is null.
        
        if (data.type !== "image/jpeg") {
            // Send an unexpected response to the same error handler.
            throw new Error("Expected a message in the response.");
        }

        const imageObjURL = URL.createObjectURL(data);
        const image = document.createElement("img");
        image.src = imageObjURL;
        image.height = 200;
        image.width = 350;

        // replace image if one exists already, otherwise append normally
        const imageContainerEl = document.getElementById("image_container");
        if (imageContainerEl.firstElementChild !== null) {
            imageContainerEl.replaceChild(image, imageContainerEl.firstElementChild);
        }
        else {
            imageContainerEl.appendChild(image);
        }
        
        // The response passed both checks. Show the message in the Console.
        console.log(`image ${imageNum} loaded properly`);
    } 
    catch (error) {
      // Report the failure and its cause, such as a network error or invalid JSON.
      console.error(`Could not load image ${imageNum}.`, error);
    }
}

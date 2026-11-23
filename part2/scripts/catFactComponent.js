class RandomCatFact extends HTMLElement {
    static observedAttributes = ["hidden"];

    constructor() {
        super();
    }

    connectedCallback() {
        const catFactEl = document.querySelector("cat-fact");

        const catBtn = document.createElement("button");
        catBtn.setAttribute("id", "cat_fact_btn");
        catBtn.textContent = "Tell me something about cats";

        const statusMessage = document.createElement("p");
        statusMessage.setAttribute("id", "fact_status");
        statusMessage.setAttribute("role", "status");

        catFactEl.appendChild(catBtn);
        catFactEl.appendChild(statusMessage);

        // try to load visibility preference of fact component
        try {
            const visibility = localStorage.getItem("hw5-fact-visibility");
            console.log(`loaded visibility preference: ${visibility}`);
            if (visibility === "hidden") {
                toggleFact(null, catBtn);
            }
        }
        catch {}
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const factToggleBtn = document.getElementById("cat_facts_toggle");

        // if hidden is null, show cat fact component
        if (name === "hidden" && newValue === null) {
            console.log("hidden: false");
            factToggleBtn.textContent = "Hide Facts";
            this.style = "display: flex";
            
            // save preference to local storage
            localStorage.setItem("hw5-fact-visibility", "shown");
        }
        // if hidden is present (aka ""), hide cat fact component
        if (name === "hidden" && newValue === "") {
            console.log("hidden: true");
            factToggleBtn.textContent = "Show Facts";
            this.style = "display: none";    
            
            // save preference to local storage
            localStorage.setItem("hw5-fact-visibility", "hidden");
        }
    }
}

document.addEventListener("DOMContentLoaded", init);

// TODO: implement global event handler with bubbled up events instead of localized event handlers
// initialize custom element and event listeners on DOM load
function init() {
    customElements.define("cat-fact", RandomCatFact);

    const factBtn = document.getElementById("cat_fact_btn");
    factBtn.addEventListener("click", generateRandomFact);

    const factToggleBtn = document.getElementById("cat_facts_toggle");
    factToggleBtn.addEventListener("click", (event) => toggleFact(event, factToggleBtn));
}

function toggleFact(event, button) {
    console.log("toggle fact");
    const catFactEl = document.querySelector("cat-fact");
    // if (button.textContent === "Show Facts") {
    //     button.textContent = "Hide Facts";
    // }
    // else if (button.textContent === "Hide Facts") {
    //     button.textContent = "Show Facts";
    // }

    catFactEl.toggleAttribute("hidden");
}

async function generateRandomFact() {
    // update status message
    const status = document.getElementById("fact_status");
    status.textContent = "Loading fact...";

    // fetch fact
    const fact = await fetchCatFact(status);

    // get cat-facts custom element
    let catFactEl = document.querySelector("cat-fact");

    // create heading element
    const headingEl = document.createElement("h4");
    headingEl.textContent = `Did You Know?`;

    // create text element for cat fact
    const factEl = document.createElement("p");
    factEl.setAttribute("id", "fact_el");
    factEl.textContent = fact;

    const prevFactEl = document.getElementById("fact_el");

    if (prevFactEl) {
        // replace previous cat fact
        catFactEl.replaceChild(factEl, prevFactEl);
    }
    else {
        // append elements to DOM tree
        catFactEl.appendChild(headingEl);
        catFactEl.appendChild(factEl);
    }
    
}

async function fetchCatFact(status) {
    // Run these steps in order. If one throws an error, jump to catch.
    try {
        // Send a GET request for sample.json in the same folder as this page.
        // Wait for the server to return a response before continuing.
        const response = await fetch("https://catfact.ninja/fact");
        
        // Even an HTTP error such as 404 returns a response. Check its status.
        if (!response.ok) {
            // Stop here and pass the status code to the catch block.
            throw new Error(`HTTP status ${response.status}`);
        }

        // Read the response body and parse the JSON into a JavaScript value.
        const data = await response.json();
        
        // Check that message contains text. The ?. lets us check safely
        // even if the parsed response is null.
        if (typeof data?.fact !== "string") {
            // Send an unexpected response to the same error handler.
            throw new Error("Expected a message in the response.");
        }
        
        // The response passed both checks. Show the message in the Console.
        console.log(data.fact);
        status.textContent = "Yay! Fact has been received!";
        return data.fact;
    } 
    catch (error) {
        // Report the failure and its cause, such as a network error or invalid JSON.
        status.textContent = "Uh Oh! Something went wrong, please try again.";
        console.error("Could not load the message.", error);
        return "...";
    }
}

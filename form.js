/* disable regular validation messages
const form = document.querySelector("form");
form.setAttribute('novalidate', true); //got rid of all validation entirely, do not use
*/

let numSubmits = 0;
// constants for field
const fName = "name";
const fEmail = "email";
const fComments = "comments";
// constants for type
const tKey = "keyboard";
const tClick = "click";
// constants for error
const errEmpty = "Field was left empty";
const errInvalid = "Field was not in correct format";
const errUnderflow = "Field did not meet minimum length requirement";

const form = document.querySelector("form");
const button = document.querySelector("button");
const username = document.getElementById("name");
const email = document.getElementById("email");
const comments = document.getElementById("comments");
const errorHistory = document.getElementById("form_errors");

let formErrors = [];
class Entry {
    constructor(field, entryType, error, attemptNum) {
        this.field = field;
        this.entryType = entryType;
        this.error = error;
        this.attemptNum = attemptNum;
    }

    recordError() {
        formErrors.push(this);
    }
};

// add error records to form data on submit
form.addEventListener("submit", (event) => {
    let data = formErrors.map(entry => JSON.stringify(entry)).join('\n');
    errorHistory.value = data;
});

// handle popup validity messages on form submit attempt
button.addEventListener("click", (event) => {
    console.log(`click type detail: ${event.detail}...`);
    const emailText = email.value; // must be read inside event listener (aka after value has been input to form)
    const commentText = comments.value;
    numSubmits++;

    // check name validity
    username.setCustomValidity(""); // reset validity state before check (or else it will always be false after set once)
    if (username.validity.valid === false) {
        username.setCustomValidity("Name should be between 1-100 characters long");

        // add to form errors
        if (event.detail === 0) {
            let err = new Entry(fName, tKey, errEmpty, numSubmits);
            console.log(`Error Entry: ${err}`);
            err.recordError();
        }
        else if (event.detail === 1) {
            let err = new Entry(fName, tClick, errEmpty, numSubmits);
            console.log(`Error Entry: ${err}`);
            err.recordError();
        }
    }

    // check email validity
    email.setCustomValidity(""); // reset state
    if (emailText.length === 0) {
        email.setCustomValidity("Email is required");

        // add to form errors
        if (event.detail === 0) {
            let err = new Entry(fEmail, tKey, errEmpty, numSubmits);
            console.log(`Error Entry: ${err}`);
            err.recordError();
        }
        else if (event.detail === 1) {
            let err = new Entry(fEmail, tClick, errEmpty, numSubmits);
            console.log(`Error Entry: ${err}`);
            err.recordError();
        }
    }
    else if (email.validity.valid === false) {
        email.setCustomValidity("Email format is incorrect");

        // add to form errors
        if (event.detail === 0) {
            let err = new Entry(fEmail, tKey, errInvalid, numSubmits);
            console.log(`Error Entry: ${err}`);
            err.recordError();
        }
        else if (event.detail === 1) {
            let err = new Entry(fEmail, tClick, errInvalid, numSubmits);
            console.log(`Error Entry: ${err}`);
            err.recordError();
        }
    }

    // check comments validity
    comments.setCustomValidity("");
    if (commentText.length < 10) {
        comments.setCustomValidity("Comment must be longer than 10 characters");

        // add to form errors
        if (event.detail === 0) {
            let err = new Entry(fComments, tKey, errUnderflow, numSubmits);
            err.recordError();
        }
        else if (event.detail === 1) {
            let err = new Entry(fComments, tClick, errUnderflow, numSubmits);
            err.recordError();
        }
    }
});

const charLimit = comments.getAttributeNode("maxLength").value;
const charMessage = document.getElementById("character_message");
let numRemaining = document.getElementById("num_remaining");

// update comment's number of characters left every time a character is typed in comment box
comments.addEventListener("input", (event) => {
    let numLeft = charLimit - comments.value.length;
    numRemaining.textContent = numLeft;

    // approaching character threshold
    if (numLeft <= 10) {
        numRemaining.style.color = "red";
        charMessage.textContent = "Approaching character limit: "
        charMessage.style.color = "white";

        if (numLeft === 0) {
            numRemaining.textContent = "";
            charMessage.textContent = "Reached character limit!"
            charMessage.style.color = "red";
        }
    }
    else {
        // reset to normal
        numRemaining.style.color = "white";
        charMessage.textContent = "Characters remaining: ";
        charMessage.style.color = "white";
    }
});

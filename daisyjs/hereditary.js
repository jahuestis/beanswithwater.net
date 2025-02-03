
import Window from './window.js';
import Daisy from './daisy.js';


function readableDNA(dnaDecoded) {
    let dnaString = "";
    dnaString += dnaDecoded.slice(0, 4)
    dnaString += "(";
    for (let i = 8; i < 12; i++) {
        if (dnaDecoded[i] === '1') {
            dnaString += "D";
        } else {
            dnaString += "R";
        }
    }
    dnaString += ") ";
    dnaString += dnaDecoded.slice(4, 8);
    dnaString += "(";
    for (let i = 12; i < 16; i++) {
        if (dnaDecoded[i] === '1') {
            dnaString += "D";
        } else {
            dnaString += "R";
        }
    }
    dnaString += ")";

    return dnaString;
    
}

function drawFlower(canvas, petalCount, petalRadius, centerRadius) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const ctx = canvas.getContext("2d");
    // Draw the petals
    ctx.fillStyle = 'white';
    for (let i = 0; i < petalCount; i++) {
        let angle = (i * 2 * Math.PI) / petalCount; // Evenly space petals
        let petalX = x + Math.cos(angle) * (centerRadius);  // X position of petal
        let petalY = y + Math.sin(angle) * (centerRadius);  // Y position of petal
        ctx.beginPath();
        ctx.arc(petalX, petalY, petalRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw the center of the flower
    ctx.fillStyle = '#ffb700';
    ctx.beginPath();
    ctx.arc(x, y, centerRadius, 0, 2 * Math.PI); // Center circle
    ctx.fill();
}

class DaisyWindow extends Window {
    constructor(daisy, x, y, width, height, hasCloser = true) {
        super(daisy.name, x, y, width, height, hasCloser);
        this.daisy = daisy;
        this.initializeWindowBody();
    }

    initializeWindowBody() {
        const parentsP = document.createElement("p");
        if (this.daisy.parent1 === null) { 
            parentsP.textContent = "Parents: n/a";
        } else {
            parentsP.textContent = "Parents: " + this.daisy.parent1.name + ", " + this.daisy.parent2.name;
        }
        this.appendToBody(parentsP);

        const dnaP = document.createElement("p");
        dnaP.textContent = "DNA: " + readableDNA(this.daisy.dnaDecoded);
        
        this.appendToBody(dnaP);

        const expressedP = document.createElement("p");
        expressedP.textContent = "Expressed: " + this.daisy.expressed + " petals";
        this.appendToBody(expressedP);
        
        const daisyCanvas = document.createElement("canvas");
        daisyCanvas.classList.add("daisy-canvas");
        daisyCanvas.width = 400;
        daisyCanvas.height = 400;
        drawFlower(daisyCanvas, this.daisy.expressed, 60, 120);
        this.appendToBody(daisyCanvas);

        const breedDiv = document.createElement("div");
        breedDiv.classList.add("breed-div");

        const breedButton = document.createElement("button");
        breedButton.classList.add("breed-button");
        breedButton.textContent = "Breed";
        breedButton.addEventListener("click", () => {
            let parent2Name = this.element.querySelector(".breed-dropdown").value;
            let daisyWindow2 = daisyWindows.find(daisyWindow => daisyWindow.daisy.name === parent2Name)
            if (daisyWindow2 === undefined) {
                console.log("Parent 2 not found");
                return;
            }
            const parent1 = this.daisy;
            const parent2 = daisyWindow2.daisy;
            const childDaisy = parent1.breed(parent2, "Daisy " + daisyCounter++);
            const childDaisyWindow = new DaisyWindow(childDaisy, (this.x + daisyWindow2.x / 2 - windowWidth + (Math.random() * 200 - 100)), (this.y + daisyWindow2.y / 2) + 100 + Math.random() * 100, windowWidth, windowHeight);
            daisyWindows.push(childDaisyWindow);
            document.body.appendChild(childDaisyWindow.element);
            updateDasies();
        });

        const breedDropdown = document.createElement("select");
        breedDropdown.classList.add("breed-dropdown");

        breedDiv.appendChild(breedButton);
        breedDiv.appendChild(breedDropdown);
        this.appendToBody(breedDiv);
        this.updateBreedOptions(true);
    }

    updateBreedOptions(selectRandom = false) {
        const breedDropdown = this.element.querySelector(".breed-dropdown");
        const previousSelectedOption = breedDropdown.value;
        const options = daisyWindows.map(daisyWindow => daisyWindow.daisy.name);
        breedDropdown.innerHTML = "";
        for (let i = 0; i < options.length; i++) {
            const option = document.createElement("option");
            if (options[i] != this.daisy.name) {
                option.textContent = options[i];
                breedDropdown.appendChild(option);
            }
        }
        if (selectRandom) {
            breedDropdown.value = options[Math.floor(Math.random() * options.length)];
        } else if (options.includes(previousSelectedOption)) {
            breedDropdown.value = previousSelectedOption;
        }
    }
}


const windowWidth = 300;
const windowHeight = 300;

let daisyCounter = 0;

let daisyWindows = [];
// Create two initial daisy windows
for (let i = 0; i < 2; i++) {
    const daisyWindow = new DaisyWindow(new Daisy("Daisy " + daisyCounter++), window.innerWidth / 2 - 350 + i * 400, 150, windowWidth, windowHeight);
    daisyWindows.push(daisyWindow);
    document.body.appendChild(daisyWindow.element);
}
updateDasies();

function updateDasies() {
    daisyWindows.forEach(daisy => daisy.updateBreedOptions());
}

// Remove closed windows
setInterval(() => removeClosedWindows(daisyWindows), 100);
function removeClosedWindows(windows) {
    const oldLength = windows.length;
    for (let i = 0; i < windows.length; i++) {
        if (windows[i].closed) {
            windows.splice(i, 1);
        }
    }
    if (oldLength !== windows.length) {
        updateDasies();
    }
};

document.getElementById("spawn-daisy").addEventListener("click", () => {
    const daisyWindow = new DaisyWindow(new Daisy("Daisy " + daisyCounter++), Math.random() * window.innerWidth, Math.random() * window.innerHeight, windowWidth, windowHeight);
    daisyWindows.push(daisyWindow);
    document.body.appendChild(daisyWindow.element);
    updateDasies();
});



document.getElementById("clear-daisies").addEventListener("click", () => {
    for (let i = 0; i < daisyWindows.length; i++) {
        daisyWindows[i].close();
    }
});
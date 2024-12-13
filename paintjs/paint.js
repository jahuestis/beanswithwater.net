var canvas;
var context;
var imageData;

var canvasWidth = 800;
var canvasHeight = 600;

var brushLabel = document.getElementById("brushLabel");
var sizeSlider = document.getElementById("sizeSlider");
var clearButton = document.getElementById("clear");

// Set up clear button
clearButton.addEventListener('click', function() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
});

// Set up color selection
var colors = document.getElementsByName("color");
var colorSelected;
colors.forEach(color => {
    if (color.checked) {
        colorSelected = color.value;
    }
    color.addEventListener('change', function() {
        colorSelected = this.value;
    });
});

// Set up mouse and brush
var brushSize;
var mouseDown;
document.addEventListener('mousedown', function() {
    mouseDown = true;
});

document.addEventListener('mouseup', function() {
    mouseDown = false;
});

var drawX = 0;
var drawY = 0;
var mouseX = 0;
var mouseY = 0;
document.addEventListener('mousemove', function(event) {
    bounds = canvas.getBoundingClientRect();
    scaleX = canvas.width / bounds.width;
    scaleY = canvas.height / bounds.height;
    mouseX = (event.clientX - bounds.left) * scaleX;
    mouseY = (event.clientY - bounds.top) * scaleY;
});

// -- Main Code --
window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.width= canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext("2d");
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(update);
}

function update() {
    brushSize = sizeSlider.value;
    brushLabel.innerHTML = "Brush Size: " + brushSize;
    if (colorSelected == "black") {
        brushLabel.style.color = "gray";
    } else {
        brushLabel.style.color = colorSelected;
    }

    // draw on the canvas
    var drawXPrev = drawX;
    var drawYPrev = drawY;
    drawX = mouseX;
    drawY = mouseY;
    context.putImageData(imageData, 0, 0);
    if (mouseX > 0 && mouseY > 0 && mouseX < canvas.width && mouseY < canvas.height) {
        if (mouseDown) {
            drawPath(drawXPrev, drawYPrev, drawX, drawY, brushSize, colorSelected);
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        }
        drawPath(drawX, drawY, drawX, drawY, brushSize, colorSelected);
    }
    
    
    // update on next frame
    requestAnimationFrame(update);
}

function drawPath(startX, startY, endX, endY, brushSize, color) {
    // Set the properties for the stroke
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.strokeStyle = color;

    // Begin the path and draw the line
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}


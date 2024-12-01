/*
    Code sample for SITE 1101 Principles of Information Systems 
    (c)2024 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/

// Select the canvas element from the DOM and set up its 2D rendering context
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 700;
canvas.height = 900;

// Set global drawing settings for the canvas context
ctx.lineWidth = 10; // Thickness of the lines

// Add shadow effects to the drawings
ctx.shadowOffsetX = 2; // Horizontal shadow offset
ctx.shadowOffsetY = 2; // Vertical shadow offset
ctx.shadowColor = 'black'; // Shadow color

// Create a linear gradient for coloring
const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient1.addColorStop('0.2', 'pink'); // Start with pink at 20% of the gradient
gradient1.addColorStop('0.3', 'red');
gradient1.addColorStop('0.4', 'orange');
gradient1.addColorStop('0.5', 'yellow');
gradient1.addColorStop('0.6', 'green');
gradient1.addColorStop('0.7', 'turquoise');
gradient1.addColorStop('0.8', 'violet'); // End with violet at 80% of the gradient

// Create a radial gradient for coloring
const gradient2 = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.5, 30, // Inner circle center and radius
    canvas.width * 0.5, canvas.height * 0.5, 400 // Outer circle center and radius
);
gradient2.addColorStop('0.2', 'green'); // Green at 20% of the gradient
gradient2.addColorStop('0.5', 'red');
gradient2.addColorStop('0.8', 'blue'); // Blue at 80% of the gradient

// Set the stroke style to the radial gradient
ctx.strokeStyle = gradient1;

// Define the Line class to create animated lines
class Line {
    constructor(canvas) {
        // Initialize properties related to position, history, and appearance
        this.canvas = canvas;
        this.x = Math.random() * this.canvas.width; // Random starting x-coordinate
        this.y = Math.random() * this.canvas.height; // Random starting y-coordinate
        this.history = [{ x: this.x, y: this.y }]; // Store past positions of the line
        this.lineWidth = Math.floor(Math.random() * 25 + 1); // Random line thickness
        this.hue = Math.floor(Math.random() * 360); // Random color hue
        this.maxLength = Math.floor(Math.random() * 150 + 10); // Maximum length of the history array
        this.speedX = Math.random() * 1 - 0.5; // Horizontal speed
        this.speedY = 7; // Vertical speed
        this.lifeSpan = this.maxLength * 2; // Total life span of the line
        this.breakPoint = this.lifeSpan * 0.85; // Point where behavior changes
        this.timer = 0; // Tracks the life of the line
        this.angle = 0; // Initial angle for movement
        this.va = Math.random() * 0.5 - 0.25; // Angular velocity for rotation
        this.curve = 0.1; // Initial curvature
        this.vc = Math.random() * 0.4 - 0.2; // Velocity of curvature change
    }
    // Draw the line on the canvas
    draw(context) {
        context.strokeStyle = 'hsl(' + this.hue + ', 100%, 50%)'; // Dynamic color based on hue
        context.lineWidth = this.lineWidth; // Line width
        context.beginPath(); // Start a new path
        context.moveTo(this.history[0].x, this.history[0].y); // Move to the first point in history
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y); // Draw lines connecting all points in history
        }
        context.stroke(); // Render the line
    }
    // Update the line's position and behavior
    update() {
        this.timer++; // Increment the timer to track the line's life
        this.angle += this.va; // Update the angle for rotational movement
        this.curve += this.vc; // Update the curvature
        if (this.timer < this.lifeSpan) {
            if (this.timer > this.breakPoint) {
                this.va *= -1.12; // Reverse angular velocity after the break point
            }
            // Update position based on sine and cosine of the angle
            this.x += Math.sin(this.angle) * this.curve;
            this.y += Math.cos(this.angle) * this.curve;
            // Add the new position to history
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxLength) {
                this.history.shift(); // Remove oldest point if history exceeds maxLength
            }
        } else if (this.history.length <= 1) {
            this.reset(); // Reset the line if it disappears
        } else {
            this.history.shift(); // Gradually erase the line
        }
    }
    // Reset the line to a new random state
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.history = [{ x: this.x, y: this.y }];
        this.timer = 0;
        this.angle = 0;
        this.curve = 0;
        this.va = Math.random() * 0.5 - 0.25;
    }
}

// Create an array of Line objects
const linesArray = [];
const numberOfLines = 50; // Total number of lines to animate
for (let i = 0; i < numberOfLines; i++) {
    linesArray.push(new Line(canvas)); // Add a new Line object to the array
}
console.log(linesArray); // Output the array for debugging

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    linesArray.forEach(line => {
        line.draw(ctx); // Draw each line
        line.update(); // Update each line
    });
    requestAnimationFrame(animate); // Request the next frame
}
animate(); // Start the animation

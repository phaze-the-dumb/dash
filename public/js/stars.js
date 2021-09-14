let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 17
canvas.height = window.innerHeight - 15

let context = canvas.getContext("2d");
let stars = 200;
let colorrange = [0, 16, 60, 178, 240];
let starsArr = []
let mouseX = 0
let mouseY = 0

window.onmousemove = function(data){
    mouseX = data.clientX
    mouseY = data.clientY
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}   

for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
        y = Math.random() * canvas.offsetHeight,
        z = getRandom(10, 275),
        radius = Math.random() * 1.2,
        hue = colorrange[getRandom(0, colorrange.length - 1)],
        sat = getRandom(50, 100);
    
    context.beginPath();
    context.arc(x, y, radius, 0, 360);
    context.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
    context.fill();

    starsArr.push({
        x,
        y,
        z,
        radius,
        hue,
        sat
    })
}

function renderStars(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    starsArr.forEach(star => {
        context.beginPath();
        context.arc((star.x) + (mouseX / star.z), (star.y) + (mouseY / star.z), star.radius, 0, 360);
        context.fillStyle = "hsl(" + star.hue + ", " + star.sat + "%, 88%)";
        context.fill();
    })

    requestAnimationFrame(renderStars)
}

requestAnimationFrame(renderStars)
// Dinner options
const dinnerOptions = [
    'Pizza',
    'Pasta',
    'Sushi',
    'Burger',
    'Salad',
    'Tacos',
    'Stir Fry',
    'Curry'
];

// Initialize the wheel
function initializeWheel() {
    const wheel = document.getElementById('dinner-wheel');
    const sliceAngle = 360 / dinnerOptions.length;
    
    dinnerOptions.forEach((option, index) => {
        const slice = document.createElement('div');
        slice.style.position = 'absolute';
        slice.style.width = '100%';
        slice.style.height = '100%';
        slice.style.transform = `rotate(${index * sliceAngle}deg)`;
        slice.style.clipPath = `polygon(50% 50%, 50% 0%, ${50 + Math.cos(sliceAngle * Math.PI / 180) * 50}% ${50 - Math.sin(sliceAngle * Math.PI / 180) * 50}%)`;
        slice.style.backgroundColor = `hsl(${index * (360 / dinnerOptions.length)}, 70%, 60%)`;
        
        const text = document.createElement('span');
        text.textContent = option;
        text.style.position = 'absolute';
        text.style.left = '60%';
        text.style.top = '20%';
        text.style.transform = 'rotate(90deg)';
        text.style.color = 'white';
        text.style.fontWeight = 'bold';
        
        slice.appendChild(text);
        wheel.appendChild(slice);
    });
}

// Spin the wheel
function spinWheel() {
    const wheel = document.getElementById('dinner-wheel');
    const button = document.getElementById('spin-button');
    const result = document.getElementById('dinner-choice');
    
    button.disabled = true;
    
    // Random number of rotations (3-5 full rotations)
    const rotations = 3 + Math.random() * 2;
    // Random final angle
    const finalAngle = Math.random() * 360;
    const totalRotation = (rotations * 360) + finalAngle;
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // Calculate which option was selected
    setTimeout(() => {
        const selectedIndex = Math.floor(((360 - (finalAngle % 360)) / (360 / dinnerOptions.length))) % dinnerOptions.length;
        result.textContent = dinnerOptions[selectedIndex];
        button.disabled = false;
    }, 3000);
}

// Initialize when the page loads
window.addEventListener('load', () => {
    initializeWheel();
    document.getElementById('spin-button').addEventListener('click', spinWheel);
});
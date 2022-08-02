//Animate mining a targeted marker.
const animateMining = (e) => {
    const rect = e.target.getBoundingClientRect();

    let ani = document.createElement('div')
    ani.id = 'mininganimation';

    //Set the mining animation color to match the marker mined.
    const root = document.documentElement;
    root.style.setProperty('--mining-color', e.target.style.backgroundColor)

    ani.style.left = `${rect.x + (e.target.offsetWidth / 2)}px`;
    ani.style.top = `${rect.y + (e.target.offsetWidth / 2)}px`;
    ani.style.height = `${e.target.offsetWidth}px`;
    ani.style.width = `${e.target.offsetWidth}px`;

    const app = document.getElementById('app');
    app.appendChild(ani);

    setTimeout(() => {
        ani.remove();
    }, 480);

    animateBeam(e.target);
}

//Animate a beam from tenshi to the target point.
const animateBeam = (target) => {
    const app = document.getElementById('app');

    //Get target element's position.
    const rect = target.getBoundingClientRect();

    //Create beam elements.
    const beam = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const beamLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    beam.classList.add('beambox');

    const tenshi = document.getElementById('tenshi');
    const tenshiRect = tenshi.getBoundingClientRect();

    //Calculate beam based on target and tenshi calculations.
    const topX = tenshiRect.x + tenshi.offsetWidth / 2;
    const topY = tenshiRect.y + tenshi.offsetHeight / 2;
    const bottomX = rect.x + target.offsetWidth / 2;
    const bottomY = rect.y + target.offsetHeight / 2;

    //Create polyline svg element.
    beamLine.setAttribute("points", `${topX},${topY} ${bottomX},${bottomY}`);

    app.appendChild(beam);
    beam.appendChild(beamLine);

    setTimeout(() => {
        beam.remove();
    }, 1000)

}

const animateMiss = () => {
    const planet = document.getElementById('planet');
    planet.classList.remove('miss', 'success', 'timerexpired');
    void planet.offsetWidth;
    planet.classList.add('miss');
}

const animateSuccess = () => {
    const planet = document.getElementById('planet');
    planet.classList.remove('miss', 'success', 'timerexpired');
    void planet.offsetWidth;
    
    planet.classList.add('success');
}

const animateTimerExpired = () => {
    const planet = document.getElementById('planet');
    planet.classList.remove('miss', 'success', 'timerexpired');
    void planet.offsetWidth;
    planet.classList.add('timerexpired');
}

//Toggle visibility on the use item button.
const toggleUseButton = (e) => {
    const box = e.target.parentElement;
    const useBtn = box.querySelector('.usebtn');
    useBtn.classList.toggle('shown');
}

//Toggle the navbar between the clicker game and global versions.
const toggleNavbar = () => {
    const navbar = document.getElementById('navbar');
    const clickerNav = document.getElementById('clickernav');
    const toggleButton = document.getElementById('navtogglebtn');

    navbar.classList.toggle('hidden');
    clickerNav.classList.toggle('shown');
    toggleButton.classList.toggle('flipped');
}

// Toggle the inventory.
const showInventory = () => {
    const inventory = document.getElementById('clickerinventory');
    inventory.classList.toggle('shown');

    const button = document.getElementById('invbtn');
    button.classList.toggle('selected');
}

// Toggle recipe visibility.
const showRecipes = () => {
    const recipes = document.getElementById('clickerrecipes');
    recipes.classList.toggle('shown');

    const button = document.getElementById('recipebtn');
    button.classList.toggle('selected');
}

// Animate the planet cracking in two.
const crackPlanet = (color) => {
    const crackBox = document.getElementById('crackbox');
    const left = document.getElementById('planetleft');
    const right = document.getElementById('planetright');

    crackBox.classList.remove('shown');
    left.classList.remove('shown', 'shownreverse');
    right.classList.remove('shown', 'shownreverse');

    void crackBox.offsetWidth;
    void left.offsetWidth;
    void right.offsetWidth;

    crackBox.classList.add('shown');
    left.classList.add('shown');
    right.classList.add('shown');

    const planet = document.getElementById('planet');
    planet.classList.remove('uncracked');
    planet.classList.add('cracked');
}

const sealPlanet = (color) => {
    const left = document.getElementById('planetleft');
    const right = document.getElementById('planetright');

    left.classList.remove('shown', 'shownreverse');
    right.classList.remove('shown', 'shownreverse');

    void left.offsetWidth;
    void right.offsetWidth;

    left.classList.add('shownreverse');
    right.classList.add('shownreverse');

    const planet = document.getElementById('planet');
    planet.classList.remove('cracked');
    planet.classList.add('uncracked');
}

// Animate getting a small chest.
const animateSmallChest = (image) => {

    // Animate the chest.
    const chest = document.getElementById('chestbox');
    chest.classList.remove('shown');
    void chest.offsetWidth;
    chest.classList.add('shown');

    // Update the chest item source.
    const itemImg = chest.querySelector('img');
    itemImg.src = image;
}



export {animateMining, animateBeam, animateMiss, animateSuccess, 
        animateTimerExpired, toggleUseButton, toggleNavbar, showInventory,
        crackPlanet, sealPlanet, animateSmallChest, showRecipes}
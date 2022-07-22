//Animate mining a targeted marker.
const animateMining = (e) => {
    const rect = e.target.getBoundingClientRect();

    let ani = document.createElement('div')
    ani.id = 'mininganimation';

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
    planet.classList.remove('miss', 'timerexpired');
    void planet.offsetWidth;
    planet.classList.add('miss');
}

const animateTimerExpired = () => {
    const planet = document.getElementById('planet');
    planet.classList.remove('miss', 'timerexpired');
    void planet.offsetWidth;
    planet.classList.add('timerexpired');
}

export {animateMining, animateBeam, animateMiss, animateTimerExpired}

const togglebtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');



//for dropdown of the sub-menu
document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', () => {

        if (sidebar.classList.contains('close')) {
            sidebar.classList.remove('close');
            togglebtn.classList.remove('rotated')
        }
        const subMenu = btn.nextElementSibling;
        subMenu.classList.toggle('show');
        btn.querySelector('.dropdown-arrow').classList.toggle('rotated');
    });
});

togglebtn.addEventListener('click', () => {
    togglebtn.classList.toggle('rotated');
    sidebar.classList.toggle('close');

    //
    if (sidebar.classList.contains('close')) {
        document.querySelectorAll('.sub-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
            arrow.classList.remove('rotated');
        });
    }
});


//pomodoro timer javascript
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");

let timeleft = 1500; //for 25 min its like 1500 sec
let interval; // this will be changed variably 

const updateTimer = () => {
    const minutes = Math.floor(timeleft / 60); //the math..floor helps to get the whole number 
    const seconds = timeleft % 60; //this is gonna be giving us the second

    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    //here to string converts minute to string and padstart helps in consistency in numbering eg 01 02 10 11 and son just adding0 when number is below 25 minutes
}

const startTimer = () => {

    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        timeleft--; //reduces time by 1
        updateTimer();

        if (timeleft == 0) {
            clearInterval(interval);
            alert("Hurrah! You did a 25 minute focus");
            timeleft = 1500;
            updateTimer();
        }
    }, 1000); //here thousand is in miliseconds
    // the function inside set interval is gonna be executing every 1000 miliseconds here 

}

const stopTimer = () => { clearInterval(interval) };
const resetTimer = () => {
    clearInterval(interval);
    interval = null;
    timeleft = 1500;
    updateTimer();
}

updateTimer();

//ading event listener
start.addEventListener('click', startTimer);
stop.addEventListener('click', stopTimer);
reset.addEventListener('click', resetTimer);

//for the gretting javascript 
(function () {
    const labelEl = document.getElementById('greeting-label');
    const dateEl = document.getElementById('greeting-date');
    const timeEl = document.getElementById('greeting-time');

    //for the returning of the hour
    function getGreeting(hour) {
        if (hour < 12) return 'Good Morning ,';
        if (hour < 17) return 'Good Afternoon ,';
        return 'Good Evening ,';
    }

    function update() {
        const now = new Date();
        labelEl.textContent = getGreeting(now.getHours());
        dateEl.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
        timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }
    update();
    setInterval(update, 1000); // for setting the interval every 1 second....
})();

//for the functionality of the nav bar focus mode pomodoros 
const DURATIONS = {
    '25 Minutes': 25 * 60,
    '30 Minutes': 30 * 60,
    '45 Minutes': 45 * 60,
    '90 Minutes': 90 * 60,
};
document.querySelectorAll('.sub-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); //yesley chahi hamlai link ma laney kam gardaina just loads in the page 
        const seconds = DURATIONS[link.textContent.trim()]; //if we write down DURATIONS['25 Minutes'] it give the value of 25 minutes htat we earlier loaded in const
        if (seconds) launchFocusMode(seconds, link.textContent.trim()); //yedi second xw vaney pass this data to the launch focus mode function 
    });
});

function launchFocusMode(totalSeconds, label) {
    document.getElementById('focus-overlay')?.remove(); //?. is a optional parameter hai ...
    let timeLeft = totalSeconds, interval = null //multiple variable seprated by comma hai

    const overlay = document.createElement('div');
    overlay.id = 'focus-overlay'; //gives id to the created element 
    overlay.innerHTML = `
    <div class="focus-inner">
        <div class="focus-label">${label} Focus</div> 
        <div class="focus-timer" id="foc-display"></div>
        <div class="pomo-btn-wrapper">
            <button id="fo-start">Start</button>
            <button id="fo-stop">Stop</button>
            <button id="fo-reset">Reset</button>
        </div>
        <button class="focus-close" id="fo-close">✕ Exit focus</button>
    </div>
    `;
    document.body.appendChild(overlay); // this adds it as the child of the body making it visible

    const display = document.getElementById('foc-display');
    const render = () => display.textContent = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
    render();

    document.getElementById('fo-start').addEventListener('click', () => {
        if (interval) return; //since interval holds the timer id if timer is already started then don;t run the funciton 
        interval = setInterval(() => {
            if (--timeLeft <= 0) {
                clearInterval(interval); interval = null;
                alert(`${label} session done hurrah !!`);
            }
            render();
        }, 1000);//runs every 1 second
    });
    //buttons of pomodoro hai
    document.getElementById('fo-stop').addEventListener('click', () => { clearInterval(interval); interval=null; });
    document.getElementById('fo-reset').addEventListener('click', () => { clearInterval(interval); interval = null; timeLeft = totalSeconds; render(); });
    document.getElementById('fo-close').addEventListener('click', () => { clearInterval(interval); overlay.remove(); });

}
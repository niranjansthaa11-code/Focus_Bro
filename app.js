document.addEventListener('DOMContentLoaded', function () {
    const monthyear = document.getElementById('month-year');
    const daysel = document.getElementById('days');
    const PrevMonthBtn = document.getElementById('Prev-month');
    const NextMonthbtn = document.getElementById('next-month');
    const todaybtn = document.getElementById('today-btn');
    const eventPanel = document.getElementById('event-panel');
    const eventDate = document.getElementById('event-date');
    const eventList = document.getElementById('event-list');

    let currentDate = new NepaliDate();
    console.log(currentDate);
    let selectedDate = null;


    //adding the sample events for trying 
    const events = {
        '2025-9-15': [
            { time: '10:00 AM', text: 'ops' },
            { time: '02:30 PM', text: 'Project review' }
        ],
        '2026-5-20': [
            { time: '11:02 AM', text: 'feroug appointment' }
        ],
        '2026-5-20': [
            { time: '11:03 AM', text: 'feroudfgd appointment' }
        ],
        '2026-5-20': [
            { time: '11:00 AM', text: 'feroudfgdf appointment' }
        ],
        '2025-9-25': [
            { time: '07:00 PM', text: 'Birthday party lima' },
            { time: '09:00 PM', text: 'Dinner with friends on denevo' }
        ],
        '2025-10-2': [
            { time: '03:00 PM', text: 'video' }
        ],
        '2025-10-10': [
            { time: 'All day', text: 'exams' }
        ],
        '2025-10-18': [
            { time: '12:00 PM', text: 'Lunch with client' },
            { time: '04:00 PM', text: 'photoshoot' }
        ]
    };

    // let us first render the calender function 
    function renderCalender() {

        //for nepali date
        const year = currentDate.getYear();
        const month =currentDate.getMonth();

        const firstDay = new NepaliDate(year,month,1);
        const daysInMonth =firstDay.daysInMonth;
        const firstDayIndex = firstDay.getDay();

        const prevMonth = month === 0?11:month-1;
        const prevyear =month === 0? year -1 :year;
        const PrevLastday = new NepaliDate(prevyear,prevMonth,1).daysInMonth;

        //for the last day
        const lastDay=new NepaliDate(year,month,daysInMonth);
        const lastDayIndex=lastDay.getDay();
        const nextDays = lastDayIndex === 6 ? 0 : 6 - lastDayIndex; //same sort of logic like i did with the english date

        const months = [
            "Baishak", "Jeeth", "Aasar", "Shrawan", "Bhadra", "Ashwin",
            "Kartik", "Mangsir", "Paush", "Magh", "Falgun", "Chaitra"
        ];

        monthyear.innerHTML = `${months[month]} ${year}`;
        let days = ""; //this changes the heading to current date 

        //here three loops draw the main grid where the number lies .....

        //for the previous month days
        for (let x = firstDayIndex; x > 0; x--) { // this loop counts from the firstdayindex to 0 index
            const prevDate = PrevLastday - x + 1;
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${prevDate}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${prevDate}</div>`;
        }
        //for the actual real days of the given month ...
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                i
            ); //here every i means that i have created a day there if i=15 i have created a day mayor feb 15 or any month and year 2026
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`; //this would be used later in the code for the event checking 
            const hasEvent = events[dateKey] !== undefined; // this checks the event if there is same date in the day the hasevent would be true is not the event would be false..
            let dayClass = 'day';

            //to check if the date is today or not here we are checking the all day month and year for this thing
            if (
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
            ) {
                dayClass += ' today'; // this adds the today in the exsiting data of the dayclass i thunk
            }

            //to select the date and change the class to day selected 
            if (
                selectedDate && // here && means run only if someone has actually clicked a date
                date.getDate() === selectedDate.getDate() && //also && means every single condition should be true
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
            ) {
                dayClass += ' selected';
            }
            if (hasEvent) {
                dayClass += ' has-events'; // i will be adding the css later for it
            }
            days += `<div class="${dayClass}" data-date="${dateKey}"> ${i} </div>`; //this creates a div where class is there and i is shown in html
            //backticks helps to mix the javascript variable inside the html tags.
        }

        //for the next month days
        for (let j = 1; j <= nextDays; j++) {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-${j}`;
            const hasEvent = events[dateKey] !== undefined; //to tell the user if there is event or not there

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${j}</div>`;
        }

        daysel.innerHTML = days; //this makes the calender apper 
        //add click event to days
        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.getAttribute('data-date'); //this helps to read the string
                const [year, month, dayNum] = dateStr.split('-').map(Number);//split tags splits the date into year month and days
                selectedDate = new Date(year, month - 1, dayNum);//.map converts each to a real number
                renderCalender();
                showEvents(dateStr);//helps in displaying the days event on the panel
            });
        });
    }


    //function for showing events of selected date
    function showEvents(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[dateObj.getDay()];
        eventDate.textContent = `${dayName}, ${months[dateObj.getMonth()]} ${day}, ${year}`;
        //converts date into something word kind of thing like monday june21 2026

        //clear previous events
        eventList.innerHTML = '';


        if (events[dateStr]) {
            events[dateStr].forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                        <div class="event-color"></div>
                        <div class="event-time">${event.time}</div>
                        <div class="event-text">${event.text}</div> `;
                eventList.appendChild(eventItem);
            });
        } else {
            eventList.innerHTML = '<div class="no-events">No events scheduled for this day</div>';//if no event exists it shows this thing

        }
    }
    //when the previous month is clicked it goes to the previous month
    PrevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);//returns to the previous month
        renderCalender(); //this renders the calender
        eventDate.textContent = 'select a date';
        eventList.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
    });

    //when the next month is clicked it goes to the next month 
    NextMonthbtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalender();
        eventDate.textContent = 'select a date';
        eventList.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
    });

    //when today btn is clicked 
    //also attches the click event to the today button
    todaybtn.addEventListener('click', () => {
        currentDate = new Date();
        selectedDate = new Date();//current date ra new date full jump garxw when clicked today btn
        renderCalender();

        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        showEvents(dateStr);

        //initialization of the calender
        //this creates a calender here


    });
    renderCalender();
    });
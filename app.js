document.addEventListener('DOMContentLoaded', function () {
    const monthyear = document.getElementById('month-year');
    const daysel = document.getElementById('days');
    const PrevMonthBtn = document.getElementById('prev-month');
    const NextMonthbtn = document.getElementById('next-month');
    const todaybtn = document.getElementById('today-btn');
    const eventPanel = document.getElementById('event-panel');
    const eventDate = document.getElementById('event-date');
    const eventList = document.getElementById('event-list');

    let CurrentDate = new Date();
    console.log(CurrentDate);
    let selectedDate = null;


    //adding the sample events for trying 
    const events = {
        '2025-9-15': [
            { time: '10:00 AM', text: 'ops' },
            { time: '02:30 PM', text: 'Project review' }
        ],
        '2025-9-20': [
            { time: '11:00 AM', text: 'ferous appointment' }
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
        const firstDay = new Date(
            CurrentDate.getFullYear(),
            CurrentDate.getMonth(),
            1
        );

        const lastDay = new Date(
            CurrentDate.getFullYear(),
            CurrentDate.getMonth() + 1,
            0 //here 0 means the last day of the previous month 
        );
        const PrevLastday = new Date(
            CurrentDate.getFullYear(), CurrentDate.getMonth(), 0
        );

        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1; // yaha chahi last din paxi kati ota grey grnih vanera vanxw ...  index chahi 0 batw suru hunxa 

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        monthyear.innerHTML = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        let days = ""; //this changes the heading to current date 

        //here three loops draw the main grid where the number lies .....

        //for the previous month days
        for (let x = firstDayIndex; x > 0; x--) { // this loop counts from the firstdayindex to 0 index
            const prevDate = PrevLastday.getDate() - x + 1;
            const dateKey = `${currentDate.getFullYear()}-${CurrentDate.getMonth()}-${prevDate}`;
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

            //for the next month days
            for (let j = 1; j <= nextDays; j++) {
                const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-${j}`;
                const hasEvent = events[dateKey] !== undefined;

                days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${j}</div>`;
            }

            daysel.innerHTML = days;
            //add click event to days
            document.querySelectorAll('.day:not(.other_month)').forEach(day => {
                day.addEventListener('click', () => {
                    const dateStr = day.getAttribute('data-date');
                    const [year, month, dayNum] = dateStr.split('-').map(Number);
                    selectedDate = new Date(year, month - 1, dayNum);
                    renderCalender();
                    showEvents(dateStr);
                });
            });
        }

    }























}

)
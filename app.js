
// for storing of the event 
let events = {};


//loading of the events on the startup
async function loadEvents() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;//if user no login ther eis no data sooo 
    const { data, error } = await sb.from('events').select('*').eq('user_id', session.user.id);
    //select ley chahi sab coloumns selct garxw and eq filters out the rows that matches the users id 
    if (error) { console.error(error); return; } //console ma error dekhauxw and returns it 

    events = {};
    data.forEach(row => {
        if (!events[row.date_key]) events[row.date_key] = [];
        events[row.date_key].push({ id: row.id, time: row.time, text: row.text })
    });
}
//function that takes three parameters and help insert the event in the database 
async function saveEvents(dateKey, time, text) {
    const { data: { session } } = await sb.auth.getSession();
    const { data, error } = await sb.from('events').insert({
        user_id: session.user.id,
        date_key: dateKey,
        time,
        text
    }).select().single(); //single cause we want the single object instead of the array itself 
    if (!error) {
        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push({ id: data.id, time, text }); //for local sysnc of the data to the database...
    }
    //
}

async function deleteEvent(id, dateKey, idx) {
    await sb.from('events').delete().eq('id', id); //requests the supabase for the delete 
    events[dateKey].splice(idx, 1);//idx is where data is stored locaiton 
    if (events[dateKey].length === 0) delete events[dateKey];
}
async function updateAchievementCount() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const { count } = await sb.from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
    document.getElementById('achievement-count').textContent = count || 0;
}




//we are creating  a function where the system gets the english date and converts it in the nepali date by mathmatical calulations  and pass the functions like currentDate.getyear(),currentdate.getmonth() and also getday()
if (typeof NepaliDate === 'undefined') { //this checks if the  nepalidate libry exists
    console.error('NepaliDate library not loaded! Using fallback...');
    window.NepaliDate = function (year, month, day) { //new function creation fo the backup if nepalidate doesn't exists
        // we are extracting the english date for the conversion 
        const today = new Date();
        const engYear = today.getFullYear();
        const engMonth = today.getMonth();
        const engDay = today.getDate();
        //if no datea is passed about year this function runs 
        if (!year) {
            this._year = engYear + 57; //kinaki nepali year snga english date ko diffrence jamma 56.7 years xw
            this._month = (engMonth + 9) % 12; //new year starts around mid-april so calulation done to find the nepali month 
            this._day = Math.min(engDay + 16, 30); //math min helps to maintain that the day never exceeds 30 and here engday is diff of 16 days 

        } else { //is data is passed by the user we can here directly add the values this would be used for the finding of the even t
            this._year = year;
            this._month = month || 0; // || o means if nothing given use 0 as default
            this._day = day || 1;
        }

        //these create functions that return stored values like when the funciton calls this.year it returns the values in .getyear()
        this.getYear = function () { return this._year; };
        this.getMonth = function () { return this._month; };
        this.getDate = function () { return this._day; };

        //it converts the nepali date back to english date to figure out the day of week
        this.getDay = function () {
            const d = new Date(this._year - 57, this._month - 8, this._day - 16);
            return d.getDay();  //this returns 0-6 values 
        };

        // this helps to create an aray of how many days each month has 
        const daysInMonths = [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30];
        this.daysInMonth = daysInMonths[this._month] || 30; //the days in month is compared with the months and if there is no data about how many days then returns default 30;
    };
}



document.addEventListener('DOMContentLoaded', async function () {
    await loadEvents(); // calling the load event function 
    updateAchievementCount();

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
    let selectedDateStr = null;

    // Achievement panel toggle for viewing on same html
    document.getElementById('achievement-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const panel = document.getElementById('achievement-panel');
        panel.style.display = 'block';

        const { data: { session } } = await sb.auth.getSession();
        if (!session) return;

        const { data, error } = await sb.from('achievements')
            .select('*')
            .eq('user_id', session.user.id)
            .order('completed_at', { ascending: false });

        if (error) { console.error(error); return; }

        document.getElementById('achievement-count-display').textContent =
            `Total completed: ${data.length} tasks`;

        const listEl = document.getElementById('achievement-list');

        if (data.length === 0) {
            listEl.innerHTML = '<p style="opacity:0.5; font-style:italic;">No achievements yet. Complete a task to see it here!</p>';
            return;
        }

        listEl.innerHTML = data.map(a => `
            <div class="event-item" style="background:#1C1A18; border-left:4px solid #4CAF50; margin-bottom:0.8rem;">
                <div class="event-color" style="background:#4CAF50"></div>
                <div class="event-time">${a.time}</div>
                <div class="event-text" style="color:var(--primary)">${a.text}</div>
                <div style="margin-left:auto; font-size:0.72rem; color:var(--text); white-space:nowrap;">
                    ${a.date_key}
                </div>
            </div>
        `).join('');
    });

    document.getElementById('close-achievement').addEventListener('click', () => {
        document.getElementById('achievement-panel').style.display = 'none';
    });

    // let us first render the calender function 
    function renderCalender() {

        //for nepali date
        const year = currentDate.getYear();
        const month = currentDate.getMonth();

        const firstDay = new NepaliDate(year, month, 1);
        const daysInMonth = firstDay.daysInMonth;
        const firstDayIndex = firstDay.getDay();

        const prevMonth = month === 0 ? 11 : month - 1;
        const prevyear = month === 0 ? year - 1 : year;
        const PrevLastday = new NepaliDate(prevyear, prevMonth, 1).daysInMonth;

        //for the last day
        const lastDay = new NepaliDate(year, month, daysInMonth);
        const lastDayIndex = lastDay.getDay();
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
            const dateKey = `${year}-${month}-${prevDate}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${prevDate}</div>`;
        }
        //for the actual real days of the given month ...
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;//this would be used later in the code for the event checking 
            const today = new NepaliDate();
            const hasEvent = events[dateKey] !== undefined;
            let dayClass = 'day';
            if (
                i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getYear()
            ) {
                dayClass += ' today';
            }
            //to select the date and change the class to day selected 
            if (
                selectedDate && // here && means run only if someone has actually clicked a date
                i === selectedDate.getDate() && //also && means every single condition should be true
                month === selectedDate.getMonth() &&
                year === selectedDate.getYear()
            ) {
                dayClass += ' selected';
            }

            if (hasEvent) {
                dayClass += ' has-event'; // i will be adding the css later for it
            }
            days += `<div class="${dayClass}" data-date="${dateKey}"> ${i} </div>`; //this creates a div where class is there and i is shown in html
            //backticks helps to mix the javascript variable inside the html tags.
        }

        //for the next month days
        for (let j = 1; j <= nextDays; j++) {
            const dateKey = `${year}-${month + 2}-${j}`;
            const hasEvent = events[dateKey] !== undefined; //to tell the user if there is event or not there

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${j}</div>`;
        }

        daysel.innerHTML = days; //this makes the calender apper 
        //add click event to days
        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.getAttribute('data-date'); //this helps to read the string
                const [y, m, d] = dateStr.split('-').map(Number);//split tags splits the date into year month and days
                selectedDate = new NepaliDate(y, m - 1, d);//.map converts each to a real number
                selectedDateStr = dateStr;
                renderCalender();
                showEvents(dateStr);//helps in displaying the days event on the panel
            });
        });
    }


    //function for showing events of selected date
    function showEvents(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new NepaliDate(year, month - 1, day);
        const months = [
            "Baishak", "Jeeth", "Aasar", "Shrawan", "Bhadra", "Ashwin",
            "Kartik", "Mangsir", "Paush", "Magh", "Falgun", "Chaitra"
        ];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[dateObj.getDay()];
        eventDate.textContent = `${dayName}, ${months[dateObj.getMonth()]} ${day}, ${year}`;
        //converts date into something word kind of thing like monday june21 2026

        //clear previous events
        eventList.innerHTML = '';


        if (events[dateStr]) {
            events[dateStr].forEach((event, index) => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                        <div class="event-color"></div>
                        <div class="event-time">${event.time}</div>
                        <div class="event-text">${event.text}</div>
                            <button class="complete-event-btn" data-index="${index}" title="Mark complete"><i class="fa-solid fa-circle-check"></i></button>
                        <button class="delete-event-btn" data-index="${index}" title="Delete event"><i class="fa-solid fa-delete-left"></i> Delete</button>
                        `;// it adds the delete btn
                eventList.appendChild(eventItem);
            });

            document.querySelectorAll('.delete-event-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation(); // thi make the event handel right there and not pass to any parents so the parent don't get trigger out hai
                    const idx = parseInt(btn.getAttribute('data-index'));
                    const event = events[dateStr][idx];
                    await deleteEvent(event.id, dateStr, idx);
                    renderCalender();//help in updating the dots
                    showEvents(dateStr);// re-rendering the list + form
                });
            });
        } else {
            eventList.innerHTML = '<div class="no-events">No events scheduled for this day</div>';//if no event exists it shows this thing

        }

        //complete button handeling code sdf
        document.querySelectorAll('.complete-event-btn').forEach(btn => {

            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-index')); //parsenin converts string to integer hai 
                const event = events[dateStr][idx];
                const { data: { session } } = await sb.auth.getSession();

                //for saving the achievement permamently 
                await sb.from('achievements').insert({
                    user_id: session.user.id,
                    date_key: dateStr,
                    time: event.time,
                    text: event.text
                });
                await deleteEvent(event.id, dateStr, idx); //dletes from event panels and go to the achievement one...
                renderCalender();
                showEvents(dateStr);
                updateAchievementCount();

            });

        });
        /// YA RAKHNEY
        //add event form
        const togglebtn = document.getElementById('add-event-toggle');
        const newToggleBtn = togglebtn.cloneNode(true); // her eclone node is removing the old listeners
        togglebtn.parentNode.replaceChild(newToggleBtn, togglebtn);
        newToggleBtn.style.display = 'flex';

        //adding the event form 
        const formDiv = document.createElement('div');
        formDiv.className = 'add-event-form';
        formDiv.innerHTML = `<h4>Add New TASK</h4>
    <select id="new-event-time">
    <option value="">.... Select Time....</option>
    <option value="12:00 AM">12:00 AM</option>
    <option value="12:30 AM">12:30 AM</option>
    <option value="1:00 AM">1:00 AM</option>
    <option value="1:30 AM">1:30 AM</option>
    <option value="2:00 AM">2:00 AM</option>
    <option value="2:30 AM">2:30 AM</option>
    <option value="3:00 AM">3:00 AM</option>
    <option value="3:30 AM">3:30 AM</option>
    <option value="4:00 AM">4:00 AM</option>
    <option value="4:30 AM">4:30 AM</option>
    <option value="5:00 AM">5:00 AM</option>
    <option value="5:30 AM">5:30 AM</option>
    <option value="6:00 AM">6:00 AM</option>
    <option value="6:30 AM">6:30 AM</option>
    <option value="7:00 AM">7:00 AM</option>
    <option value="7:30 AM">7:30 AM</option>
    <option value="8:00 AM">8:00 AM</option>
    <option value="8:30 AM">8:30 AM</option>
    <option value="9:00 AM">9:00 AM</option>
    <option value="9:30 AM">9:30 AM</option>
    <option value="10:00 AM">10:00 AM</option>
    <option value="10:30 AM">10:30 AM</option>
    <option value="11:00 AM">11:00 AM</option>
    <option value="11:30 AM">11:30 AM</option>
    <option value="12:00 PM">12:00 PM</option>
    <option value="12:30 PM">12:30 PM</option>
    <option value="1:00 PM">1:00 PM</option>
    <option value="1:30 PM">1:30 PM</option>
    <option value="2:00 PM">2:00 PM</option>
    <option value="2:30 PM">2:30 PM</option>
    <option value="3:00 PM">3:00 PM</option>
    <option value="3:30 PM">3:30 PM</option>
    <option value="4:00 PM">4:00 PM</option>
    <option value="4:30 PM">4:30 PM</option>
    <option value="5:00 PM">5:00 PM</option>
    <option value="5:30 PM">5:30 PM</option>
    <option value="6:00 PM">6:00 PM</option>
    <option value="6:30 PM">6:30 PM</option>
    <option value="7:00 PM">7:00 PM</option>
    <option value="7:30 PM">7:30 PM</option>
    <option value="8:00 PM">8:00 PM</option>
    <option value="8:30 PM">8:30 PM</option>
    <option value="9:00 PM">9:00 PM</option>
    <option value="9:30 PM">9:30 PM</option>
    <option value="10:00 PM">10:00 PM</option>
    <option value="10:30 PM">10:30 PM</option>
    <option value="11:00 PM">11:00 PM</option>
    <option value="11:30 PM">11:30 PM</option>
    <option value="All Day">All Day</option>
</select>
    <input type="text" id="new-event-text" placeholder="Enter the Task you have?" />
    <button id="add-event-btn">Add</button>
    <div id="add-event-error" style="color:red; font-size:0.8rem; display:none;"></div>`

        eventList.appendChild(formDiv);
        //toggle btn open close on +click
        newToggleBtn.addEventListener('click', () => {
            const isVisible = formDiv.classList.toggle('visible');//changes css to visble styling 
            const icon = newToggleBtn.querySelector('i');
            icon.classList.toggle('fa-circle-plus', !isVisible);
            icon.classList.toggle('fa-circle-minus', isVisible);
        })

        //add event listener to the add button 
        document.getElementById('add-event-btn').addEventListener('click', async () => {
            const timeINput = document.getElementById('new-event-time');
            const textINput = document.getElementById('new-event-text');
            const errorDiv = document.getElementById('add-event-error');

            const time = timeINput.value.trim();//trim out the space
            const text = textINput.value.trim();

            if (!time || !text) {//if user don't give the text or the time thi error is given 
                errorDiv.textContent = 'Both time and description chaiyo sathi.'
                errorDiv.style.display = 'block';
                return;
            }
            if (!selectedDateStr) {
                errorDiv.textContent = 'Please select a date first.';
                errorDiv.style.display = 'block';
                return;
            }
            await saveEvents(selectedDateStr, time, text);
            renderCalender();
            showEvents(selectedDateStr);
        });




    }


    //when the previous month is clicked it goes to the previous month
    PrevMonthBtn.addEventListener('click', () => {
        let y = currentDate.getYear();
        let m = currentDate.getMonth();
        if (m === 0) { m = 11; y--; }
        else { m--; }
        currentDate = new NepaliDate(y, m, 1); //creates the new nepali date for thej previous month
        renderCalender(); //this renders the calender
        eventDate.textContent = 'select a date';
        eventList.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
    });

    //when the next month is clicked it goes to the next month 
    NextMonthbtn.addEventListener('click', () => {
        let y = currentDate.getYear();
        let m = currentDate.getMonth();
        if (m === 11) { m = 0; y++; }
        else { m++; }
        currentDate = new NepaliDate(y, m, 1)
        renderCalender();
        eventDate.textContent = 'select a date';
        eventList.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
    });

    //when today btn is clicked 
    //also attches the click event to the today button
    todaybtn.addEventListener('click', () => {
        currentDate = new NepaliDate();
        selectedDate = new NepaliDate();//current date ra new date full jump garxw when clicked today btn
        const today = new NepaliDate();
        const dateStr = `${today.getYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;//this help to fix padding of month and the day
        renderCalender();
        selectedDateStr = dateStr;
        showEvents(dateStr);

        //initialization of the calender
        //this creates a calender here


    });
    renderCalender();
    console.log("Current Nepali Date:", {
        year: currentDate.getYear(),
        month: currentDate.getMonth(),
        date: currentDate.getDate(),
        day: currentDate.getDay()
    });
});

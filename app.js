document.addEventListener('DOMContentLoaded', function () {
    const monthyear = document.getElementById('month-year');
    const days = document.getElementById('days');
    const PrevMonthBtn = document.getElementById('prev-month');
    const NextMonthbtn = document.getElementById('next-month');
    const todaybtn = document.getElementById('today-btn');
    const eventPanel = document.getElementById('event-panel');
    const eventDate = document.getElementById('event-date');
    const eventList = document.getElementById('event-list');

    let CurrentDate = new Date();
    console.log(CurrentDate);
    let selectedDate = null;

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
        const nextDays = 7 - lastDayIndex - 1;

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September","October", "November", "December"
        ];
        monthyear.innerHTML= `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        let days="";

        //for the previous month days
        for(let x=firstDayIndex)

    }









}

)
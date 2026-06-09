//for the githyb type of contribution grid 
async function renderContributionGrid() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return; //the session stops if no login or no user id 
}
//fetchign achievement form the database 
const { data, error } = await sb
    .from('achievements')
    .select('date_key')
    .eq('user_id', session.user.id); //filetering of the current user done task 

if (error) { console.error(error); return; }//loging int he console 

//lets do count completion 
const countByKey = {};
data.forEach(row => {
    //looping of the date .
    countByKey[row.date_key] = (countByKey[row.date_key] || 0) + 1;
});

const WEEKS = 15; //makeing a 15 week grid show 
const TODAY_ND = new NepaliDate();
const TODAY_JS = TODAY_ND.toJsDate();//converts into standared javascript date 

//week day of today
const dayOfWeek = TODAY_JS.getDay();
const gridStartJs = new Date(TODAY_JS);
gridStartJs.setDate(TODAY_JS.getDate() - dayOfWeek - (WEEKS - 1) * 7); //frist sunday- of week is reduced to choose the starting date 

const cells = []; //array form
for (let i = 0; i < WEEKS * 7; i++) { //loops from the i to total days in week 
    const jsDate = new Date(gridStartJs);
    jsDate.setDate(gridStartJs.getDate() + i);
}
//to make the chart not visible for future events ....
if (jsDate > TODAY_JS) {
    cells.push({ dateKey: null, jsDate, count: null });
    continue;
}
const nd = new NepaliDate(jsDate);
const dateKey = `${nd.getYear()}-${(nd.getMonth() + 1).toString().padStart(2, '0')}-${nd.getDate().toString().padStart(2, '0')}`;
cells.push({ dateKey, jsDate, count: countByKey[dateKey] || 0 });

const thisWeekCells = cells.slice(-7).filter(c => c.count !== null); //slice gets the last 7 elements fo thee array and don't count the future days as there is fxn 
const thisWeekTotal = thisWeekCells.reduce((a, c) => a + c.count, 0);// accumulated + curent cell hunxw ya 
const allCounts = cells.filter(c => c.count !== null).map(c => c.count);//counts all the values as reduce ley chahi all valeue lai euta value ma convert garxw
//here map vnya chahi converts into the seprate array
const totalTasks = allCounts.reduce((a, b) => a + b, 0); //sum of all tasks done 
const bestDay = allCounts.length ? Math.max(...allCounts) : 0; //for finding the max value of the allcounts 
//uses conditon ? valueIftrue: value if false hai also...is a spread operator 


//streak system 
let streak = 0;
for (let i = cells.length - 1; i >= 0; i--) { //it is loooping backward to check the zero and count the tital positive work done 
    if (cells[i].count === null) continue;//skipping of the future days
    if (cells[i].count > 0) steak++;
    else break;
}
//displaying of the calculated thing 
document.getElementById('cg-week').textContent = thisWeekTotal;
document.getElementById('cg-best').textContent = bestDay;
document.getElementById('cg-streak').textContent = streak + 'd';
document.getElementById('cg-total').textContent = totalTasks;

const MONTHS = ["Baishak", "Jeeth", "Aasar", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Paush", "Magh", "Falgun", "Chaitra"];
const monthLabelEl = document.getElementById('cg-month-labels');
monthLabelEl.innerHTML = '';

//month label calculation 
let lastMonth = -1;
for (let w = 0; w < WEEKS; w++) {
    const cell = cells[w * 7];//gets the first day os the each week 
    if (!cell || cell.count === null) continue;//for future cells
    const nd = new NepaliDate(cell.jsDate);
    const m = nd.getMonth();
    if (m !== lastMonth) {
        lastMonth = m;
        const span = document.createElement('span');
        span.className = 'cg-month';
        span.textContent = MONTHS[m].slice(0, 3); //slices the word making only 3 words visible
        span.style.left = (w * 14) + 'px';//for placing week coloumn in the good place 
        monthLabelEl.appendChild(span);//creates the span of the months
    }
}
const weeksEl = document.getElementById('cg-weeks');
weeksEl.innerHTML = '';

//making the containere for the grid to be seen 
//1. for coloumn hai 
for (let w = 0; w < WEEKS; w++) {
    const weekCol = document.createElement('div');
    weekCol.className = 'cg-week-col';
}
//2. dividing coloumns into boxe s
for (let d = 0; d < 7; d++) {
    const cell = cells[w * 7 + d];
    const box = document.createElement('div');
    box.className = 'cg-box'; //creates a box 

    if (cell.count === null) {
        box.classList.add('cg-future');//nocolour after hoi 
    } else {
        box.classList.add(getShadeClass(cell.count));
        const nd = new NepaliDate(cell.jsDate);
        const label = `${MONTHS[nd.getMonth()]} ${nd.getDate()}, ${nd.getYear()} — ${cell.count} task${cell.count !== 1 ? 's' : ''}`;
        box.setAttribute('title', label);

        if (cell.jsDate.toDateString() === TODAY_JS.toDateString()) {
            box.classList.add('cg-today');
        }
    }
    weekCol.appendChild(box);
}
weeksEl.appendChild(weekCol);
    }




function getShadeClass(count) {
    if (count === 0) return 'cg-0';
    if (count === 1) return 'cg-1';
    if (count === 2) return 'cg-2';
    if (count <= 4)  return 'cg-3';
    return 'cg-4';
}


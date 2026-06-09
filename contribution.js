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

    if(error){console.error(error); return;}//loging int he console 

    //lets do count completion 
    const countByKey={};
    data.forEach(row =>{
        //looping of the date .
        countByKey[row.date_key]=(countByKey[row.date_key]|| 0)+1;
    });

    const WEEKS = 15; //makeing a 15 week grid show 
    const TODAY_ND =new NepaliDate();
    const TODAY_JS = TODAY_ND.toJsDate();//converts into standared javascript date 
    
    //week day of today
    const dayOfWeek = TODAY_JS.getDay();
    const gridStartJs = new Date(TODAY_JS);
    gridStartJs.setDate(TODAY_JS.getDate()-dayOfWeek -(WEEKS-1)*7); //frist sunday- of week is reduced to choose the starting date 
    
    const cells=[]; //array form
    for(let i=0; i<WEEKS*7;i++){ //loops from the i to total days in week 
        const jsDate = new Date(gridStartJs);
        jsDate.setDate(gridStartJs.getDate()+i);
    }
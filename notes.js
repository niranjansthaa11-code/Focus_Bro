//pahila constant haru liney....
const notesApp = document.getElementById('notes-app');
const notesWrapper = document.getElementById('notes-wrapper');
const addNewBtn    = document.getElementById('add-new-note-btn');
const titleInput   = document.getElementById('note-title');
const descInput    = document.getElementById('note-desc');
const saveBtn      = document.getElementById('save-note');
const noteForm     = document.getElementById('note-form');
const popupTitle   = document.getElementById('popup-title');
const closeIcon    = document.querySelector('.popup .content header i');

const dashboardContent = document.getElementById('dashboard-content');
const chatContainer = document.getElementById('dashboard-content ')
const chatContainer = document.querySelector('.main-chat-container');

const months = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
let notesCache =[];
let isUpdate=false;
let updateId=null;

//show hide notes page
function showNotesView(){
    //it only hides the dashboard item and just show the notes app only in the side bar 
    dashboard.style.display='none';
    if (chatContainer) chatContainer.style.display='none';
    notesApp.style.display='block';
    hideForm();
    loadNotes(); //loading from supabase that we will define later 
}
function hideNotesView(){
    notesApp.style.display='none';
    dashboardContent.style.display='';
}

//for navbar link   connect 
document.querySelectorAll('#sidebar ul li a').forEach(link =>{
    const label = link.querySelector('span')?.textContent.trim(); //trim for no eroor 
    if(label === 'Your Notes'){
        link.addEventListener('click',e=>{e.preventDefault(); showNotesView();})
    }
    if(link.getAttribute('href'=== 'index.html')){ //for hiding when someone clicks to go to home section 
        link.addEventListener('click',()=> hideNotesView());
    }
});

function showForm(title ='Add a new Note',btnText='Add Note'){
    popupTitle.textContent=title;
    saveBtn.textContent =btnText;
    noteForm.closest('.popup'.classList.add('form-visible'));
    titleInput.focus();
}
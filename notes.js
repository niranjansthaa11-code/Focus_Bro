//pahila constant haru liney....
const notesApp = document.getElementById('notes-app');
const notesWrapper = document.getElementById('notes-wrapper');
const addNewBtn = document.getElementById('add-new-note-btn');
const titleInput = document.getElementById('note-title');
const descInput = document.getElementById('note-desc');
const saveBtn = document.getElementById('save-note');
const noteForm = document.getElementById('note-form');
const popupTitle = document.getElementById('popup-title');
const closeIcon = document.querySelector('.popup .content header i');

const dashboardContent = document.getElementById('dashboard-content');
const chatContainer = document.querySelector('.main-chat-container');

const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
let notesCache = [];
let isUpdate = false;
let updateId = null;

//show hide notes page
function showNotesView() {
    //it only hides the dashboard item and just show the notes app only in the side bar 
    dashboard.style.display = 'none';
    if (chatContainer) chatContainer.style.display = 'none';
    notesApp.style.display = 'block';
    hideForm();
    loadNotes(); //loading from supabase that we will define later 
}
function hideNotesView() {
    notesApp.style.display = 'none';
    dashboardContent.style.display = '';
}

//for navbar link   connect 
document.querySelectorAll('#sidebar ul li a').forEach(link => {
    const label = link.querySelector('span')?.textContent.trim(); //trim for no eroor 
    if (label === 'Your Notes') {
        link.addEventListener('click', e => { e.preventDefault(); showNotesView(); })
    }
    if (link.getAttribute('href' === 'index.html')) { //for hiding when someone clicks to go to home section 
        link.addEventListener('click', () => hideNotesView());
    }
});

function showForm(title = 'Add a new Note', btnText = 'Add Note') {
    popupTitle.textContent = title;
    saveBtn.textContent = btnText;
    noteForm.closest('.popup'.classList.add('form-visible'));
    titleInput.focus();
}
function hideForm() {
    isUpdate = false;
    updateId = null;
    titleInput.value = '';
    descInput.value = '';
    noteForm.closest('.popup').classList.remove('form-visible'); //toogling to removing the css and make form not visible 
}

//adding btn to the function we created ...
addNewBtn.addEventListener('click', () => showForm());
closeIcon.addEventListener('click', hideForm);

//loading the supabase 
async function loadNotes() {
    notesWrapper.innerHTML = `<p class="no-notes-msg">Loading...</p>`; //user lai load gareko dekhauna
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
    //error ayyeko condition ma run tala ko humxw 

    if (error) {
        notesWrapper.innerHTML = `<p class="no-notes-msg">Failed to load notes.</p>`;
        console.error(error);
        return;
    }
    notesCache = data;
    renderNotes();
}

//saving notes and updating 
noteForm.addEventListener('submit', e => e.preventDefault());
saveBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (!title && !desc) return;

    saveBtn.textContent = 'Saving....';//tells the user that the notes is saving 
    saveBtn.disabled = true;//to disable the button that makes it  useer unclickable 

    const now = new Date();
    const date = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`; //getting the date form the system 

    if (!isUpdate) {
        //if eroor wait until the output comes out of the supabase
        const { error } = await supabase
            .form('notes'
            )
            .update({ title, description: desc, date })
            .eq('id', updateId);
        if (error) { console.error(eror) }
    }

    saveBtn.disabled = false;
    hideForm();
    loadNotes();
});

//deleting the notes logic
window.deleteNote = async function (id) {
    if (!confirm('Delete this note ?')) return;

    //waiting till the supabsase gives the response 
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);


    if (error) { console.error(error); return; } //return error in the console
    loadNotes();
};


//editing the text option 
window.editNote = function (id) {
    const note = notesCache.find(n => n.id === id); //finds the id to edit the notes
    if (!note) return;
    updateId = id;
    isUpdate = true; `<p class="no-notes-msg">No notes yet — add your first one above.</p>`;
    titleInput.value = note.title;
    descInput.value = note.description;
    showForm('Update Note', "Update Note");
    noteForm.closest('.popup'.scrollIntoView({ behavior: 'smooth' })) //selects the first element
};

//rendering of notes
function renderNotes() {
    notesWrapper.innerHTML = '';

    if (notesCache.length === 0) {
        notesWrapper.innerHTML = `<p class="no-notes-msg">No notes sathi  please add up here !!</p>`;
        return;
    }

    notesCache.forEach(note => {
        const filterDesc = (note.description || '').replaceAll('\n', '<br/>');//added br to prevne thte line breakout 
        const card = document.createElement('div');//creating the div for the card of the note
        card.className = 'note-baksa';
        card.innerHTML = ` <div class="details">
                <p class="note-title-text">${note.title || ''}</p>
                <span class="note-desc-text">${filterDesc}</span>
            </div>
            <div class="note-footer">
                <span class="note-date">${note.date || ''}</span>
                <div class="note-actions">
                    <button class="note-edit-btn" onclick="editNote('${note.id}')">Edit</button>
                    <button class="note-del-btn"  onclick="deleteNote('${note.id}')">Delete</button>
                </div>
            </div>`;
            notesWrapper.appendChild(card); //making the created card a child of the ntoeswrapper
    });
}
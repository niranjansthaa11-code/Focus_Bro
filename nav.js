
const togglebtn =document.getElementById('toggle-btn');
const sidebar =document.getElementById('sidebar');



//for dropdown of the sub-menu
document.querySelectorAll('.dropdown-btn').forEach(btn =>{
    btn.addEventListener('click',() =>{

        if(sidebar.classList.contains('close')){
        sidebar.classList.remove('close');
        togglebtn.classList.remove('rotated')
    }
    const subMenu =btn.nextElementSibling;
    subMenu.classList.toggle('show');
    btn.querySelector('.dropdown-arrow').classList.toggle('rotated');
    });
});

togglebtn.addEventListener('click' ,() =>{
    togglebtn.classList.toggle('rotated');
    sidebar.classList.toggle('close');

    //
    if(sidebar.classList.contains('close')){
        document.querySelectorAll('.sub-menu').forEach(menu =>{
            menu.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-arrow').forEach(arrow =>{
            arrow.classList.remove('rotated');
        });
    }
});


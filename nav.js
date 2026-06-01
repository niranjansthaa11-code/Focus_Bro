document.querySelectorAll('.dropdown-btn').forEach(btn =>{
    btn.addEventListener('click',() =>{
        const subMenu =btn.nextElementSibling; // this selects the ul.submenu right after the menu
        subMenu.classList.toggle('show');
        btn.querySelector('.dropdown-arrow').classList.toggle('rotated');
    });
});
//for togglebtn
const togglebtn =document.getElementById('toggle-btn');
const sidebar =document.getElementById('sidebar');

togglebtn.addEventListener('click' ,() =>{
    togglebtn.classList.toggle('rotated');
    sidebar.classList.toggle('close');
    
});
const navLink = document.getElementById("navLink");
Menu.addEventListener("click",()=>{ 
navLink.classList.toggle("hidden");
});

function setActiveLink(link) {
    const links = document.querySelectorAll('.item a');
    links.forEach((link) => {
        link.classList.remove('active-link');
    });
    link.classList.add('active-link');
}

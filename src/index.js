const $ = document.querySelector.bind(document);
const menu = $('nav div.navOptions');
const menuBar = $('#mobileMenu');

// Mobile Navigation
menuBar.onchange = function () {
    if (menuBar.checked) {
        menu.classList.display = 'block';
        console.log(1);
    } else {
        menu.classList.display = 'none';
        console.log(0);
    }
};

const $ = document.querySelector.bind(document);
const menu = $('nav div.navOptions');
const menuBar = $('#mobileMenu');
const popup = document.getElementsByClassName('dropdown');
const nav = $('nav');
const navSvg = nav.getElementsByTagName('svg');
const layer = $('.layer');
// Mobile Navigation
menuBar.onchange = function () {
    menu.classList.toggle('fadeUp');
    layer.classList.toggle('hidden');
};

// Nav
window.addEventListener('scroll', () => {
    let windowPosition = window.scrollY > 0;
    nav.classList.toggle('scrolling-active', windowPosition);
    Array.from(navSvg).forEach((element) => {
        element.classList.toggle('filter', windowPosition);
    });
});

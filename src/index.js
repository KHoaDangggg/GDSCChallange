const $ = document.querySelector.bind(document);
const menu = $('nav div.navOptions');
const menuBar = $('#mobileMenu');
const popup = document.getElementsByClassName('dropdown');
const nav = $('nav');
const navSvg = nav.getElementsByTagName('svg');
const layer = $('.layer');
const ShortenBtn = $('.linkbox button');
const ShortenText = $('.linkbox .input');
const errorMessage = $('.linkbox i');
// Mobile Navigation
menuBar.onchange = function () {
    menu.classList.toggle('hidden', false);
    menu.classList.toggle('fadeUp', !menuBar.checked);
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

// Shorten btn
ShortenBtn.onclick = function () {
    if (ShortenText.querySelector('input').value === '') {
        ShortenText.querySelector('i').style.display = 'block';
        ShortenText.querySelector('input').style.border =
            '2px solid var(--Red)';
    } else {
        ShortenText.querySelector('i').style.display = 'none';
        ShortenText.querySelector('input').style.borderColor = '';
    }
};

ShortenText.querySelector('input').onfocus = function () {
    ShortenText.querySelector('i').style.display = 'none';
    ShortenText.querySelector('input').style.borderColor = '';
};

let requestData = () => {};

// Detect element is scrolled into view
(function () {
    var elements;
    var windowHeight;

    function init() {
        elements = document.querySelectorAll('.notInView');
        windowHeight = window.innerHeight;
    }

    function checkPosition() {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var positionFromTop = elements[i].getBoundingClientRect().top;

            if (positionFromTop - windowHeight <= 0) {
                element.classList.add('fade-in-element');
                element.classList.remove('notInView');
            }
        }
    }

    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', init);

    init();
    checkPosition();
})();

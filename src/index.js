const $ = document.querySelector.bind(document);
const menu = $('nav div.navOptions');
const menuBar = $('#mobileMenu');
const popup = document.getElementsByClassName('dropdown');
const nav = $('nav');
const navSvg = nav.getElementsByTagName('svg');
const layer = $('.layer');
const ShortenBtn = $('.linkbox button');
const ShortenText = $('.linkbox input');
const errorMessage = $('.linkbox i');
const links = document.querySelector('.links');

const web = {
    eventHandler() {
        // Nav Scroll
        window.addEventListener('scroll', () => {
            let windowPosition = window.scrollY > 0;
            nav.classList.toggle('scrolling-active', windowPosition);
            Array.from(navSvg).forEach((element) => {
                element.classList.toggle('filter', windowPosition);
            });
        });

        // Shorten btn
        ShortenBtn.onclick = function () {
            if (ShortenText.value === '') {
                errorMessage.innerText = 'Please add a link';
                ShortenText.style.border = '2px solid var(--Red)';
            } else {
                errorMessage.innerText = '';
                ShortenText.style.borderColor = '';
                web.getData(ShortenText.value);
                ShortenText.value = '';
            }
        };

        ShortenText.onfocus = function () {
            errorMessage.innerText = '';
            ShortenText.style.borderColor = '';
        };
        // Mobile menu
        menuBar.onchange = function () {
            menu.classList.toggle('hidden', false);
            menu.classList.toggle('fadeUp', !menuBar.checked);
            layer.classList.toggle('hidden');
        };
    },
    scrollIntoView() {
        let elements;
        let windowHeight;
        function init() {
            elements = document.querySelectorAll('.notInView');
            windowHeight = window.innerHeight;
        }
        function checkPosition() {
            Array.from(elements).forEach((element) => {
                let positionFromTop = element.getBoundingClientRect().top;

                if (positionFromTop - windowHeight <= 0) {
                    element.classList.add('fade-in-element');
                    element.classList.remove('notInView');
                }
            });
        }
        window.onscroll = checkPosition;
        window.onresize = init;
        init();
        checkPosition();
    },
    createHtmlElement(original, short) {
        const div1 = document.createElement('div');
        const p1 = document.createElement('p');
        const div2 = document.createElement('div');
        const p2 = document.createElement('p');
        const copyBtn = document.createElement('button');
        links.appendChild(div1);
        p1.innerHTML = original;
        div1.appendChild(p1);
        div2.classList.add('newLink');
        div1.appendChild(div2);
        p2.innerHTML = short;
        div2.appendChild(p2);
        copyBtn.innerHTML = 'Copy';
        copyBtn.onclick = function () {
            navigator.clipboard.writeText(p2.innerHTML);
            copyBtn.innerHTML = 'Copied!';
            copyBtn.classList.add('copied');
        };
        div2.appendChild(copyBtn);
    },
    getData(data) {
        fetch(`https://api.shrtco.de/v2/shorten?url=${data}`)
            .then((res) => res.json())
            .then((data) => web.shortLink(data));
    },
    shortLink(data) {
        if (data.ok) {
            const originalLink = data.result.original_link;
            const shortLink = data.result.short_link;
            web.createHtmlElement(originalLink, shortLink);
        } else {
            errorMessage.innerText = 'Invalid link';
            ShortenText.style.border = '2px solid var(--Red)';
        }
    },
    start() {
        this.scrollIntoView();
        this.eventHandler();
    }
};

// Start
web.start();

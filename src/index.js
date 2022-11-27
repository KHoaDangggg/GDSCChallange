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
const linklist = [];
const STORAGE_KEY = 'Links';
const web = {
    linklist,
    config: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    settingConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    },
    loadingConfig() {
        this.linklist = this.config.linklist || [];
    },
    renderlink() {
        let html = this.linklist
            .map((link) => {
                return `
            <div>
                <p>${link.original}</p>
                <div class="newLink">
                    <p>${link.short}</p>
                    <button>Copy</button>
                </div>
            </div>     
            `;
            })
            .join('');
        links.innerHTML = html;
    },
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
            ShortenText.onkeydown = function (e) {
                if (e.keyCode === 13) {
                    web.getData(ShortenText.value);
                    ShortenText.value = '';
                }
            };
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
        const newLink = document.createElement('div');
        newLink.innerHTML = `
        <p>${original}</p>
        <div class="newLink">
        <p>${short}</p>
        <button>Copy</button>
        </div>`;
        links.insertBefore(newLink, links.children[0]);
        const copyBtn = newLink.querySelector('button');
        copyBtn.onclick = function () {
            navigator.clipboard.writeText(short);
            copyBtn.innerHTML = 'Copied!';
            copyBtn.classList.add('copied');
        };
    },
    getData(data) {
        fetch(`https://api.shrtco.de/v2/shorten?url=${data}`)
            .then((res) => res.json())
            .then((data) => {
                web.shortLink(data);
            });
    },
    shortLink(data) {
        if (data.ok) {
            const original = data.result.original_link;
            const short = data.result.short_link;
            web.createHtmlElement(original, short);
            web.updateList(original, short);
        } else {
            errorMessage.innerText = 'This is not a valid link';
            ShortenText.style.border = '2px solid var(--Red)';
        }
    },
    updateList(original, short) {
        web.linklist.unshift({
            original,
            short
        });
        web.settingConfig('linklist', web.linklist);
    },
    start() {
        this.loadingConfig();
        this.renderlink();
        this.scrollIntoView();
        this.eventHandler();
    }
};

// Start
web.start();

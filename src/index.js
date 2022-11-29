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
const historyBtn = $('#showLink');
const linklist = [];
const STORAGE_KEY = 'Links';
const web = {
    linklist,
    notEmpty: 'block',
    config: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    settingConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    },
    loadingConfig() {
        this.linklist = this.config.linklist || [];
        this.notEmpty = this.config.notEmpty || 'block';
        // this.copyBtns = this.config.copyBtns || [];
    },
    update() {
        const copyBtns = document.querySelectorAll('.newLink button');
        links.querySelector('#nolink').style.display = this.notEmpty;
        copyBtns.forEach((btn) => {
            btn.onclick = this.copyClick(btn);
        });
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
        links.innerHTML += html;
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
                web.showNormalInput();
                web.getData(ShortenText.value);
                ShortenText.value = '';
            }
        };
        ShortenText.onkeypress = function (e) {
            if (e.keyCode !== 13) {
                web.showNormalInput();
            }
        };
        ShortenText.onfocus = function () {
            web.showNormalInput();
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
        // Toggle links history
        historyBtn.onchange = web.toggleLinkHistory;
    },

    //Function
    toggleLinkHistory() {
        $('.showLink label').classList.toggle('rotate');
        links.classList.toggle('hiddenHistory', false);
        links.classList.toggle('fadeUp', !historyBtn.checked);
    },
    showNormalInput() {
        errorMessage.innerText = '';
        ShortenText.style.borderColor = '';
    },
    copyClick(btn) {
        return () => {
            document.querySelectorAll('.newLink button').forEach((element) => {
                element.innerHTML = 'Copy';
                element.classList.remove('copied');
            });
            //navigator.clipboard.writeText(short);
            btn.innerHTML = 'Copied!';
            btn.classList.add('copied');
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
            elements.forEach((element) => {
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
        const btn = newLink.querySelector(' button');
        btn.onclick = this.copyClick(btn);
        document.querySelectorAll('.newLink button').forEach((btn) => {
            btn.innerHTML = 'Copy';
            btn.classList.remove('copied');
        });
        links.querySelector('#nolink').style.display = 'none';
        web.settingConfig(
            'copyBtns',
            document.querySelectorAll('.newLink button')
        );
        web.settingConfig('notEmpty', 'none');
        historyBtn.checked = true;
        web.toggleLinkHistory();
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
        this.update();
        this.scrollIntoView();
        this.eventHandler();
    }
};

// Start
web.start();

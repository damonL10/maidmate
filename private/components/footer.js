class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="footer-left">
                <div class="footer-box">
                    <h4>Provider</h4>
                    <a href="/provider_login.html">Being Provider</a>
                    <a href="/provider_login.html">Provider Login</a>
                </div>
                <div class="footer-box">
                    <h4>Menu</h4>
                    <a href="#">About Us</a>
                    <a href="#">Contact</a>
                    <a href="#">Q & A</a>
                </div>
            </div>
            <div class="footer-right">
                <div class="footer-right-top">
                    <div class="footer-social">
                        <i class="bx bxl-facebook"></i>
                        <i class="bx bxl-twitter"></i>
                        <i class="bx bxl-youtube"></i>
                    </div>
                    <div class="footer-logo">
                        <span>maid mate</span><i class="bx bx-home-smile"></i>
                    </div>
                </div>
                <div class="footer-right-bottom">
                    <a href="#">
                        <button>
                            <span>top</span><i class="bx bx-up-arrow-alt"></i>
                        </button>
                    </a>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define("footer-component", Footer);

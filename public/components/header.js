onload();

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = /*html*/ `
            <header>
                <span>
                    <i class="bx bx-home-smile"></i>
                    <h1><a href="/">MAID MATE</a></h1>
                    <ul>
                        <li><a href="#">ABOUT US</a></li>
                        <li><a href="#">CONTACT US</a></li>
                        <li><a href="#">Q&A</a></li>
                    </ul>
                </span>
                <a href="/login"><button>login</button></a>
            </header>
        `;
    }
}

class UserLoginHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = /*html*/ `
            <header>
                <span>
                    <i class="bx bx-home-smile"></i>
                    <h1><a href="/">MAID MATE</a></h1>
                    <ul>
                        <li><a href="#">ABOUT US</a></li>
                        <li><a href="#">CONTACT US</a></li>
                        <li><a href="#">Q&A</a></li>
                        <li><a href="" id="logout">LOGOUT</a></li>
                    </ul>
                </span>
                <a class="user-center" href="/center">
                    <span>Hello, Service user.</span>
                    <i class='bx bx-user'></i>
                </a>
            </header>
        `;
    }
}

async function onload() {
    const resp = await fetch("/user");
    const data = await resp.json();
    const isLogin = data.id !== null;
    const urlParams = new URLSearchParams(window.location.search);

    customElements.define(
        "header-component",
        isLogin ? UserLoginHeader : Header
    );

    if (isLogin) {
        document
            .querySelector("#logout")
            .addEventListener("click", async () => {
                const resp = await fetch("/logout", { method: "PUT" });
                if (resp.status === 200) {
                    location.reload();
                }
            });
    }

    if (window.location.pathname === "/service") {
        document
            .querySelector("#booking_btn")
            .addEventListener("click", async () => {
                if (isLogin) {
                    window.location = `/book?service=${urlParams.get("id")}`;
                } else {
                    window.location = `/login?service=${urlParams.get("id")}`;
                }
            });
    }
}

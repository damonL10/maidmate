const urlParams = new URLSearchParams(window.location.search);

window.onload = () => {
    userLogin();
    userRegister();
};

function userLogin() {
    document
        .querySelector("#form-login")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const form = e.target;
            const email = form.login_email.value;
            const password = form.login_password.value;

            const formBody = { email: email, password: password };

            const resp = await fetch("/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(formBody),
            });

            const data = await resp.json();

            if (resp.status !== 201) {
                document.querySelector(
                    "#login-error-msg"
                ).innerHTML = `${data.message}`;
            } else if (urlParams.has("service")) {
                window.location.href = `/book?service=${urlParams.get(
                    "service"
                )}`;
            } else {
                window.location.href = "/";
            }
        });
}

function userRegister() {
    document
        .querySelector("#form-register")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            console.log(`hello`);
            const form = e.target;
            const email = form.register_email.value;
            const password = form.register_password.value;
            const confirm_password = form.register_confirm_password.value;

            if (!email || !password || !confirm_password) {
                document.querySelector(
                    "#register-error-msg"
                ).innerHTML = `please input value`;
            } else if (password !== confirm_password) {
                document.querySelector(
                    "#register-error-msg"
                ).innerHTML = `wrong password`;
            } else {
                const formBody = { email: email, password: password };
                const resp = await fetch("/register", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify(formBody),
                });

                const data = await resp.json();

                if (resp.status !== 201) {
                    document.querySelector(
                        "#register-error-msg"
                    ).innerHTML = `${data.message}`;
                } else if (urlParams.has("service")) {
                    window.location.href = `/book?service=${urlParams.get(
                        "service"
                    )}`;
                } else {
                    window.location.href = "/";
                }
            }
        });
}

const urlParams = new URLSearchParams(window.location.search);

window.onload = () => {
    getServiceData();
};

async function getServiceData() {
    const serviceId = urlParams.get("id");
    const formBody = { serviceId };

    const resp = await fetch("/services", {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(formBody),
    });

    const data = await resp.json();

    if (resp.status !== 201) {
        window.location.href = "/404.html";
    } else {
        document.querySelector(
            "#service-name"
        ).innerHTML = `${data.category_name}`;
    }
}

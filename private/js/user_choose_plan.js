const urlParams = new URLSearchParams(window.location.search);
let renderProvider = false;

window.onload = () => {
    getServiceData();
};

async function getServiceData() {
    const serviceId = urlParams.get("service");
    const formBody = { serviceId };

    const resp = await fetch("/services/books", {
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
        let userChoose = {
            category: data.categories.id,
            plan: 0,
            region: 0,
            date: "",
            timeSection: 0,
            providerId: 0,
        };

        // service name
        document.querySelector(
            "#service-name"
        ).innerHTML = `${data.categories.name}`;

        // choose plan
        const choose_plan = document.querySelector("#choose-plan");

        let planHtmlStr = ``;
        for (let plans of data.plans) {
            planHtmlStr += /*html*/ `
            <div class="choose-item">
                <input
                    type="radio"
                    id="plan_${plans.id}"
                    name="service_plan"
                    value="plan_${plans.id}"
                />
                <label for="plan_${plans.id}">
                    <div class="choose-subtitle">
                        <span>Plan ${plans.id} - ${plans.plan_hour} HR</span>
                        <span>$${plans.plan_price} / hr</span>
                    </div>
                    <div>
                        ${plans.plan_description}
                    </div>
                </label>
            </div>
            `;
        }
        choose_plan.innerHTML = planHtmlStr;

        choose_plan.addEventListener("change", (e) => {
            userChoose.plan = Number(e.target.value.split("_")[1]);
        });

        // choose region
        const choose_region = document.querySelector("#choose-region");

        let regionHtmlStr = ``;
        for (let regions of data.regions) {
            regionHtmlStr += /*html*/ `
                <div class="choose-item">
                    <input
                        type="radio"
                        id="region_${regions.id}"
                        name="service_region"
                        value="region_${regions.id}"
                    />
                    <label for="region_${regions.id}">
                        <span>${regions.region_name}</span>
                    </label>
                </div>
            `;
        }

        choose_region.innerHTML = regionHtmlStr;

        choose_region.addEventListener("change", (e) => {
            userChoose.region = Number(e.target.value.split("_")[1]);
            if (renderProvider) {
                getProvider(userChoose);
            }
        });

        // choose date
        calendar();

        if (document.querySelector('input[name="calendar"]')) {
            document.querySelectorAll('input[name="calendar"]').forEach((e) => {
                e.addEventListener("change", (event) => {
                    userChoose.date = event.target.value;
                    if (renderProvider) {
                        getProvider(userChoose);
                        location.href = "#choose-5";
                    }
                });
            });
        }

        // choose time section
        const choose_time = document.querySelector("#choose-time");
        let timeHtmlStr = ``;
        let timeSection = [
            "Morning (9:00-13:00)",
            "Afternoon (13:00-17:00)",
            "Evening (17:00-21:00)",
        ];
        for (let index in timeSection) {
            let timeSectionId = Number(index) + 1;
            timeHtmlStr += /*html*/ `
                <div class="choose-item">
                    <input
                        type="radio"
                        id="time_${timeSectionId}"
                        name="service_time"
                        value="time_${timeSectionId}"
                    />
                    <label for="time_${timeSectionId}">
                        <span>${timeSection[index]}</span>
                    </label>
                </div>
            `;
        }
        choose_time.innerHTML = timeHtmlStr;

        choose_time.addEventListener("change", async (e) => {
            userChoose.timeSection = Number(e.target.value.split("_")[1]);
            getProvider(userChoose);
            renderProvider = true;
        });

        // choose provider
        document
            .querySelector("#choose-provider")
            .addEventListener("change", (e) => {
                userChoose.providerId = Number(e.target.value.split("_")[1]);
                document.querySelector("#choose-6").style.display = "block";
                location.href = "#choose-6";
            });

        // term
        document.querySelector("#term").addEventListener("change", () => {
            if (document.querySelector("#term").checked) {
                document.querySelector(".error-msg").textContent = ``;
            }
        });

        // next button
        document
            .querySelector("#next-button")
            .addEventListener("click", (e) => {
                e.preventDefault();

                if (document.querySelector("#term").checked) {
                    let userChose = window.btoa(
                        unescape(encodeURIComponent(JSON.stringify(userChoose)))
                    );
                    location.href = `/order?${userChose}`;
                } else {
                    document.querySelector(".error-msg").textContent =
                        "please check the term.";
                }
            });
    }
    clickAction();
}

async function getProvider(formBody) {
    const resp = await fetch("/services/providers", {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(formBody),
    });

    const data = await resp.json();

    const choose_provider = document.querySelector("#choose-provider");

    if (resp.status !== 200) {
        // can't find provider
        if (document.querySelector("#choose-6")) {
            document.querySelector("#choose-6").style.display = "none";
        }
        choose_provider.innerHTML = /*html*/ `
            <div class="noProvider-msg"><i class='bx bx-error-circle'></i>${data.message}</div>
            `;
    } else {
        // find provider
        let providerHtmlStr = ``;
        for (let providers of data.providers) {
            let providerId = `provider_${providers.provider_id}`;
            providerHtmlStr += /*html*/ `
                <div class="choose-item">
                    <input
                        type="radio"
                        id="${providerId}"
                        name="service_provider"
                        value="${providerId}"
                    />
                    <label for="${providerId}">
                        ${
                            providers.provider_avatar !== null
                                ? `<img class="provider_image" src="/uploads/${providers.provider_avatar}" alt="provider-avatar">`
                                : `
                                <div class="provider_photo">
                                    <i class="bx bx-user"></i>
                                    <p>Provider Image</p>
                                </div>
                                `
                        }
                        <div class="choose-subtitle">
                            <span class="choose-provider-name">
                                ${providers.provider_name}
                            </span>
                            <span></span>
                        </div>
                        <div class="star-box">
                            <i class="bx bxs-star"></i>
                            <i class="bx bxs-star"></i>
                            <i class="bx bxs-star"></i>
                            <i class="bx bxs-star"></i>
                            <i class="bx bxs-star"></i>
                        </div>
                    </label>
                </div>
            `;
        }
        choose_provider.innerHTML = providerHtmlStr;
    }
}

function clickAction() {
    for (let i = 1; i < 7; i++) {
        if (i + 1 < 7) {
            document.querySelector(`#choose-${i + 1}`).style.display = "none";
        }
        document
            .querySelectorAll(`#choose-${i} input[type="radio"]`)
            .forEach((section) => {
                section.addEventListener("click", () => {
                    document.querySelector(`#choose-${i + 1}`).style.display =
                        "block";
                    location.href = `#choose-${i + 1}`;
                });
            });
    }
}

function calendar() {
    const chooseDate = document.querySelector("#calendar");
    let dateHtmlStr = ``;
    for (i = 0; i < 2; i++) {
        dateHtmlStr += /*html*/ `
            <div class="choose-month">
                <div id="calendar-month-${i}" class="month"></div>
                <div id="calendar-days-${i}" class="choose-days"></div>
            </div>
        `;
    }
    chooseDate.innerHTML = dateHtmlStr;

    for (i = 0; i < 2; i++) {
        renderCalendar(`#calendar-month-${i}`, `#calendar-days-${i}`, i);
    }
}

function renderCalendar(titleId, dayId, order) {
    const currentMonthTitle = document.querySelector(titleId);
    const currentDays = document.querySelector(dayId);

    let date = new Date(),
        currMonth = date.getMonth() + order,
        currYear = date.getFullYear();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let firstDateOfMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayOfMonth = new Date(
            currYear,
            currMonth,
            lastDateOfMonth
        ).getDay(),
        lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let calendarHtmlStr = ``;

    for (let week of weeks) {
        calendarHtmlStr += /*html*/ `
                <div class="weekdays">${week}</div>
            `;
    }

    for (let i = firstDateOfMonth; i > 0; i--) {
        let previousMonthDate = ``;
        calendarHtmlStr += /*html*/ `
                <div class="inactive">${lastDateOfLastMonth - i + 1}</div>
            `;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        let currentMonthDate = `${currYear}-${currMonth + 1}-${i}`;
        let isToday =
            i === date.getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear()
                ? "active"
                : "";
        let pastDay =
            i < date.getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear()
                ? "disabled"
                : "";

        calendarHtmlStr += /*html*/ `
            <input
                type="radio"
                id="${currentMonthDate}"
                name="calendar"
                value="${currentMonthDate}"
                ${pastDay}
            />
            <label class="${isToday}" for="${currentMonthDate}">
                <div>${i}</div>
            </label>
            `;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        calendarHtmlStr += /*html*/ `
                <div class="inactive">${i - lastDayOfMonth + 1}</div>
            `;
    }

    currentMonthTitle.innerText = `${months[currMonth]} ${currYear}`;
    currentDays.innerHTML = calendarHtmlStr;
}

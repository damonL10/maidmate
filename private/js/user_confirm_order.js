const urlParams = new URLSearchParams(window.location.search);

window.onload = async () => {
    try {
        const userChose = JSON.parse(
            decodeURIComponent(
                escape(window.atob(window.location.search.slice(1)))
            )
        );
        const userChoseDate = await getServiceData(userChose);
        submitChecking(userChoseDate);
    } catch (e) {
        window.location.href = "/404.html";
    }
};

async function getServiceData(userChose) {
    const formBody = { userChose };
    const resp = await fetch("/services/orderInfo", {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(formBody),
    });

    const data = await resp.json();

    if (resp.status !== 201) {
        console.log(data.message);
    } else {
        const service_name = data.data.category_name;
        const service_date = userChose.date;
        const service_start_time = data.data.time_section;
        const service_provider_id = userChose.providerId;
        const service_provider_avatar = data.data.provider_avatar;
        const service_provider_full_name = data.data.provider_name;
        const service_plan_id = data.data.plan_id;
        const service_plan_hour = data.data.plan_hour;
        const service_plan_price = data.data.plan_price;
        const service_plan_description = data.data.plan_description;
        const order_total_amount = data.data.plan_hour * data.data.plan_price;

        document.querySelector("#service-name").innerText = service_name;
        document.querySelector("#service-date").innerText = service_date;
        document.querySelector("#service-time").innerText = service_start_time;

        document.querySelector("#provider_image").innerHTML =
            service_provider_avatar !== null
                ? `<img class="provider_image" src="/uploads/${service_provider_avatar}" alt="provider-avatar">`
                : `
                <div class="provider_photo">
                    <i class="bx bx-user"></i>
                    <p>Provider Image</p>
                </div>
                `;

        document.querySelector("#provider-name").innerText =
            service_provider_full_name;
        document.querySelector("#plan-id").innerText = service_plan_id;
        document.querySelector("#plan-hour").innerText = service_plan_hour;
        document.querySelector("#plan-price").innerText = service_plan_price;
        document.querySelector("#order-amount").innerText = order_total_amount;
        document.querySelector("#plan-description").innerText =
            data.data.plan_description;
        document.querySelector("#user_region").value = data.data.region_name;

        return {
            service_name,
            service_date,
            service_start_time,
            service_provider_id,
            service_provider_avatar,
            service_provider_full_name,
            service_plan_id,
            service_plan_hour,
            service_plan_price,
            service_plan_description,
            order_total_amount,
        };
    }
}

function submitChecking(data) {
    const userChoseData = data;
    document.querySelector("#submit-button").addEventListener("click", (e) => {
        e.preventDefault();

        const service_date = userChoseData.service_date;
        const service_start_time = userChoseData.service_start_time;
        const service_user_full_name =
            document.querySelector("#user_full_name").value;
        const service_user_phone_no =
            document.querySelector("#user_phone_number").value;
        const service_user_service_region =
            document.querySelector("#user_region").value;
        const service_user_address =
            document.querySelector("#user_address").value;
        const service_user_payment =
            document.querySelector("#user_payment").value;
        const order_total_amount = userChoseData.order_total_amount;
        const service_provider_id = userChoseData.service_provider_id;
        const service_provider_full_name =
            userChoseData.service_provider_full_name;
        const service_provider_avatar = userChoseData.service_provider_avatar;
        const service_name = userChoseData.service_name;
        const service_plan_id = userChoseData.service_plan_id;
        const service_plan_hour = userChoseData.service_plan_hour;
        const service_plan_price = userChoseData.service_plan_price;
        const service_plan_description = userChoseData.service_plan_description;
        const user_remark = document.querySelector("#user_remark").value;

        document.querySelector(`#user_full_name + #input-error`).innerHTML =
            service_user_full_name === "" ? `*required` : ` `;
        document.querySelector(`#user_phone_number + #input-error`).innerHTML =
            service_user_phone_no === "" ? `*required` : ` `;
        document.querySelector(`#user_address + #input-error`).innerHTML =
            service_user_address === "" ? `*required` : ` `;
        document.querySelector(`#user_payment + #input-error`).innerHTML =
            service_user_payment === "" ? `*required` : ` `;

        if (
            service_user_full_name !== "" &&
            service_user_phone_no !== "" &&
            service_user_address !== "" &&
            service_user_payment !== ""
        ) {
            submit({
                service_date,
                service_start_time,
                service_user_full_name,
                service_user_phone_no,
                service_user_service_region,
                service_user_address,
                service_user_payment,
                order_total_amount,
                service_provider_id,
                service_provider_full_name,
                service_provider_avatar,
                service_name,
                service_plan_id,
                service_plan_hour,
                service_plan_price,
                service_plan_description,
                user_remark,
            });
        }
    });
}

async function submit(insertData) {
    const formBody = insertData;

    const resp = await fetch("/services/ConfirmOrder", {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(formBody),
    });

    const data = await resp.json();

    if (resp.status !== 201) {
        console.log(data.message);
    } else {
        location.href = `/orderDetail/${data.orderId}`;
    }
}

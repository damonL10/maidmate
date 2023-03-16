window.onload = async () => {
    await getOrderData();
};

async function getOrderData() {
    const orderId = window.location.pathname.split("/").pop();
    const resp = await fetch(`/orderDetail/${orderId}`, {
        method: "POST",
    });

    const data = await resp.json();

    if (resp.status !== 201) {
        console.log(data.message);
    } else {
        const {
            order_id,
            status,
            service_name,
            selected_date,
            service_start_time,
            service_provider_full_name,
            service_provider_avatar,
            service_plan_id,
            service_plan_hour,
            service_plan_price,
            service_user_full_name,
            service_user_phone_no,
            service_region,
            service_user_address,
            service_user_payment,
            service_plan_description,
            order_total_amount,
            service_user_remark,
        } = data.data;

        document.querySelector(".order-id").innerText = `#${order_id
            .split("-")
            .pop()}`;

        document.querySelector(".order-status").innerText = status;

        document.querySelector(".order-subtitle").innerText = service_name;

        const service_date = new Date(selected_date);
        const service_date_str = `${service_date.getFullYear()}-${service_date.getMonth()}-${service_date.getDate()}`;
        document.querySelector("#service-date").innerText = service_date_str;

        document.querySelector("#service-time").innerText = service_start_time;
        document.querySelector(".provider-info-name").innerText =
            service_provider_full_name;

        document.querySelector("#provider_image").innerHTML =
            service_provider_avatar !== null
                ? `<img class="provider_image" src="/uploads/${service_provider_avatar}" alt="provider-avatar">`
                : `
                <div class="provider_photo">
                    <i class="bx bx-user"></i>
                    <p>Provider Image</p>
                </div>
                `;

        document.querySelector("#plan-id").innerText = service_plan_id;
        document.querySelector("#plan-hour").innerText = service_plan_hour;
        document.querySelector("#plan-price").innerText = service_plan_price;
        document.querySelector("#plan-description").innerText =
            service_plan_description;
        document.querySelector("#user-name").innerText = service_user_full_name;
        document.querySelector("#user-phone").innerText = service_user_phone_no;
        document.querySelector("#user-region").innerText = service_region;
        document.querySelector("#user-address").innerText =
            service_user_address;

        let payment = ["", "Payment A", "Payment B", "Payment C"];
        document.querySelector("#user-payment").innerText =
            payment[service_user_payment];
        document.querySelector("#order-amount").innerText = order_total_amount;

        if (!service_user_remark) {
            document.querySelector("#remark-box").style.display = "none";
        } else {
            document.querySelector("#user_remark").value = service_user_remark;
        }
    }
}

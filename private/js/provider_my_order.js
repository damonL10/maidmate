window.onload = () => {
    providerGetMyOrders();
};

async function providerGetMyOrders() {
    const respon = await fetch("/provider/provider_myorders");
    const providerMyOrders = await respon.json();
    console.log(providerMyOrders);

    let newOrderHtmlStr = ``;
    for (const order of providerMyOrders) {
        const status = order.status;
        const acceptOrDeclineButtons =
            status == "pending"
                ? `<div><button class ="accept-button" name="accepted" data-buttonid="${order.order_id}" type="submit">accept</button><button class ="decline-button" name="declined" data-buttonid="${order.order_id}" type="submit">Decline</button></div>`
                : "";
        const completeButton =
            status == "accepted"
                ? `<button class ="complete-button" name="completed" data-buttonid="${order.order_id}" type="submit">complete</button>`
                : "";
        const newOrders =
            status !== "completed"
                ? `<div class="order-box">
      <div class="first-col">
        <span id= "service-span">${order.service_name}</span>
        <span id= "id-span">Order No.#${order.order_id
            .split("-")
            .pop()}</span>    
      </div>
      <div class="second-col">
        <div>
          <span id="selected-date-span">Service start on: ${new Date(
              order.selected_date
          ).toString("dd-MMM-yyyy")}</span>
          <span id="start-time-span"> at ${order.service_start_time}</span>
          <span id="selected-date-span"> | Service Region at: ${
              order.service_region
          }</span>
        </div>

        <div class="second-col-bottom">
          <span id="stat-span">${order.status}</span>
          <div>
            ${acceptOrDeclineButtons}
            ${completeButton}
          </div>
        </div>
      </div>
    </div>`
                : "";
        newOrderHtmlStr += `${newOrders}`;
    }
    document.querySelector("#order_list").innerHTML = newOrderHtmlStr;

    let completedOrderHtmlStr = ``;
    for (const order of providerMyOrders) {
        const status = order.status;
        const completedOrders =
            status == "completed"
                ? `<div class="order-box">
      <div class="first-col">
      <span id= "service-span">${order.service_name}</span>
      <span id= "id-span">Order No.#${order.order_id
          .split("-")
          .pop()}</span>    
      </div>
      <div class="second-col">
      <div>
        <span id="selected-date-span">Service start on: ${new Date(
            order.selected_date
        ).toString("dd-MMM-yyyy")}</span>
        <span id="start-time-span"> at ${order.service_start_time}</span>
        <span id="selected-date-span"> | Service Region at: ${
            order.service_region
        }</span>
      </div>
        <span id="stat-span">${order.status}</span>
      </div>
    </div>`
                : "";
        completedOrderHtmlStr += `${completedOrders}`;
    }
    document.querySelector("#completed_order_list").innerHTML =
        completedOrderHtmlStr;

    document.querySelectorAll(".second-col .accept-button").forEach((ele) =>
        ele.addEventListener("click", async (e) => {
            const acceptBtn = e.target;
            const orderId = acceptBtn.dataset.buttonid;
            console.log(orderId);
            const status = acceptBtn.name;
            console.log(status);
            acceptBtn.style.visibility = "hidden";
            await fetch(`/provider/provider_myorders/${orderId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ status }),
            });
            providerGetMyOrders();
        })
    );

    document.querySelectorAll(".second-col .decline-button").forEach((ele) =>
        ele.addEventListener("click", async (e) => {
            const declineBtn = e.target;
            const orderId = declineBtn.dataset.buttonid;
            console.log(orderId);
            const status = declineBtn.name;
            console.log(status);
            declineBtn.style.visibility = "hidden";
            await fetch(`/provider/provider_myorders/${orderId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ status }),
            });
            providerGetMyOrders();
        })
    );

    document.querySelectorAll(".second-col .complete-button").forEach((ele) =>
        ele.addEventListener("click", async (e) => {
            const completeBtn = e.target;
            const orderId = completeBtn.dataset.buttonid;
            console.log(orderId);
            const status = completeBtn.name;
            console.log(status);
            completeBtn.style.visibility = "hidden";
            await fetch(`/provider/provider_myorders/${orderId}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ status }),
            });
            providerGetMyOrders();
        })
    );
}

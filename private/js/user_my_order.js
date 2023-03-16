window.onload = () => {
    loadOrders();
};

async function loadOrders() {
    const resp = await fetch("/orders_preview");
    const myorders = await resp.json();
    console.log(myorders);

    let htmlStr1 = ``;
    for (const myorder of myorders) {
        if (myorder.status !== `completed`) {
            htmlStr1 += `<div class="order-box">
            <div class="first-col">
              <span id= "service-span">${myorder.service_name}</span>
              <span id= "id-span">#${myorder.order_id
                  .split("-")
                  .pop()}</span>   
            </div>
            <div class="second-col">
              <div>
                <span id="selected-date-span">Service start at: ${new Date(
                    myorder.selected_date
                ).toString("dd-MMM-yyyy")}</span>
                <span id="start-time-span"> | ${
                    myorder.service_start_time
                }</span>
              </div>
              <div id="stat-span">${myorder.status}</div>
            </div>
          </div>
        `;
        }
        document.querySelector("#order-list").innerHTML = htmlStr1;
    }
    let hasCompletedOrders = false;

    let htmlStr = ``;
    for (const myorder of myorders) {
        if (
            myorder.status !== `accepted` &&
            myorder.status !== `pending` &&
            myorder.status !== `declined` &&
            myorder.status !== `payment` &&
            myorder.status !== `refund`
        ) {
            hasCompletedOrders = true;
            htmlStr += `<div class="order-box">
            <div class="first-col">
              <span id= "service-span">${myorder.service_name}</span>
              <span id= "id-span">#${myorder.order_id}</span>    
            </div>
            <div class="second-col">
              <div>
                <span id="selected-date-span">Service start at: ${new Date(
                    myorder.selected_date
                ).toString("dd-MMM-yyyy")}</span>
                <span id="start-time-span"> | ${
                    myorder.service_start_time
                }</span>
              </div>
              <div id="stat-span">${myorder.status}</div>
            </div>
          </div>
        `;
        }
        document.querySelector("#order-board").innerHTML = htmlStr;

        document.querySelector(".order-box").addEventListener("click", () => {
            window.location.href = `/orderDetail/${myorders[0].order_id}`;
        });
    }
}

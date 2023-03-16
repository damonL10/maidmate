window.onload = async () => {
    registerProvider();
    initLoginForm();
};

function initLoginForm() {
    document.querySelector("#form_login").addEventListener("submit", async (event) => {
        event.preventDefault();
        // console.log("debug: going into login");
        const form = event.target;
        const email = form.login_email.value;
        const password = form.login_password.value;
        // console.log("debug: going thru login");
        const respon = await fetch("/providerLogin", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        })
        if (respon.status === 200) {
            // console.log("debug: going to redirect to provider panel");
            window.location = "/provider_mytask.html";
        }
    });
};

function registerProvider() {
    document.querySelector("#form_register").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData();
        formData.append("email", form.email.value); // "email"係跟server個key; form.email透過form的name攞
        formData.append("password", form.password.value);
        formData.append("full_name", form.full_name.value);
        formData.append("phone_no", form.phone_no.value);
        formData.append("avatar", form.avatar.files[0]);

        // const service_category_boxes = document.getElementsByName('service_category');
        const service_category_boxes = document.querySelectorAll('input[name="service_category"]:checked');
        let service_category_array = [];
        service_category_boxes.forEach((box) => {
            // formData.append("service_category[]", box.value);
            service_category_array.push(box.value);
        });
        // console.log(formData.getAll("service_category"));
        formData.append("service_category", JSON.stringify(service_category_array));
        console.log(service_category_array)

        const service_region_boxes = document.querySelectorAll('input[name="service_region"]:checked');
        let service_region_array = [];
        service_region_boxes.forEach((box) => {
            service_region_array.push(box.value);
        });
        formData.append("service_region", JSON.stringify(service_region_array));
        console.log(service_region_array)
        
        const weekdays_boxes = document.querySelectorAll('input[name="weekdays"]:checked');
        let weekdays_array = [];
        weekdays_boxes.forEach((box) => {
            weekdays_array.push(box.value);
        });
        formData.append("weekdays", JSON.stringify(weekdays_array));
        console.log(weekdays_array)
        
        const time_section_boxes = document.querySelectorAll('input[name="time_section"]:checked');
        let time_section_array = [];
        time_section_boxes.forEach((box) => {
            time_section_array.push(box.value);
        });
        formData.append("time_section", JSON.stringify(time_section_array));
        console.log(time_section_array)

        const respon = await fetch("/registerProvider", {  // send request去server
            method: "POST", 
            body: formData,
        });
        
        console.log(respon.status);
        if (respon.status === 200) {
            form.reset();
            console.log("from frontend: register success!!!");
        } else {
            const data = await respon.json();
            console.log(data.message);
        }
    });
};
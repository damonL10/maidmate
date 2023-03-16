window.onload = async () => {
   
    // loadAdminInfo();
    // loadMemos();
    initLoginForm();
  };
  
  function initLoginForm() {
    document.querySelector("#form_login").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      const username = form.username.value;
      const password = form.password.value;
  
      const resp = await fetch("/admin_login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (resp.status === 200) {
       window.location = "/admin_panel.html"
      } else {
        
      }
    });
  }
//   async function loadAdminInfo() {
//     const resp = await fetch("/admin_panel");
//     if (resp.status === 200) {
//       const user = await resp.json();
//       const welcomeTitle = document.createElement("h1");
//       welcomeTitle.textContent = `Welcome Back, ${user.username}`;
//       document.querySelector("#welcome").appendChild(welcomeTitle);
//       document.querySelector("#form-login").innerHTML = "";
//     }
//   }

  
//   async function loadMemos() {
//     const resp = await fetch("/memos");
//     const memos = await resp.json();
//     console.log(memos);
  
    // Version 1
//     let htmlStr = ``;
//     for (const memo of memos) {
//       htmlStr += `<div class="memo" id="memo-${memo.id}">
//           <div contenteditable="true">${memo.content}</div>
//           <div class="button-div">
//           <i class="bi bi-trash"></i>
//           <i class="bi bi-pen"></i>
//           </div>
//       </div>
//       `;
//     }
//     document.querySelector("#memo-board").innerHTML = htmlStr;
//   }

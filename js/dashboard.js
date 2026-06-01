let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location = "login.html";
}

document.getElementById("userName").innerText = user.name;

document.getElementById("userEmail").innerText = user.email;

document.getElementById("welcomeUser").innerText = user.name;

// Role Wise Dashboard

let roleContent = document.getElementById("roleContent");

if (user.role === "Admin") {
  roleContent.innerHTML = `
<div class="card p-4 shadow">
<h4>Admin Dashboard</h4>
<p>Manage Users & Projects</p>
</div>
`;
}

if (user.role === "Engineer") {
  roleContent.innerHTML = `
<div class="card p-4 shadow">
<h4>Engineer Dashboard</h4>
<p>Manage Site Activities</p>
</div>
`;
}

if (user.role === "Contractor") {
  roleContent.innerHTML = `
<div class="card p-4 shadow">
<h4>Contractor Dashboard</h4>
<p>Manage Construction Tasks</p>
</div>
`;
}

// Logout

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");

  window.location = "index.html";
});

// Empty Tabs => 404

document.querySelectorAll(".empty-tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();

    window.location = "404.html";
  });
});

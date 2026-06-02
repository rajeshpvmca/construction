// Check if user is logged in
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

let currentSection = "overview";

// Preloader handling
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
      // Initialize AOS after preloader
      if (typeof AOS !== "undefined") {
        AOS.init({ duration: 1000, once: true });
      }
      renderRoleDashboard();
      setupNavigation();
      initSidebarToggle();
    }, 2000);
  }
});

/**
 * Modern Chart.js Initialization
 */
function initCharts() {
  if (currentSection !== "overview") return;

  const ctx1 = document.getElementById("chartAnalytics1");
  const ctx2 = document.getElementById("chartAnalytics2");

  if (!ctx1 || !ctx2) return;

  // Shared Chart Configuration
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
    scales: {
      y: { 
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
        ticks: { font: { size: 10 } },
      },
      x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } },
    },
  };

  if (user.role === "Admin") {
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Weekly Budget Utilization ($)",
            data: [1200, 2100, 1800, 3200, 2400, 4500, 3800],
            borderColor: "#ff5e14",
            backgroundColor: "rgba(255,94,20,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: lineOptions,
    });

    new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["Residential", "Commercial", "Industrial"],
        datasets: [
          {
            data: [45, 30, 25],
            backgroundColor: ["#001659", "#ff5e14", "#adb5bd"],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 11 } },
          },
        },
      },
    });
  } else if (user.role === "Engineer") {
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Site A", "Site B", "Site C", "Site D", "Site E"],
        datasets: [
          {
            label: "Safety Compliance (%)",
            data: [98, 85, 92, 78, 88],
            borderColor: "#001659",
            backgroundColor: "rgba(0, 22, 89, 0.1)",
            fill: true,
            tension: 0.3
          },
        ],
      },
      options: lineOptions,
    });

    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Foundation", "Framing", "Plumbing", "Electrical", "Finish"],
        datasets: [
          {
            label: "Phase Progress (%)",
            data: [100, 85, 40, 20, 5],
            backgroundColor: "#ff5e14",
            borderRadius: 6
          },
        ],
      },
      options: lineOptions,
    });
  } else {
    // Contractor
    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: ["Cement", "Steel", "Bricks", "Sand", "Paint"],
        datasets: [
          {
            label: "Stock Level (%)",
            data: [85, 40, 90, 65, 30],
            backgroundColor: (context) => {
              const val = context.dataset.data[context.dataIndex];
              return val < 50 ? "#dc3545" : "#ff5e14";
            },
            borderRadius: 5
          },
        ],
      },
      options: lineOptions,
    });

    new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["On Duty", "Off Duty", "On Leave"],
        datasets: [
          {
            data: [120, 15, 8],
            backgroundColor: ["#198754", "#6c757d", "#ff5e14"],
            borderWidth: 0
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "70%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 10 } }
        }
      },
    });
  }
}

function setupNavigation() {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      currentSection = link.getAttribute("data-section");
      updateSectionHeader();
      renderRoleDashboard();

      // Refresh AOS for new content
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    });
  });
}

function updateSectionHeader() {
  const desc = document.getElementById("sectionDescription");
  const descriptions = {
    overview: "Monitor your construction projects and site performance.",
    schedule: "Track site inspections, labor shifts, and deadlines.",
    profile: "Manage your professional credentials and account info.",
    payments: "Track project budgets, invoices, and material costs.",
    settings: "System configurations and notification settings.",
  };
  if (desc) desc.innerText = descriptions[currentSection] || "";
}

function initSidebarToggle() {
  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (toggleBtn && sidebar && overlay) {
    const toggle = () => {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
      // Only lock vertical scroll to preserve horizontal hidden state
      document.body.style.overflowY = sidebar.classList.contains("show")
        ? "hidden"
        : "auto";
    };

    toggleBtn.addEventListener("click", toggle);
    overlay.addEventListener("click", toggle);

    // Close when clicking a link on mobile

    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) toggle();
      });
    });
  }
}

function renderRoleDashboard() {
  const userNameEl = document.getElementById("userName");
  const welcomeUserEl = document.getElementById("welcomeUser");
  const roleBadgeEl = document.getElementById("userRoleBadge");
  const roleContentEl = document.getElementById("roleContent");

  if (userNameEl) userNameEl.innerText = user.name;
  if (welcomeUserEl) welcomeUserEl.innerText = `Welcome back, ${user.name}!`;
  if (roleBadgeEl) roleBadgeEl.innerText = user.role;

  const templates = {
    Admin: {
      overview: `
      <!-- Stats Section -->
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="bg-primary p-3 rounded-circle text-white d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fa fa-city h4 mb-0"></i>
            </div>
            <span class="badge bg-success">+4 New</span>
          </div>
          <h2 class="fw-bold mb-1">1,250</h2>
          <p class="text-muted small text-uppercase fw-bold mb-0">Total Projects</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="bg-primary p-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="fa-solid fa-money-bill h4 mb-0 text-white"></i></div>
            <span class="badge bg-success">+$2.4k</span>
          </div>
          <h2 class="fw-bold mb-1">$845k</h2>
          <p class="text-muted small text-uppercase fw-bold mb-0">Total Budget</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="bg-primary p-3 rounded-circle text-white d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="fa fa-users h4 mb-0"></i></div>
            <span class="badge bg-warning">12 Active</span>
          </div>
          <h2 class="fw-bold mb-1">350</h2>
          <p class="text-muted small text-uppercase fw-bold mb-0">On-Site Workforce</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="col-lg-8" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Budget Analytics</h5>
            <select class="form-select form-select-sm w-auto border-0 bg-light">
              <option>Last 7 Days</option>
              <option>Monthly</option>
            </select>
          </div>
          <div style="height: 300px;"><canvas id="chartAnalytics1"></canvas></div>
        </div>
      </div>
      <div class="col-lg-4" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Project Distribution</h5>
          <div style="height: 300px;"><canvas id="chartAnalytics2"></canvas></div>
        </div>
      </div>

      <!-- Project Requests Table -->
      <div class="col-lg-8" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
          <h5 class="fw-bold mb-4">New Project Bids</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Client</th>
                  <th>Site Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="fw-bold">Dowson Group</div><span class="small text-muted">tender#8821</span></td>
                  <td><span class="badge bg-dark text-white">Commercial</span></td>
                  <td><span class="text-success small fw-bold">Approved</span></td>
                  <td><button class="btn btn-sm btn-dark rounded-pill px-3">Review</button></td>
                </tr>
                <tr>
                  <td><div class="fw-bold">City Housing</div><span class="small text-muted">tender#8824</span></td>
                  <td><span class="badge bg-light text-dark">Residential</span></td>
                  <td><span class="text-warning small fw-bold">Pending</span></td>
                  <td><button class="btn btn-sm btn-dark rounded-pill px-3">Review</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Admin Actions -->
      <div class="col-lg-4" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100">
          <h5 class="fw-bold mb-4">Quick Actions</h5>
          <button class="btn btn-primary w-100 mb-3 fw-bold rounded-pill">Assign New Project</button>
          <button class="btn btn-outline-light w-100 mb-3 fw-bold rounded-pill">Budget Forecast</button>
          <button class="btn btn-outline-light w-100 fw-bold rounded-pill">Send Notifications</button>
          <div class="mt-4 p-3 bg-white bg-opacity-10 rounded-3">
            <p class="small mb-0">System Status: <span class="text-success fw-bold">Operational</span></p>
            <p class="small mb-0">Last Backup: 2h ago</p>
          </div>
        </div>
      </div>`,
      schedule: `
        <div class="col-12" data-aos="fade-up">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Master Construction Timeline</h5>
            <div class="table-responsive">
              <table class="table table-bordered align-middle">
                <thead class="table-dark">
                  <tr>
                    <th>Phase</th><th>Week 1</th><th>Week 2</th><th>Week 3</th><th>Week 4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Excavation</td><td class="bg-primary text-white fw-bold">Site A</td><td>-</td><td class="bg-primary text-white fw-bold">Site B</td><td>-</td></tr>
                  <tr><td>Foundation</td><td>-</td><td class="bg-dark text-white fw-bold">Site A</td><td>-</td><td class="bg-dark text-white fw-bold">Site B</td></tr>
                  <tr><td>Framing</td><td>-</td><td>-</td><td class="bg-primary text-white fw-bold">Site C</td><td>-</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>`,
      profile: `
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
            <div class="bg-dark p-3 rounded-circle text-white d-flex align-items-center justify-content-center mx-auto" style="width: 50px; height: 50px;">
              <i class="fa fa-user-tie h4 mb-0"></i>
            </div>
            <h4 class="fw-bold">${user.name}</h4>
            <p class="text-muted">Company Director</p>
            <hr>
            <p class="small text-start"><strong>Access Level:</strong> Super Admin</p>
            <p class="small text-start"><strong>Last Login:</strong> Today, 08:30 AM</p>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Executive Security Settings</h5>
            <div class="mb-3">
              <label class="form-label small fw-bold">Digital Signature Audit</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" checked>
                <label class="form-check-label">Require e-sign for project bids</label>
              </div>
            </div>
            <button class="btn btn-dark rounded-pill px-4">Update Admin Profile</button>
          </div>
        </div>`,
      payments: `
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3">Project Liquidity</h5>
            <h2 class="text-primary fw-bold">$845,400.00</h2>
            <p class="text-muted small">Available Capital for Operations</p>
            <div class="progress mt-3" style="height: 10px;">
              <div class="progress-bar bg-success" style="width: 70%"></div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3">Labor Costs</h5>
            <div class="d-flex justify-content-between mb-2"><span>Engineers (12)</span><span class="fw-bold">$42,000</span></div>
            <div class="d-flex justify-content-between mb-2"><span>Contractors (8)</span><span class="fw-bold">$25,500</span></div>
            <button class="btn btn-outline-dark w-100 mt-3 rounded-pill">Manage Payroll</button>
          </div>
        </div>`,
      settings: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Global ERP Settings</h5>
            <div class="row g-3">
              <div class="col-md-6"><label class="small fw-bold">Company Name</label><input type="text" class="form-control" value="Stackly Construction Management"></div>
              <div class="col-md-6"><label class="small fw-bold">Corporate Email</label><input type="email" class="form-control" value="admin@stackly.com"></div>
              <div class="col-md-4"><label class="small fw-bold">GST Rate (%)</label><input type="number" class="form-control" value="18"></div>
              <div class="col-md-8"><label class="small fw-bold">Maintenance Schedule</label><select class="form-select"><option>Weekly (Sundays)</option><option>Monthly</option></select></div>
            </div>
            <button class="btn btn-primary fw-bold mt-4 rounded-pill px-5">SAVE CHANGES</button>
          </div>
        </div>`,
    },
    Engineer: {
      overview: `
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="text-primary fw-bold mb-1">04</h4>
          <p class="text-muted small mb-0">Active Sites</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="text-primary fw-bold mb-1">12</h4>
          <p class="text-muted small mb-0">Safety Audits</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="text-primary fw-bold mb-1">94%</h4>
          <p class="text-muted small mb-0">Compliance Score</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="400">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="text-primary fw-bold mb-1">05</h4>
          <p class="text-muted small mb-0">Pending Blueprints</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="col-lg-6" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-4">Site Compliance Trend</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics1"></canvas></div>
        </div>
      </div>
      <div class="col-lg-6" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-4">Phase Progress Analytics</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics2"></canvas></div>
        </div>
      </div>

      <div class="col-lg-7" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4"><i class="fa fa-calendar text-primary me-2"></i>Upcoming Site Inspections</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center py-3 border-0 bg-light rounded-3 mb-2">
              <div><span class="fw-bold d-block">Foundation Concrete Test</span><small class="text-muted">Site B - 09:00 AM</small></div>
              <span class="badge bg-dark rounded-pill">Priority: High</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-3 border-0 bg-light rounded-3 mb-2">
              <div><span class="fw-bold d-block">Structural Steel Verification</span><small class="text-muted">Site A - 02:00 PM</small></div>
              <span class="badge bg-dark rounded-pill">Priority: Medium</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-lg-5" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4"><i class="fa fa-tasks text-primary me-2"></i>Site Engineering Tasks</h5>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="task1" checked>
            <label class="form-check-label text-muted text-decoration-line-through" for="task1">Review Site B soil report</label>
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="task2">
            <label class="form-check-label" for="task2">Approve plumbing schematic</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="task3">
            <label class="form-check-label" for="task3">Update daily engineering log</label>
          </div>
        </div>
      </div>`,
      schedule: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Site Inspection Schedule</h5>
            <div class="list-group">
              <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div><i class="fa fa-clock-o me-2 text-primary"></i> 08:30 AM</div>
                <div class="fw-bold">Soil Compaction Test</div>
                <span class="badge bg-success">Confirmed</span>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div><i class="fa fa-clock-o me-2 text-primary"></i> 03:00 PM</div>
                <div class="fw-bold">Blueprint Review Meeting</div>
                <button class="btn btn-sm btn-outline-primary">Join Call</button>
              </div>
            </div>
          </div>
        </div>`,
      profile: `
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
            <div class="bg-dark p-4 rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width:100px; height:100px;">
              <i class="fa fa-hard-hat display-6"></i>
            </div>
              <h4 class="fw-bold mt-3 mb-2">${user.name}</h4>
                <span class="badge bg-primary text-white px-3 py-2 rounded-pill">${user.role}</span>
          </div>
        </div>
        <div class="col-md-8 h-100">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3">Engineering Profile</h5>
            <textarea class="form-control mb-3" rows="5" readonly>Licensed Civil Engineer with a specialization in structural integrity and seismic-resistant design. Expertise in managing large-scale commercial and industrial builds.</textarea>
            <h6 class="fw-bold">Certification Details</h6>
            <p class="text-muted">Certified Structural Specialist, LEED AP Building Design + Construction.</p>
          </div>
        </div>`,
      payments: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Engineering Consulting Fees</h5>
            <table class="table">
              <thead><tr><th>Project</th><th>Service</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                <tr><td>City Tower</td><td>Structural Audit</td><td><span class="badge bg-success">Paid</span></td><td class="fw-bold">$3,350</td></tr>
                <tr><td>Mall Exp.</td><td>Seismic Analysis</td><td><span class="badge bg-warning">Invoiced</span></td><td class="fw-bold">$1,700</td></tr>
              </tbody>
            </table>
          </div>
        </div>`,
      settings: `
        <div class="col-12"><div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-3">Site Alert Preferences</h5>
          <div class="form-check mb-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Instant SMS for Safety Breaches</label></div>
          <div class="form-check mb-2"><input class="form-check-input" type="checkbox"><label class="form-check-label">Daily Automated Progress Emails</label></div>
        </div></div>`,
    },
    Contractor: {
      schedule: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Daily Labor Assignments</h5>
            <div class="alert alert-warning py-3 rounded-4 border-0 shadow-sm">
              <i class="fa fa-info-circle me-2"></i> <strong>Cement Delivery</strong> expected at Site A in 30 minutes!
            </div>
            <div class="list-group list-group-flush mt-3">
              <div class="list-group-item d-flex justify-content-between py-3 border-0 bg-light rounded-4 mb-3">
                <span><i class="fa fa-truck text-primary me-2"></i> Site A - Shift #1</span>
                <span class="fw-bold">Steel Framing Team (12)</span>
                <span class="text-success small fw-bold">On Site</span>
              </div>
            </div>
            <button class="btn btn-dark rounded-pill px-4 mt-2">Assign New Team</button>
          </div>
        </div>`,
      profile: `
        <div class="col-lg-4 text-center">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white shadow" style="width:100px; height:100px;">
              <i class="fa fa-tools" style="font-size:50px;"></i>
            </div>
            <h4 class="fw-bold">${user.name}</h4>
            <p class="text-muted small">${user.email}</p>
            <button class="btn btn-outline-primary btn-sm rounded-pill w-100">Update Profile</button>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Company Details</h5>
            <div class="row g-3">
              <div class="col-md-6"><label class="small fw-bold">Trade Specialty</label><input type="text" class="form-control" value="Civil & Masonry" readonly></div>
              <div class="col-md-6"><label class="small fw-bold">Active Sites</label><input type="number" class="form-control" value="03" readonly></div>
              <div class="col-12"><label class="small fw-bold">Registration License</label><input type="text" class="form-control" value="C-55821-BLD" readonly></div>
            </div>
          </div>
        </div>`,
      payments: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Supply & Material Orders</h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead><tr><th>Date</th><th>Material</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>June 12, 2024</td><td>Reinforced Steel (5 Tons)</td><td>$4,500.00</td><td><span class="text-success">Delivered</span></td></tr>
                  <tr><td>June 10, 2024</td><td>Ultra-Cement (500 Bags)</td><td>$2,200.00</td><td><span class="text-warning">In Transit</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>`,
      settings: `
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Material Alert Thresholds</h5>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Email Newsletters</label></div>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Low Stock Alerts (< 20%)</label></div>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox"><label class="form-check-label">Over-Budget Notifications</label></div>
          </div>
        </div>`,
      overview: `
      <!-- Contractor Operations Highlights -->
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-uppercase small mb-0">Cement Inventory</h6>
            <i class="fa fa-cubes text-primary h4 mb-0"></i>
          </div>
          <h2 class="fw-bold mb-3">450 <small class="h6 text-muted">Bags Left</small></h2>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: 85%"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-uppercase small mb-0">Steel Stock</h6>
            <i class="fa fa-link text-primary h4 mb-0"></i>
          </div>
          <h2 class="fw-bold mb-1">2.1 <small class="h6 text-muted">Tons</small></h2>
          <p class="text-danger small mb-0 fw-bold"><i class="fa fa-arrow-down me-1"></i>Low Stock Alert</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center h-100">
          <h6 class="fw-bold text-uppercase small mb-3">Active Workforce</h6>
          <h4 class="fw-bold mb-3">143 Workers</h4>
          <span class="badge bg-dark text-white rounded-pill">Across 3 Sites</span>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="col-lg-8" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Material Stock Trend</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics1"></canvas></div>
        </div>
      </div>
      <div class="col-lg-4" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Workforce Status</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics2"></canvas></div>
        </div>
      </div>

      <div class="col-lg-7" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100 overflow-hidden position-relative">
          <div class="position-relative z-1">
            <h5 class="text-primary fw-bold mb-1">Critical Task List</h5>
            <h3 class="fw-bold mb-4 text-uppercase">Site A - Day 42</h3>
            <div class="row g-3">
              <div class="col-6">
                <div class="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                  <span class="d-block small text-light opacity-50">Pour Concrete</span>
                  <span class="fw-bold">Level 02 - Slab</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                  <span class="d-block small text-light opacity-50">Duct Installation</span>
                  <span class="fw-bold">Central HVAC</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                  <span class="d-block small text-light opacity-50">Electrical Rough-in</span>
                  <span class="fw-bold">East Wing</span>
                </div>
              </div>
              <div class="col-6 d-flex align-items-center justify-content-center">
                <a href="#" class="text-primary fw-bold text-decoration-none">Full Site Task Map <i class="fa fa-arrow-right ms-2"></i></a>
              </div>
            </div>
          </div>
          <i class="fa fa-cogs position-absolute text-primary opacity-10" style="bottom: -50px; right: -20px; font-size: 200px;"></i>
        </div>
      </div>

      <!-- Procurement Quick Actions -->
      <div class="col-lg-5" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Material Procurement</h5>
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="bg-primary p-2 rounded-circle text-white shadow-sm">
              <i class="fa fa-truck px-1"></i>
            </div>
            <div>
              <p class="mb-0 fw-bold">Recent Order: ORD-881</p>
              <p class="small text-muted mb-0">Arriving in 2 Days</p>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 mb-4">
            <h6 class="small fw-bold text-uppercase mb-2">Vendor Notification</h6>
            <div class="d-flex align-items-center gap-2">
              <i class="fa fa-info-circle text-primary"></i>
              <p class="small mb-0">Ultra-Cement prices increased by 5% today.</p>
            </div>
          </div>
          <button class="btn btn-outline-primary btn-dark w-100 rounded-pill fw-bold py-2 mt-auto text-white">Request New Material</button>
        </div>
      </div>`,
    },
  };

  const role = user.role; // Admin, Engineer, or Contractor
  roleContentEl.innerHTML =
    templates[role][currentSection] || templates.Contractor.overview;

  // Initialize charts after setting HTML
  if (currentSection === "overview") {
    initCharts();
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

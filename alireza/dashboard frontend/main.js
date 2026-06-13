// ==================== CONFIG ====================
const API_BASE = 'http://localhost:3000/api';

// ==================== STATE ====================
let currentTab = 'dashboard';
let editingId = null;
let currentTable = '';
let demoMode = true;

// ==================== DEMO DATA ====================
const demoData = {
    staffs: [
        { st_id: 1, st_name: 'John', st_lastname: 'Doe', phone: '5550101', salary: 25, department: 1, job: 1, status: 'active', email: 'john@company.com' },
        { st_id: 2, st_name: 'Jane', st_lastname: 'Smith', phone: '5550102', salary: 30, department: 2, job: 2, status: 'active', email: 'jane@company.com' },
        { st_id: 3, st_name: 'Mike', st_lastname: 'Johnson', phone: '5550103', salary: 22, department: 1, job: 1, status: 'on_leave', email: 'mike@company.com' },
        { st_id: 4, st_name: 'Sarah', st_lastname: 'Williams', phone: '5550104', salary: 35, department: 3, job: 3, status: 'active', email: 'sarah@company.com' },
    ],
    departments: [
        { dp_id: 1, dp_name: 'Engineering', head_id: 1 },
        { dp_id: 2, dp_name: 'Marketing', head_id: 2 },
        { dp_id: 3, dp_name: 'Design', head_id: 4 },
    ],
    jobs: [
        { jb_id: 1, job: 'Developer' },
        { jb_id: 2, job: 'Marketing Manager' },
        { jb_id: 3, job: 'Lead Designer' },
        { jb_id: 4, job: 'Project Manager' },
    ],
    projects: [
        { pr_id: 1, pr_name: 'Website Redesign', project_notes: 'Complete overhaul of company website', status: 'in_progress', completion: 65, dept_id: 1, start_date: '2026-01-15', end_date: '2026-06-30' },
        { pr_id: 2, pr_name: 'Mobile App v2', project_notes: 'iOS and Android native apps', status: 'in_progress', completion: 40, dept_id: 1, start_date: '2026-02-01', end_date: '2026-08-15' },
        { pr_id: 3, pr_name: 'Q2 Marketing Campaign', project_notes: 'Social media and email marketing', status: 'completed', completion: 100, dept_id: 2, start_date: '2026-03-01', end_date: '2026-05-30' },
        { pr_id: 4, pr_name: 'Brand Identity', project_notes: 'New logo and brand guidelines', status: 'on_hold', completion: 20, dept_id: 3, start_date: '2026-04-01', end_date: '2026-07-15' },
    ],
    project_records: [
        { pjr_id: 1, st_id: 1, pr_id: 1, start_time: '2026-01-15', end_time: null },
        { pjr_id: 2, st_id: 2, pr_id: 3, start_time: '2026-03-01', end_time: '2026-05-30' },
        { pjr_id: 3, st_id: 3, pr_id: 1, start_time: '2026-02-01', end_time: null },
        { pjr_id: 4, st_id: 4, pr_id: 4, start_time: '2026-04-01', end_time: null },
    ],
    tasks: [
        { ts_id: 1, task: 'Design homepage mockup', done: 1, task_note: 'Figma files ready', assigned_to: 4, project_id: 1, due_date: '2026-02-15' },
        { ts_id: 2, task: 'Setup CI/CD pipeline', done: 0, task_note: 'GitHub Actions config needed', assigned_to: 1, project_id: 1, due_date: '2026-03-01' },
        { ts_id: 3, task: 'Write API documentation', done: 0, task_note: 'Swagger setup', assigned_to: 3, project_id: 2, due_date: '2026-04-10' },
        { ts_id: 4, task: 'Email template design', done: 1, task_note: 'Approved by client', assigned_to: 2, project_id: 3, due_date: '2026-04-01' },
    ],
    reports: [
        { rp_id: 1, st_id: 1, title: 'Weekly Progress - Website', content: 'Completed 3 major features this week. Homepage responsive design is 90% done.', date: '2026-06-09', read: false, type: 'progress' },
        { rp_id: 2, st_id: 2, title: 'Marketing Analytics Q2', content: 'Campaign reached 50K impressions. CTR improved by 12% compared to Q1.', date: '2026-06-08', read: false, type: 'analytics' },
        { rp_id: 3, st_id: 3, title: 'Bug Report - Login Issue', content: 'Found critical bug in authentication flow. Needs immediate attention.', date: '2026-06-07', read: true, type: 'issue' },
        { rp_id: 4, st_id: 4, title: 'Brand Guidelines Draft', content: 'First draft of brand guidelines completed. Awaiting review.', date: '2026-06-06', read: true, type: 'deliverable' },
    ],
    activities: [
        { time: '10:30 AM', user: 'John Doe', action: 'Updated task', details: 'Homepage mockup marked complete', status: 'success' },
        { time: '09:15 AM', user: 'Jane Smith', action: 'Submitted report', details: 'Marketing Analytics Q2', status: 'info' },
        { time: 'Yesterday', user: 'Mike Johnson', action: 'Created task', details: 'API documentation task added', status: 'success' },
        { time: 'Yesterday', user: 'Sarah Williams', action: 'Updated project', details: 'Brand Identity 20% complete', status: 'warning' },
    ]
};

// ==================== API HELPERS ====================
async function apiGet(endpoint) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        demoMode = false;
        return await res.json();
    } catch (e) {
        // Only set demoMode if it's a network error, not a server error
        if (e.message.includes('fetch') || e.message.includes('NetworkError')) {
            demoMode = true;
        }
        return demoData[endpoint] || [];
    }
}

async function apiPost(endpoint, data) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('API Error');
        demoMode = false;
        return await res.json();
    } catch (e) {
        showToast('Saved locally (API not connected)', 'info');
        return { success: true };
    }
}

async function apiPut(endpoint, data) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('API Error');
        demoMode = false;
        return await res.json();
    } catch (e) {
        showToast('Updated locally (API not connected)', 'info');
        return { success: true };
    }
}

async function apiDelete(endpoint, id) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('API Error');
        demoMode = false;
        return await res.json();
    } catch (e) {
        showToast('Deleted locally (API not connected)', 'info');
        return { success: true };
    }
}

// ==================== ACTIVITY LOG ====================
function addActivity(action, details, status = 'success') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    demoData.activities.unshift({
        time: timeStr,
        user: 'Admin User',
        action: action,
        details: details,
        status: status
    });
    // Keep only last 20 activities
    if (demoData.activities.length > 20) demoData.activities.pop();

    if (currentTab === 'dashboard') {
        renderActivityLog();
    }
}

// ==================== NAVIGATION ====================
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const target = document.getElementById(tab);
    if (target) target.classList.add('active');

    // Find nav item by onclick attribute
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => {
        if (n.getAttribute('onclick')?.includes(`'${tab}'`)) n.classList.add('active');
    });

    currentTab = tab;

    if (tab === 'dashboard') loadDashboard();
    else if (tab === 'staff') loadStaff();
    else if (tab === 'departments') loadDepartments();
    else if (tab === 'jobs') loadJobs();
    else if (tab === 'projects') loadProjects();
    else if (tab === 'tasks') loadTasks();
    else if (tab === 'reports') loadReports();
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    const staffs = await apiGet('staffs');
    const depts = await apiGet('departments');
    const projects = await apiGet('projects');
    const tasks = await apiGet('tasks');
    const reports = await apiGet('reports');

    document.getElementById('dash-staff').textContent = staffs.length;
    document.getElementById('dash-depts').textContent = depts.length;
    document.getElementById('dash-projects').textContent = projects.filter(p => p.status === 'in_progress').length;
    document.getElementById('dash-tasks').textContent = tasks.filter(t => !t.done).length;
    document.getElementById('dash-reports').textContent = reports.filter(r => !r.read).length;

    // Update badge
    const unreadCount = reports.filter(r => !r.read).length;
    const badge = document.getElementById('report-badge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }

    // Project completion
    renderProjectCompletion(projects);
    renderDeptPerformance(depts, staffs, projects);
    renderActivityLog();
}

function renderProjectCompletion(projects) {
    const container = document.getElementById('project-completion-list');
    if (!projects.length) {
        container.innerHTML = '<div class="empty-state">No projects yet</div>';
        return;
    }

    let html = '';
    projects.forEach(p => {
        const statusColor = p.completion === 100 ? 'success' : p.completion > 50 ? 'primary' : p.completion > 20 ? 'warning' : 'danger';
        html += `
            <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span style="font-weight:600;">${p.pr_name}</span>
                    <span style="font-weight:700;color:var(--${statusColor});">${p.completion}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill ${statusColor}" style="width:${p.completion}%"></div></div>
                <div class="progress-label"><span>${p.status.replace('_', ' ')}</span><span>${p.completion === 100 ? 'Completed' : 'In Progress'}</span></div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderDeptPerformance(depts, staffs, projects) {
    const container = document.getElementById('dept-performance');
    let html = '';
    depts.forEach(d => {
        const deptStaff = staffs.filter(s => s.department === d.dp_id).length;
        const deptProjects = projects.filter(p => p.dept_id === d.dp_id);
        const avgCompletion = deptProjects.length ? Math.round(deptProjects.reduce((a, p) => a + p.completion, 0) / deptProjects.length) : 0;

        html += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">
                <div>
                    <div style="font-weight:600;">${d.dp_name}</div>
                    <div style="font-size:0.85rem;color:var(--secondary);">${deptStaff} staff &bull; ${deptProjects.length} projects</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:700;color:var(--primary);">${avgCompletion}%</div>
                    <div style="font-size:0.8rem;color:var(--secondary);">avg completion</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html || '<div class="empty-state">No departments</div>';
}

function renderActivityLog() {
    const tbody = document.getElementById('activity-log');
    const activities = demoData.activities;

    if (!activities.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No recent activity</td></tr>';
        return;
    }

    let html = '';
    activities.forEach(a => {
        const badgeClass = a.status === 'success' ? 'badge-green' : a.status === 'warning' ? 'badge-yellow' : 'badge-blue';
        const badgeText = a.status === 'success' ? 'Success' : a.status === 'warning' ? 'Warning' : 'Info';
        html += `
            <tr>
                <td>${a.time}</td>
                <td style="font-weight:500;">${a.user}</td>
                <td>${a.action}</td>
                <td>${a.details}</td>
                <td><span class="badge ${badgeClass}">${badgeText}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// ==================== STAFF ====================
async function loadStaff() {
    const data = await apiGet('staffs');
    const depts = await apiGet('departments');
    const jobs = await apiGet('jobs');
    const tbody = document.querySelector('#staff-table tbody');

    // Populate filter
    const filter = document.getElementById('staff-dept-filter');
    filter.innerHTML = '<option value="">All Departments</option>' + depts.map(d => `<option value="${d.dp_id}">${d.dp_name}</option>`).join('');

    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No staff members</td></tr>';
        return;
    }

    let html = '';
    data.forEach(row => {
        const dept = depts.find(d => d.dp_id == row.department);
        const job = jobs.find(j => j.jb_id == row.job);
        const statusBadge = row.status === 'active' ? 'badge-green' : row.status === 'on_leave' ? 'badge-yellow' : 'badge-gray';
        const statusText = row.status === 'active' ? 'Active' : row.status === 'on_leave' ? 'On Leave' : 'Inactive';

        html += `<tr data-dept-id="${row.department}">
            <td>${row.st_id}</td>
            <td style="font-weight:500;">${row.st_name} ${row.st_lastname}</td>
            <td><span class="badge badge-blue">${dept ? dept.dp_name : 'N/A'}</span></td>
            <td><span class="badge badge-yellow">${job ? job.job : 'N/A'}</span></td>
            <td>${row.phone || '-'}</td>
            <td>$${row.salary}/hr</td>
            <td><span class="badge ${statusBadge}">${statusText}</span></td>
            <td class="actions">
                <button class="action-btn view" onclick="viewStaff(${row.st_id})">View</button>
                <button class="action-btn edit" onclick="editItem('staff', ${row.st_id})">Edit</button>
                <button class="action-btn delete" onclick="deleteItem('staffs', ${row.st_id}, '${row.st_name} ${row.st_lastname}')">Delete</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function filterStaff() {
    const deptId = document.getElementById('staff-dept-filter').value;
    const rows = document.querySelectorAll('#staff-table tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        if (!deptId) {
            row.style.display = '';
            visibleCount++;
            return;
        }
        const rowDeptId = row.getAttribute('data-dept-id');
        const match = rowDeptId === deptId;
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });

    // Show empty state if no rows visible
    const tbody = document.querySelector('#staff-table tbody');
    if (visibleCount === 0 && deptId) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No staff in this department</td></tr>';
    }
}

function viewStaff(id) {
    const staff = demoData.staffs.find(s => s.st_id === id);
    if (!staff) return;

    const dept = demoData.departments.find(d => d.dp_id == staff.department);
    const job = demoData.jobs.find(j => j.jb_id == staff.job);

    const content = `
        <div style="text-align:center;margin-bottom:20px;">
            <div style="width:80px;height:80px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin:0 auto 12px;">
                ${staff.st_name[0]}${staff.st_lastname[0]}
            </div>
            <h2 style="margin-bottom:4px;">${staff.st_name} ${staff.st_lastname}</h2>
            <span class="badge ${staff.status === 'active' ? 'badge-green' : staff.status === 'on_leave' ? 'badge-yellow' : 'badge-gray'}">${staff.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group"><label>Email</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${staff.email || 'N/A'}</div></div>
            <div class="form-group"><label>Phone</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${staff.phone || 'N/A'}</div></div>
            <div class="form-group"><label>Department</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${dept ? dept.dp_name : 'N/A'}</div></div>
            <div class="form-group"><label>Job Position</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${job ? job.job : 'N/A'}</div></div>
            <div class="form-group"><label>Salary</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">$${staff.salary}/hr</div></div>
            <div class="form-group"><label>Employee ID</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">#${staff.st_id}</div></div>
        </div>
    `;

    document.getElementById('modal-title').textContent = 'Staff Profile';
    document.getElementById('modal-body').innerHTML = content;
    document.querySelector('.modal-footer').innerHTML = '<button class="btn btn-secondary" onclick="closeModal()">Close</button>';
    document.getElementById('modal-overlay').classList.add('active');
}

// ==================== DEPARTMENTS ====================
async function loadDepartments() {
    const data = await apiGet('departments');
    const staffs = await apiGet('staffs');
    const tbody = document.querySelector('#dept-table tbody');

    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No departments</td></tr>';
        return;
    }

    let html = '';
    data.forEach(row => {
        const head = staffs.find(s => s.st_id == row.head_id);
        const count = staffs.filter(s => s.department == row.dp_id).length;
        html += `<tr data-dept-id="${row.dp_id}">
            <td>${row.dp_id}</td>
            <td style="font-weight:600;">${row.dp_name}</td>
            <td>${head ? head.st_name + ' ' + head.st_lastname : '<span style="color:var(--secondary)">Not assigned</span>'}</td>
            <td>${count} members</td>
            <td class="actions">
                <button class="action-btn edit" onclick="editItem('department', ${row.dp_id})">Edit</button>
                <button class="action-btn delete" onclick="deleteItem('departments', ${row.dp_id}, '${row.dp_name}')">Delete</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// ==================== JOBS ====================
async function loadJobs() {
    const data = await apiGet('jobs');
    const staffs = await apiGet('staffs');
    const tbody = document.querySelector('#jobs-table tbody');

    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No job positions</td></tr>';
        return;
    }

    let html = '';
    data.forEach(row => {
        const count = staffs.filter(s => s.job == row.jb_id).length;
        html += `<tr>
            <td>${row.jb_id}</td>
            <td style="font-weight:500;">${row.job}</td>
            <td>${count} staff</td>
            <td class="actions">
                <button class="action-btn edit" onclick="editItem('job', ${row.jb_id})">Edit</button>
                <button class="action-btn delete" onclick="deleteItem('jobs', ${row.jb_id}, '${row.job}')">Delete</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// ==================== PROJECTS ====================
async function loadProjects() {
    const projects = await apiGet('projects');
    const staffs = await apiGet('staffs');
    const depts = await apiGet('departments');
    const records = await apiGet('project_records');

    // Stats
    document.getElementById('proj-completed').textContent = projects.filter(p => p.status === 'completed').length;
    document.getElementById('proj-progress').textContent = projects.filter(p => p.status === 'in_progress').length;
    document.getElementById('proj-hold').textContent = projects.filter(p => p.status === 'on_hold').length;

    const grid = document.getElementById('projects-grid');
    if (!projects.length) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">No projects yet</div>';
        return;
    }

    let html = '';
    projects.forEach(p => {
        const dept = depts.find(d => d.dp_id == p.dept_id);
        const projectStaff = records.filter(r => r.pr_id == p.pr_id).map(r => staffs.find(s => s.st_id == r.st_id)).filter(Boolean);
        const statusColors = { completed: 'success', in_progress: 'primary', on_hold: 'warning', cancelled: 'danger' };
        const statusLabels = { completed: 'Completed', in_progress: 'In Progress', on_hold: 'On Hold', cancelled: 'Cancelled' };
        const statusColor = statusColors[p.status] || 'secondary';
        const statusLabel = statusLabels[p.status] || p.status;

        html += `
            <div class="project-card">
                <div class="project-card-header">
                    <div>
                        <h4>${p.pr_name}</h4>
                        <div class="dept-tag">${dept ? dept.dp_name : 'No Department'} &bull; ${p.start_date} to ${p.end_date || 'Ongoing'}</div>
                    </div>
                    <span class="badge badge-${statusColor === 'primary' ? 'blue' : statusColor === 'success' ? 'green' : statusColor === 'warning' ? 'yellow' : 'red'}">${statusLabel}</span>
                </div>
                <p style="color:var(--secondary);font-size:0.9rem;line-height:1.5;margin-bottom:12px;">${p.project_notes || 'No description'}</p>

                <div style="margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;">
                        <span>Completion</span>
                        <span style="font-weight:600;">${p.completion}%</span>
                    </div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill ${statusColor}" style="width:${p.completion}%"></div></div>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div class="project-team">
                        ${projectStaff.slice(0, 3).map(s => `<div class="team-avatar">${s.st_name[0]}</div>`).join('')}
                        ${projectStaff.length > 3 ? `<div class="team-more">+${projectStaff.length - 3}</div>` : ''}
                        ${projectStaff.length === 0 ? '<span style="font-size:0.8rem;color:var(--secondary);">No staff assigned</span>' : ''}
                    </div>
                    <div class="actions">
                        <button class="action-btn edit" onclick="editItem('project', ${p.pr_id})">Edit</button>
                        <button class="action-btn view" onclick="viewProject(${p.pr_id})">Details</button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

function viewProject(id) {
    const project = demoData.projects.find(p => p.pr_id === id);
    if (!project) return;

    const dept = demoData.departments.find(d => d.dp_id == project.dept_id);
    const records = demoData.project_records.filter(r => r.pr_id == id);
    const staffList = records.map(r => demoData.staffs.find(s => s.st_id == r.st_id)).filter(Boolean);
    const tasks = demoData.tasks.filter(t => t.project_id == id);

    const statusColors = { completed: 'success', in_progress: 'primary', on_hold: 'warning', cancelled: 'danger' };
    const statusColor = statusColors[project.status] || 'secondary';

    const content = `
        <div style="margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h2 style="font-size:1.3rem;">${project.pr_name}</h2>
                <span class="badge badge-${statusColor === 'primary' ? 'blue' : statusColor === 'success' ? 'green' : statusColor === 'warning' ? 'yellow' : 'red'}">${project.status.replace('_', ' ').toUpperCase()}</span>
            </div>
            <p style="color:var(--secondary);line-height:1.6;">${project.project_notes || 'No description'}</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div class="form-group"><label>Department</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${dept ? dept.dp_name : 'N/A'}</div></div>
            <div class="form-group"><label>Completion</label><div style="padding:10px;background:#f8fafc;border-radius:8px;font-weight:700;color:var(--${statusColor});">${project.completion}%</div></div>
            <div class="form-group"><label>Start Date</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${project.start_date || 'N/A'}</div></div>
            <div class="form-group"><label>End Date</label><div style="padding:10px;background:#f8fafc;border-radius:8px;">${project.end_date || 'Ongoing'}</div></div>
        </div>

        <div style="margin-bottom:20px;">
            <h4 style="margin-bottom:10px;font-size:1rem;">👥 Assigned Staff (${staffList.length})</h4>
            ${staffList.length ? staffList.map(s => `
                <div style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;margin-bottom:6px;">
                    <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.8rem;">${s.st_name[0]}</div>
                    <span style="font-weight:500;">${s.st_name} ${s.st_lastname}</span>
                </div>
            `).join('') : '<div style="color:var(--secondary);padding:8px;">No staff assigned</div>'}
        </div>

        <div>
            <h4 style="margin-bottom:10px;font-size:1rem;">📋 Project Tasks (${tasks.length})</h4>
            ${tasks.length ? tasks.map(t => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f8fafc;border-radius:8px;margin-bottom:6px;">
                    <span>${t.task}</span>
                    <span class="badge ${t.done ? 'badge-green' : new Date(t.due_date) < new Date() ? 'badge-red' : 'badge-yellow'}">${t.done ? 'Done' : new Date(t.due_date) < new Date() ? 'Overdue' : 'Pending'}</span>
                </div>
            `).join('') : '<div style="color:var(--secondary);padding:8px;">No tasks</div>'}
        </div>
    `;

    document.getElementById('modal-title').textContent = 'Project Details';
    document.getElementById('modal-body').innerHTML = content;
    document.querySelector('.modal-footer').innerHTML = '<button class="btn btn-secondary" onclick="closeModal()">Close</button>';
    document.getElementById('modal-overlay').classList.add('active');
}

// ==================== TASKS ====================
async function loadTasks() {
    const data = await apiGet('tasks');
    const staffs = await apiGet('staffs');
    const projects = await apiGet('projects');
    const tbody = document.querySelector('#tasks-table tbody');

    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tasks</td></tr>';
        return;
    }

    let html = '';
    data.forEach(row => {
        const staff = staffs.find(s => s.st_id == row.assigned_to);
        const project = projects.find(p => p.pr_id == row.project_id);
        const isOverdue = !row.done && row.due_date && new Date(row.due_date) < new Date();
        const statusBadge = row.done ? 'badge-green' : isOverdue ? 'badge-red' : 'badge-yellow';
        const statusText = row.done ? 'Done' : isOverdue ? 'Overdue' : 'Pending';

        html += `<tr data-status="${row.done ? 'done' : 'pending'}">
            <td>${row.ts_id}</td>
            <td style="font-weight:500;">${row.task}</td>
            <td>${staff ? staff.st_name + ' ' + staff.st_lastname : 'Unassigned'}</td>
            <td>${project ? project.pr_name : 'N/A'}</td>
            <td><span class="badge ${statusBadge}">${statusText}</span></td>
            <td>${row.due_date || '-'}${isOverdue ? ' <span style="color:var(--danger);font-size:0.75rem;">(overdue)</span>' : ''}</td>
            <td class="actions">
                <button class="action-btn edit" onclick="editItem('task', ${row.ts_id})">Edit</button>
                <button class="action-btn ${row.done ? 'view' : 'edit'}" onclick="toggleTaskStatus(${row.ts_id})">${row.done ? 'Reopen' : 'Complete'}</button>
                <button class="action-btn delete" onclick="deleteItem('tasks', ${row.ts_id})">Delete</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function filterTasks(status) {
    const rows = document.querySelectorAll('#tasks-table tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
            visibleCount++;
            return;
        }
        const rowStatus = row.getAttribute('data-status');
        const match = rowStatus === status;
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });

    const tbody = document.querySelector('#tasks-table tbody');
    if (visibleCount === 0 && status !== 'all') {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No ${status} tasks</td></tr>`;
    }
}

function toggleTaskStatus(id) {
    const task = demoData.tasks.find(t => t.ts_id === id);
    if (!task) return;

    task.done = task.done ? 0 : 1;
    addActivity(task.done ? 'Completed task' : 'Reopened task', task.task, 'success');
    showToast(`Task marked as ${task.done ? 'completed' : 'pending'}`, 'success');
    loadTasks();
    loadDashboard();
}

// ==================== REPORTS ====================
async function loadReports() {
    const reports = await apiGet('reports');
    const staffs = await apiGet('staffs');

    const unread = reports.filter(r => !r.read);
    document.getElementById('unread-count').textContent = `${unread.length} unread`;

    // Incoming
    const incoming = document.getElementById('reports-incoming');
    if (!reports.length) {
        incoming.innerHTML = '<div class="empty-state">No reports received</div>';
    } else {
        incoming.innerHTML = reports.map(r => {
            const staff = staffs.find(s => s.st_id == r.st_id);
            const typeColors = { progress: 'blue', analytics: 'green', issue: 'red', deliverable: 'purple' };
            return `
                <div class="report-item ${r.read ? '' : 'unread'}">
                    <div class="report-header">
                        <div>
                            <div style="font-weight:600;font-size:1rem;">${r.title}</div>
                            <div class="report-meta">From ${staff ? staff.st_name + ' ' + staff.st_lastname : 'Unknown'} &bull; ${r.date}</div>
                        </div>
                        <span class="badge badge-${typeColors[r.type] || 'gray'}">${r.type}</span>
                    </div>
                    <div class="report-content">${r.content}</div>
                    <div class="report-actions">
                        ${!r.read ? `<button class="btn btn-sm btn-primary" onclick="markRead(${r.rp_id})">Mark as Read</button>` : ''}
                        <button class="btn btn-sm btn-outline" onclick="replyReport(${r.rp_id})">Reply</button>
                        <button class="btn btn-sm btn-outline" onclick="deleteItem('reports', ${r.rp_id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Sent (demo)
    document.getElementById('reports-sent').innerHTML = `
        <div class="report-item">
            <div class="report-header">
                <div>
                    <div style="font-weight:600;">Q2 Budget Approval</div>
                    <div class="report-meta">To: Finance Team &bull; 2026-06-05</div>
                </div>
                <span class="badge badge-green">Approved</span>
            </div>
            <div class="report-content">Budget for Q3 has been approved. Please proceed with resource allocation.</div>
        </div>
        <div class="report-item">
            <div class="report-header">
                <div>
                    <div style="font-weight:600;">Project Deadline Extension</div>
                    <div class="report-meta">To: Engineering &bull; 2026-06-03</div>
                </div>
                <span class="badge badge-blue">Pending</span>
            </div>
            <div class="report-content">Request for 2-week extension on Mobile App v2 project.</div>
        </div>
    `;
}

function markRead(id) {
    const report = demoData.reports.find(r => r.rp_id === id);
    if (report) {
        report.read = true;
        addActivity('Marked report as read', report.title, 'info');
    }
    showToast('Report marked as read', 'success');
    loadReports();
    loadDashboard();
}

function markAllRead() {
    demoData.reports.forEach(r => r.read = true);
    addActivity('Marked all reports as read', 'All incoming reports', 'info');
    showToast('All reports marked as read', 'success');
    loadReports();
    loadDashboard();
}

function replyReport(id) {
    const report = demoData.reports.find(r => r.rp_id === id);
    if (!report) return;

    const content = `
        <div class="form-group">
            <label>Replying to: <strong>${report.title}</strong></label>
            <div style="padding:12px;background:#f8fafc;border-radius:8px;margin-bottom:16px;color:var(--secondary);font-size:0.9rem;">${report.content}</div>
        </div>
        <div class="form-group">
            <label>Your Reply *</label>
            <textarea id="reply-content" rows="5" placeholder="Type your response..."></textarea>
        </div>
    `;

    document.getElementById('modal-title').textContent = 'Reply to Report';
    document.getElementById('modal-body').innerHTML = content;
    document.querySelector('.modal-footer').innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="sendReply(${id})">Send Reply</button>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function sendReply(id) {
    const content = document.getElementById('reply-content').value.trim();
    if (!content) {
        showToast('Please enter a reply', 'error');
        return;
    }

    const report = demoData.reports.find(r => r.rp_id === id);
    addActivity('Replied to report', report.title, 'success');
    showToast('Reply sent successfully', 'success');
    closeModal();
}

// ==================== MODALS & FORMS ====================
const formConfigs = {
    staff: {
        title: 'Staff Member',
        table: 'staffs',
        fields: [
            { name: 'st_name', label: 'First Name', type: 'text', required: true, row: 1 },
            { name: 'st_lastname', label: 'Last Name', type: 'text', required: true, row: 1 },
            { name: 'email', label: 'Email', type: 'email', row: 2 },
            { name: 'phone', label: 'Phone', type: 'tel', row: 2 },
            { name: 'salary', label: 'Hourly Salary ($)', type: 'number', required: true, min: 0, row: 3 },
            { name: 'status', label: 'Status', type: 'select', required: true, options: [{value:'active',text:'Active'}, {value:'on_leave',text:'On Leave'}, {value:'inactive',text:'Inactive'}], row: 3 },
            { name: 'department', label: 'Department', type: 'select', required: true, source: 'departments', valueField: 'dp_id', textField: 'dp_name', row: 4 },
            { name: 'job', label: 'Job Position', type: 'select', required: true, source: 'jobs', valueField: 'jb_id', textField: 'job', row: 4 }
        ]
    },
    department: {
        title: 'Department',
        table: 'departments',
        fields: [
            { name: 'dp_name', label: 'Department Name', type: 'text', required: true },
            { name: 'head_id', label: 'Department Head', type: 'select', source: 'staffs', valueField: 'st_id', textField: 'st_name', showLastname: true }
        ]
    },
    job: {
        title: 'Job Position',
        table: 'jobs',
        fields: [
            { name: 'job', label: 'Job Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]
    },
    project: {
        title: 'Project',
        table: 'projects',
        fields: [
            { name: 'pr_name', label: 'Project Name', type: 'text', required: true, row: 1 },
            { name: 'dept_id', label: 'Department', type: 'select', required: true, source: 'departments', valueField: 'dp_id', textField: 'dp_name', row: 1 },
            { name: 'status', label: 'Status', type: 'select', required: true, options: [{value:'in_progress',text:'In Progress'}, {value:'completed',text:'Completed'}, {value:'on_hold',text:'On Hold'}, {value:'cancelled',text:'Cancelled'}], row: 2 },
            { name: 'completion', label: 'Completion %', type: 'number', min: 0, max: 100, row: 2 },
            { name: 'start_date', label: 'Start Date', type: 'date', row: 3 },
            { name: 'end_date', label: 'End Date', type: 'date', row: 3 },
            { name: 'project_notes', label: 'Description', type: 'textarea', row: 4 }
        ]
    },
    project_assignment: {
        title: 'Project Assignment',
        table: 'project_records',
        fields: [
            { name: 'st_id', label: 'Staff Member', type: 'select', required: true, source: 'staffs', valueField: 'st_id', textField: 'st_name', showLastname: true },
            { name: 'pr_id', label: 'Project', type: 'select', required: true, source: 'projects', valueField: 'pr_id', textField: 'pr_name' },
            { name: 'start_time', label: 'Start Date', type: 'date', required: true, row: 2 },
            { name: 'end_time', label: 'End Date', type: 'date', row: 2 }
        ]
    },
    task: {
        title: 'Task',
        table: 'tasks',
        fields: [
            { name: 'task', label: 'Task Description', type: 'text', required: true },
            { name: 'project_id', label: 'Project', type: 'select', required: true, source: 'projects', valueField: 'pr_id', textField: 'pr_name', row: 2 },
            { name: 'assigned_to', label: 'Assign To', type: 'select', required: true, source: 'staffs', valueField: 'st_id', textField: 'st_name', showLastname: true, row: 2 },
            { name: 'done', label: 'Status', type: 'select', required: true, options: [{value:0,text:'Pending'}, {value:1,text:'Done'}], row: 3 },
            { name: 'due_date', label: 'Due Date', type: 'date', row: 3 },
            { name: 'task_note', label: 'Notes', type: 'textarea', row: 4 }
        ]
    },
    report: {
        title: 'Report',
        table: 'reports',
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'type', label: 'Report Type', type: 'select', required: true, options: [
                { value: 'progress', text: 'Progress' },
                { value: 'analytics', text: 'Analytics' },
                { value: 'issue', text: 'Issue' },
                { value: 'deliverable', text: 'Deliverable' }
            ], row: 2 },
            { name: 'st_id', label: 'From Staff', type: 'select', required: true, source: 'staffs', valueField: 'st_id', textField: 'st_name', showLastname: true, row: 2 },
            { name: 'content', label: 'Content', type: 'textarea', required: true, row: 3 },
            { name: 'date', label: 'Date', type: 'date', required: true, row: 4 }
        ]
    }
};

// ==================== MODAL FUNCTIONS ====================
let currentFormConfig = null;

async function openModal(type, id = null) {
    editingId = id;
    currentFormConfig = formConfigs[type];
    if (!currentFormConfig) return;

    document.getElementById('modal-title').textContent = (id ? 'Edit' : 'Add') + ' ' + currentFormConfig.title;
    const body = document.getElementById('modal-body');
    body.innerHTML = '';

    // Restore default footer
    document.querySelector('.modal-footer').innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveForm()">Save</button>
    `;

    // Group fields by row
    const rowGroups = {};
    const noRowFields = [];

    for (const field of currentFormConfig.fields) {
        if (field.row) {
            if (!rowGroups[field.row]) rowGroups[field.row] = [];
            rowGroups[field.row].push(field);
        } else {
            noRowFields.push(field);
        }
    }

    // Build form fields
    const buildField = async (field) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label + (field.required ? ' *' : '');
        wrapper.appendChild(label);

        let input;

        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;
            input.required = field.required || false;

            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Select...';
            input.appendChild(defaultOpt);

            if (field.options) {
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.text;
                    input.appendChild(option);
                });
            } else if (field.source) {
                const data = await apiGet(field.source);
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[field.valueField];
                    const lastName = field.showLastname && item.st_lastname ? ' ' + item.st_lastname : '';
                    option.textContent = item[field.textField] + lastName;
                    input.appendChild(option);
                });
            }
        } else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.name = field.name;
            input.required = field.required || false;
            input.rows = 4;
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.required = field.required || false;
            if (field.min !== undefined) input.min = field.min;
            if (field.max !== undefined) input.max = field.max;
        }

        input.id = 'field-' + field.name;
        input.className = 'form-control';
        wrapper.appendChild(input);
        return wrapper;
    };

    // Render row groups
    const sortedRows = Object.keys(rowGroups).sort((a, b) => a - b);
    for (const rowNum of sortedRows) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'form-row';
        for (const field of rowGroups[rowNum]) {
            const fieldEl = await buildField(field);
            fieldEl.style.marginBottom = '0';
            rowDiv.appendChild(fieldEl);
        }
        body.appendChild(rowDiv);
    }

    // Render non-row fields
    for (const field of noRowFields) {
        body.appendChild(await buildField(field));
    }

    // If editing, populate values
    if (id) {
        const data = await apiGet(currentFormConfig.table);
        const item = data.find(d => {
            const idField = Object.keys(d).find(k => k.endsWith('_id'));
            return d[idField] == id;
        });

        if (item) {
            currentFormConfig.fields.forEach(field => {
                const el = document.getElementById('field-' + field.name);
                if (el) {
                    const val = item[field.name];
                    el.value = val !== undefined ? val : '';
                }
            });
        }
    } else {
        // Set default date for reports
        if (type === 'report') {
            const dateField = document.getElementById('field-date');
            if (dateField) dateField.value = new Date().toISOString().split('T')[0];
        }
    }

    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    editingId = null;
    currentFormConfig = null;
}

async function saveForm() {
    if (!currentFormConfig) return;

    const data = {};
    let valid = true;

    currentFormConfig.fields.forEach(field => {
        const el = document.getElementById('field-' + field.name);
        if (!el) return;

        let value = el.value;
        if (field.type === 'number') value = parseFloat(value) || 0;
        if (field.type === 'select' && field.name === 'done') value = parseInt(value);

        if (field.required && !value && value !== 0) {
            el.style.borderColor = 'var(--danger)';
            valid = false;
            setTimeout(() => el.style.borderColor = '', 2000);
        }

        data[field.name] = value;
    });

    if (!valid) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const idField = currentFormConfig.table === 'staffs' ? 'st_id' :
                   currentFormConfig.table === 'departments' ? 'dp_id' :
                   currentFormConfig.table === 'jobs' ? 'jb_id' :
                   currentFormConfig.table === 'projects' ? 'pr_id' :
                   currentFormConfig.table === 'tasks' ? 'ts_id' :
                   currentFormConfig.table === 'reports' ? 'rp_id' :
                   currentFormConfig.table === 'project_records' ? 'pjr_id' : 'id';

    if (editingId) {
        data[idField] = editingId;
    }

    const endpoint = editingId ? `${currentFormConfig.table}/${editingId}` : currentFormConfig.table;

    try {
        if (demoMode) {
            // Update demo data directly
            const table = currentFormConfig.table;
            if (editingId) {
                const idx = demoData[table].findIndex(item => item[idField] == editingId);
                if (idx !== -1) demoData[table][idx] = { ...demoData[table][idx], ...data };
                addActivity(`Updated ${currentFormConfig.title.toLowerCase()}`, data[currentFormConfig.fields[0].name], 'success');
            } else {
                const newId = Math.max(...demoData[table].map(item => item[idField] || 0), 0) + 1;
                data[idField] = newId;
                demoData[table].push(data);
                addActivity(`Created ${currentFormConfig.title.toLowerCase()}`, data[currentFormConfig.fields[0].name], 'success');
            }
            showToast(`${currentFormConfig.title} ${editingId ? 'updated' : 'created'} successfully`, 'success');
        } else {
            if (editingId) {
                await apiPut(endpoint, data);
            } else {
                await apiPost(endpoint, data);
            }
            addActivity(`${editingId ? 'Updated' : 'Created'} ${currentFormConfig.title.toLowerCase()}`, data[currentFormConfig.fields[0].name], 'success');
            showToast(`${currentFormConfig.title} ${editingId ? 'updated' : 'created'} successfully`, 'success');
        }
    } catch (e) {
        showToast('Error saving: ' + e.message, 'error');
        return;
    }

    closeModal();
    refreshCurrentTab();
}

async function editItem(type, id) {
    await openModal(type, id);
}

async function deleteItem(table, id, itemName = '') {
    // Check for related records
    let warning = '';
    const name = itemName || `Item #${id}`;

    if (table === 'departments') {
        const staffCount = demoData.staffs.filter(s => s.department == id).length;
        if (staffCount > 0) warning = `\n\n⚠️ Warning: ${staffCount} staff member(s) belong to this department. They will become unassigned.`;
    } else if (table === 'jobs') {
        const staffCount = demoData.staffs.filter(s => s.job == id).length;
        if (staffCount > 0) warning = `\n\n⚠️ Warning: ${staffCount} staff member(s) have this job position. They will become unassigned.`;
    } else if (table === 'staffs') {
        const deptHead = demoData.departments.find(d => d.head_id == id);
        if (deptHead) warning = `\n\n⚠️ Warning: This staff is head of ${deptHead.dp_name}. Department head will be removed.`;
    } else if (table === 'projects') {
        const taskCount = demoData.tasks.filter(t => t.project_id == id).length;
        const recordCount = demoData.project_records.filter(r => r.pr_id == id).length;
        if (taskCount > 0 || recordCount > 0) warning = `\n\n⚠️ Warning: ${taskCount} task(s) and ${recordCount} assignment(s) linked to this project will be affected.`;
    }

    if (!confirm(`Are you sure you want to delete "${name}"?${warning}`)) return;

    try {
        if (demoMode) {
            const idx = demoData[table].findIndex(item => {
                const idField = Object.keys(item).find(k => k.endsWith('_id'));
                return item[idField] == id;
            });
            if (idx !== -1) {
                const deleted = demoData[table][idx];
                demoData[table].splice(idx, 1);
                addActivity(`Deleted ${table.replace('s', '')}`, name, 'warning');
            }
            showToast('Item deleted successfully', 'success');
        } else {
            await apiDelete(table, id);
            addActivity(`Deleted ${table.replace('s', '')}`, name, 'warning');
            showToast('Item deleted successfully', 'success');
        }
    } catch (e) {
        showToast('Error deleting item', 'error');
    }

    refreshCurrentTab();
}

function refreshCurrentTab() {
    if (currentTab === 'dashboard') loadDashboard();
    else if (currentTab === 'staff') loadStaff();
    else if (currentTab === 'departments') loadDepartments();
    else if (currentTab === 'jobs') loadJobs();
    else if (currentTab === 'projects') loadProjects();
    else if (currentTab === 'tasks') loadTasks();
    else if (currentTab === 'reports') loadReports();
}

function refreshAll() {
    showToast('Refreshing all data...', 'info');
    loadDashboard();
    if (currentTab !== 'dashboard') refreshCurrentTab();
}

// ==================== SEARCH & FILTER ====================
function searchTable(tableId, query) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const lowerQuery = query.toLowerCase();
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const isEmptyState = row.querySelector('.empty-state');
        if (isEmptyState) return; // Don't hide empty state rows

        const match = text.includes(lowerQuery);
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });

    // Show no results message if needed
    const tbody = table.querySelector('tbody');
    const existingNoResults = tbody.querySelector('.no-results-row');
    if (existingNoResults) existingNoResults.remove();

    if (visibleCount === 0 && query) {
        const colCount = table.querySelectorAll('thead th').length || 1;
        const noResults = document.createElement('tr');
        noResults.className = 'no-results-row';
        noResults.innerHTML = `<td colspan="${colCount}" class="empty-state">No results found for "${query}"</td>`;
        tbody.appendChild(noResults);
    }
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    toast.innerHTML = `<span style="font-size:1.2rem;">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    // Close modal on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') closeModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
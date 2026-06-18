// Initialize Lucide Icons
lucide.createIcons();

// --- State Management ---
const state = {
  isLogin: true,
  isDark: false,
};

// --- DOM Elements ---
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// --- Theme Toggle ---
themeToggle.addEventListener("click", () => {
  state.isDark = !state.isDark;
  document.body.classList.toggle("dark");
});

// --- Form Toggling ---
function switchTab(toLogin) {
  state.isLogin = toLogin;

  if (toLogin) {
    loginTab.className =
      "flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white";
    registerTab.className =
      "flex-1 py-2 text-sm font-medium rounded-lg transition-all text-gray-500 dark:text-gray-400";

    loginForm.classList.remove("hidden");
    setTimeout(() => {
      loginForm.classList.remove("opacity-0", "translate-x-4");
      loginForm.classList.add("block");
      registerForm.classList.add("hidden");
    }, 10);
  } else {
    registerTab.className =
      "flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white";
    loginTab.className =
      "flex-1 py-2 text-sm font-medium rounded-lg transition-all text-gray-500 dark:text-gray-400";

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    setTimeout(() => {
      registerForm.classList.remove("opacity-0", "translate-x-4");
      registerForm.classList.add("block");
    }, 10);
  }
}

loginTab.addEventListener("click", () => switchTab(true));
registerTab.addEventListener("click", () => switchTab(false));

// --- Password Utils ---
function togglePass(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// --- Password Strength Checker ---
const regPass = document.getElementById("regPass");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

regPass.addEventListener("input", (e) => {
  const val = e.target.value;
  let score = 0;

  if (val.length > 6) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { color: "bg-red-500", text: "Weak", width: "25%" },
    { color: "bg-orange-500", text: "Fair", width: "50%" },
    { color: "bg-yellow-500", text: "Good", width: "75%" },
    { color: "bg-[#00ff88]", text: "Strong", width: "100%" },
  ];

  const result = levels[score - 1] || levels[0];
  if (val.length === 0) {
    strengthBar.style.width = "0%";
    strengthText.innerText = "Weak";
  } else {
    strengthBar.className = `h-full transition-all duration-300 ${result.color}`;
    strengthBar.style.width = result.width;
    strengthText.innerText = result.text;
  }
});

// --- Client Side Validation ---
function validateField(id, condition) {
  const el = document.getElementById(id);
  if (condition) {
    el.classList.add("input-valid");
    el.classList.remove("input-invalid");
    return true;
  } else {
    el.classList.add("input-invalid");
    el.classList.remove("input-valid");
    return false;
  }
}

// --- Toast System ---
function showToast(msg) {
  toastMessage.innerText = msg;
  toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3000);
}

// --- Form Submissions ---
document.getElementById("loginSubmit").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const originalText = btn.innerHTML;

  // Loading state
  btn.disabled = true;
  btn.innerHTML = `<div class="loading-spinner"></div>`;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  btn.disabled = false;
  btn.innerHTML = originalText;
  showToast("Welcome back to Pen & Pixel!");
});

document
  .getElementById("registerSubmit")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const pass = document.getElementById("regPass").value;
    const confirm = document.getElementById("regConfirm").value;

    const isMatch = validateField("regConfirm", pass === confirm);
    if (!isMatch) {
      showToast("Passwords do not match!");
      return;
    }

    const btn = e.target.querySelector("button");
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<div class="loading-spinner"></div>`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    btn.disabled = false;
    btn.innerHTML = originalText;
    showToast("Account created successfully!");
  });

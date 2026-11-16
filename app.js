(function () {
  "use strict";

  const ROLE_ADMIN = "Master Admin";
  const state = {
    token: localStorage.getItem("fieldhouse.token") || "",
    user: JSON.parse(localStorage.getItem("fieldhouse.user") || "null"),
    theme: localStorage.getItem("fieldhouse.theme") === "light" ? "light" : "dark",
    navOpen: !window.matchMedia("(max-width: 720px)").matches,
    data: {},
    page: "home"
  };
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const navToggleButton = $("#navToggleButton");
  const navBackdrop = $("#navBackdrop");
  function setNavigationOpen(isOpen) {
    state.navOpen = isOpen;
    $("#dashboardView").classList.toggle("nav-open", isOpen);
    navBackdrop.hidden = !(isOpen && window.matchMedia("(max-width: 720px)").matches);
    navToggleButton.textContent = isOpen ? "×" : "☰";
    navToggleButton.setAttribute("aria-expanded", String(isOpen));
    navToggleButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    navToggleButton.title = isOpen ? "Close navigation" : "Open navigation";
  }
  setNavigationOpen(state.navOpen);
  navToggleButton.addEventListener("click", () => setNavigationOpen(!state.navOpen));
  navBackdrop.addEventListener("click", () => setNavigationOpen(false));
  let mobileNavigation = window.matchMedia("(max-width: 720px)").matches;
  window.addEventListener("resize", () => {
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    if (isMobile !== mobileNavigation) {
      mobileNavigation = isMobile;
      setNavigationOpen(!isMobile);
    }
  });
  const themeToggleButton = $("#themeToggleButton");
  function applyTheme() {
    const isLight = state.theme === "light";
    document.body.classList.toggle("light-theme", isLight);
    themeToggleButton.textContent = isLight ? "☾" : "☼";
    themeToggleButton.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeToggleButton.title = isLight ? "Switch to dark theme" : "Switch to light theme";
    themeToggleButton.setAttribute("aria-pressed", String(isLight));
  }
  applyTheme();
  themeToggleButton.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("fieldhouse.theme", state.theme);
    applyTheme();
  });
  const backgroundSlides = $$(".background-slideshow img");
  if (backgroundSlides.length > 1) {
    let activeSlide = 0;
    setInterval(() => {
      backgroundSlides[activeSlide].classList.remove("active");
      activeSlide = (activeSlide + 1) % backgroundSlides.length;
      backgroundSlides[activeSlide].classList.add("active");
    }, 5000);
  }
  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const id = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const dateLabel = value => value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
  const ordinal = value => {
    const number = Number(value), mod100 = number % 100;
    return number + (mod100 >= 11 && mod100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th"));
  };
  const colors = ["#6e9a72", "#d59e54", "#8090b4", "#b57578", "#6ea5a0", "#987ab0", "#a9a14d", "#d47a52", "#688fbd", "#8d9d65"];
  const certificateTemplates = [
    {label:"Laurel Green",family:"laurel",primary:"#245c48",accent:"#d0a84a"},
    {label:"Royal Blue",family:"modern",primary:"#2454a0",accent:"#e2bd59"},
    {label:"Gold Heritage",family:"heritage",primary:"#83621b",accent:"#d7b75a"},
    {label:"Crimson Honor",family:"classic",primary:"#922f3b",accent:"#d5ad70"},
    {label:"Teal Excellence",family:"geometric",primary:"#147b78",accent:"#d8b958"},
    {label:"Violet Achievement",family:"laurel",primary:"#65458c",accent:"#d8bd7d"},
    {label:"Forest Champion",family:"modern",primary:"#315b3c",accent:"#b9ca82"},
    {label:"Sapphire Award",family:"heritage",primary:"#285b88",accent:"#dbb765"},
    {label:"Rose Distinction",family:"classic",primary:"#a04e68",accent:"#e1c4a0"},
    {label:"Copper Spirit",family:"geometric",primary:"#a45b33",accent:"#e0bd78"},
    {label:"Midnight Silver",family:"laurel",primary:"#374459",accent:"#c6ccd4"},
    {label:"Emerald Prestige",family:"modern",primary:"#167253",accent:"#d6bb61"},
    {label:"Plum Celebration",family:"heritage",primary:"#744665",accent:"#d6b87a"},
    {label:"Sky Blue",family:"classic",primary:"#367da3",accent:"#f0ca69"},
    {label:"Burgundy Legacy",family:"geometric",primary:"#702d3f",accent:"#d4aa67"},
    {label:"Olive Honor",family:"laurel",primary:"#68733c",accent:"#d0b367"},
    {label:"Cobalt Victory",family:"modern",primary:"#304ab1",accent:"#f0c84b"},
    {label:"Coral Sports",family:"heritage",primary:"#bc5948",accent:"#f0c481"},
    {label:"Charcoal Classic",family:"classic",primary:"#41484b",accent:"#c6a567"},
    {label:"Aqua Achievement",family:"geometric",primary:"#258989",accent:"#e5c968"}
  ];
  const namedHouseColors = [
    { pattern: /\b(yellow|gold)\b/i, color: "#f2c511" },
    { pattern: /\bblue\b/i, color: "#218ef2" },
    { pattern: /\borange\b/i, color: "#ff8c00" },
    { pattern: /\b(mauve|purple|violet)\b/i, color: "#b784a7" },
    { pattern: /\bgreen\b/i, color: "#299447" },
    { pattern: /\bred\b/i, color: "#df3b36" },
    { pattern: /\bpink\b/i, color: "#e777a7" },
    { pattern: /\bbrown\b/i, color: "#8b5a2b" },
    { pattern: /\bblack\b/i, color: "#222222" },
    { pattern: /\bwhite\b/i, color: "#e6e6e6" },
    { pattern: /\b(grey|gray)\b/i, color: "#858b92" },
    { pattern: /\b(teal|turquoise)\b/i, color: "#149d99" },
    { pattern: /\bcyan\b/i, color: "#15bed1" }
  ];
  const colorForHouseName = name => {
    const match = namedHouseColors.find(option => option.pattern.test(String(name || "")));
    return match ? match.color : "";
  };
  const houseColor = (house, index) => {
    if (/^#[0-9a-f]{6}$/i.test(String(house && house.color || ""))) return house.color;
    const originalIndex = houses().indexOf(house);
    return colors[(originalIndex >= 0 ? originalIndex : index) % colors.length];
  };
  const houseTextColor = color => {
    const channels = color.slice(1).match(/.{2}/g).map(channel => parseInt(channel, 16) / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4));
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.179 ? "#111111" : "#ffffff";
  };
  const houses = () => state.data.houses || [];
  const records = name => state.data[name] || [];
  const schoolSettings = () => state.data.schoolSettings || {};
  const certificateTemplate = value => certificateTemplates[Number(value)-1] || certificateTemplates[0];
  const certificateTemplateOptions = value => certificateTemplates.map((template,index)=>`<option value="${index+1}" ${Number(value)===index+1?"selected":""}>${index+1}. ${escapeHtml(template.label)}</option>`).join("");
  const isAdmin = () => state.user && state.user.role === ROLE_ADMIN;
  const canEditPoints = () => !!state.user;

  async function api(action, payload) {
    const url = window.APP_CONFIG && window.APP_CONFIG.apiUrl;
    if (!url) throw new Error("Connect the app to Google Sheets by adding your Apps Script URL in config.js.");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ action: action, token: state.token }, payload || {})),
      redirect: "follow"
    });
    if (!response.ok) throw new Error("The server returned HTTP " + response.status + ".");
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || "The request could not be completed.");
    return result;
  }

  function updateSchoolIdentity() {
    const settings = schoolSettings();
    const name = settings.schoolName || "fieldhouse";
    const logo = settings.logo || "";
    $$("[data-school-name]").forEach(node => { node.textContent = name; });
    $$("[data-school-initial]").forEach(node => {
      node.textContent = name.charAt(0).toUpperCase() || "F";
      node.hidden = !!logo;
    });
    $$("[data-school-logo]").forEach(node => {
      node.src = logo;
      node.hidden = !logo;
    });
    $("#schoolCrumbName").textContent = settings.schoolName || "Workspace";
  }

  function toast(message, error) {
    const node = $("#toast");
    node.textContent = message;
    node.classList.toggle("error", !!error);
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 3300);
  }

  function showButtonProgress(button, label) {
    if (!button) return () => {};
    const originalContent = button.innerHTML;
    const wasDisabled = button.disabled;
    button.disabled = true;
    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    button.textContent = label;
    return () => {
      button.innerHTML = originalContent;
      button.disabled = wasDisabled;
      button.classList.remove("is-loading");
      button.removeAttribute("aria-busy");
    };
  }

  function updateProfileDisplay() {
    const user = state.user;
    if (!user) return;
    $("#sideName").textContent = user.fullName;
    $("#sideRole").textContent = user.role;
    $("#topProfileName").textContent = user.username || user.fullName;
    $("[data-action='open-profile'].top-profile-button").setAttribute("aria-label", "Open profile for " + (user.username || user.fullName));
    const initial = (user.fullName || user.username || "U").charAt(0).toUpperCase();
    const profileImage = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(user.profileImage || "") ? user.profileImage : "";
    [$("#sideAvatar"), $("#topAvatar")].forEach(avatar => {
      avatar.textContent = profileImage ? "" : initial;
      avatar.style.backgroundImage = profileImage ? `url("${profileImage}")` : "";
    });
  }

  function resizeProfileImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) {
        reject(new Error("Choose a JPG, PNG, or WebP image."));
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        reject(new Error("Choose an image smaller than 8 MB."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The selected picture could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("The selected picture could not be opened."));
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("This browser cannot process the selected picture."));
            return;
          }
          try {
            for (let maxSize = 256; maxSize >= 96; maxSize -= 32) {
              const scale = Math.min(1, maxSize / image.width, maxSize / image.height);
              canvas.width = Math.max(1, Math.round(image.width * scale));
              canvas.height = Math.max(1, Math.round(image.height * scale));
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
              for (let quality = 0.82; quality >= 0.42; quality -= 0.1) {
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                if (dataUrl.length <= 40000) {
                  resolve(dataUrl);
                  return;
                }
              }
            }
            reject(new Error("Choose a smaller or lower-resolution picture."));
          } catch(error) {
            reject(new Error("This browser could not process the selected picture."));
          }
        };
        image.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function setAuthTab(tab) {
    $$(".auth-tab").forEach(button => button.classList.toggle("active", button.dataset.auth === tab));
    $("#loginFormWrap").hidden = tab !== "login";
    $("#registerFormWrap").hidden = tab !== "register";
  }

  function setAuthenticated(user, token) {
    state.user = user;
    state.token = token;
    localStorage.setItem("fieldhouse.user", JSON.stringify(user));
    localStorage.setItem("fieldhouse.token", token);
    showDashboard();
  }

  function logout() {
    state.user = null;
    state.token = "";
    state.data = {};
    localStorage.removeItem("fieldhouse.user");
    localStorage.removeItem("fieldhouse.token");
    $("#dashboardView").hidden = true;
    $("#authView").hidden = false;
    setAuthTab("login");
    toast("Signed out successfully.");
  }

  function showDashboard() {
    if (!state.user || !state.token) return;
    $("#authView").hidden = true;
    $("#dashboardView").hidden = false;
    updateProfileDisplay();
    $$(".admin-only").forEach(node => { node.hidden = !isAdmin(); });
    $$(".nav-link[data-page='points']").forEach(node => { node.hidden = !canEditPoints(); });
    goTo(state.page);
    loadData().catch(error => toast(error.message, true));
  }

  async function loadData() {
    $("#connectionLabel").textContent = "Syncing";
    const result = await api("getDashboard");
    state.data = result.data || {};
    $("#connectionLabel").textContent = "Connected";
    updateSchoolIdentity();
    renderPage();
  }

  const pageTitles = {
    home: "Home", points: "Enter point",
    results: "Results", liveScore: "Live Score", certificates: "Certificates", admin: "Admin control panel"
  };
  function goTo(page) {
    if (page === "admin" && !isAdmin()) page = "home";
    if (page === "points" && !canEditPoints()) page = "home";
    state.page = page;
    $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === page));
    $("#pageCrumb").textContent = pageTitles[page] || "Home";
    renderPage();
  }

  function heading(title, description, button) {
    return `<div class="page-heading"><div><span class="eyebrow">FIELDHOUSE / ${escapeHtml(title.toUpperCase())}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>${button || ""}</div>`;
  }
  function button(label, action, light) {
    return `<button class="button ${light ? "button-light" : "button-dark"}" data-action="${escapeHtml(action)}">${escapeHtml(label)} <span>+</span></button>`;
  }
  function emptyRow(columns, text) {
    return `<tr><td class="empty-cell" colspan="${columns}">${escapeHtml(text)}</td></tr>`;
  }
  function houseName(houseId) {
    const index = houses().findIndex(house => house.id === houseId);
    return index < 0 ? "—" : `<span class="house-chip"><i class="house-dot" style="--dot:${houseColor(houses()[index],index)}"></i>${escapeHtml(houses()[index].name)}</span>`;
  }
  function totalsByHouse() {
    const totals = {};
    houses().forEach(house => { totals[house.id] = 0; });
    records("scoreEntries").forEach(entry => {
      (entry.awards || []).forEach(award => { totals[award.houseId] = (totals[award.houseId] || 0) + Number(award.points || 0); });
    });
    return totals;
  }
  function allPoints() {
    return records("points").map(item => Number(item.value)).filter(value => Number.isFinite(value));
  }

  function renderHome() {
    const total = totalsByHouse();
    const leader = houses().slice().sort((a, b) => (total[b.id] || 0) - (total[a.id] || 0))[0];
    return `${heading("Home", "Your season at a glance")}
      <section class="welcome-banner"><span class="welcome-date">${new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span><div class="welcome-copy"><span class="eyebrow">YOUR SPORTING COMMUNITY</span><h1>Welcome back, ${escapeHtml(state.user.fullName.split(" ")[0])}.</h1><p>Bring your community together through friendly competition. Keep track of event scores, celebrate every house, and make this season one to remember.</p></div></section>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-top">Registered houses <span class="stat-icon">⌂</span></div><div class="stat-number">${houses().length}</div><div class="stat-foot">Competing this season</div></div>
        <div class="stat-card"><div class="stat-top">Events recorded <span class="stat-icon">▤</span></div><div class="stat-number">${records("scoreEntries").length}</div><div class="stat-foot">Scores in the system</div></div>
        <div class="stat-card"><div class="stat-top">Certificates <span class="stat-icon">▧</span></div><div class="stat-number">${records("certificates").length}</div><div class="stat-foot">Athletic entries recorded</div></div>
        <div class="stat-card"><div class="stat-top">Current leader <span class="stat-icon">✳</span></div><div class="stat-number" style="font-size:18px">${leader ? escapeHtml(leader.name) : "—"}</div><div class="stat-foot">${leader ? (total[leader.id] || 0) + " total points" : "Add houses to get started"}</div></div>
      </div>
      <div class="two-column"><section class="panel"><div class="panel-title"><h3>House leaderboard</h3><span>Season totals</span></div>${houses().length ? houses().slice().sort((a,b)=>(total[b.id]||0)-(total[a.id]||0)).map((house,index)=>`<div class="activity-row"><span class="activity-icon" style="color:${houseColor(house,index)}">♢</span><div class="activity-main"><b>${escapeHtml(house.name)}</b><small>${escapeHtml(house.description || "Ready to compete")}</small></div><span class="activity-meta">${total[house.id] || 0} pts</span></div>`).join("") : `<div class="notice">Your houses will appear here once they are added by a Master Admin.</div>`}</section>
      <section class="panel"><div class="panel-title"><h3>Getting started</h3><span>QUICK GUIDE</span></div><div class="activity-row"><span class="activity-icon">01</span><div class="activity-main"><b>Set up your houses</b><small>Add the teams taking part in your sports season.</small></div></div><div class="activity-row"><span class="activity-icon">02</span><div class="activity-main"><b>Configure events & points</b><small>Build the categories and scoring options.</small></div></div><div class="activity-row"><span class="activity-icon">03</span><div class="activity-main"><b>Record the results</b><small>Award points and celebrate your winners.</small></div></div></section></div>`;
  }

  function renderAdmin() {
    const users = records("users");
    const pending = users.filter(user => user.status === "Pending").length;
    return `${heading("Admin control panel", "Manage access, houses, event categories, and scoring options.")}
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-top">All users <span class="stat-icon">♙</span></div><div class="stat-number">${users.length}</div><div class="stat-foot">Registered accounts</div></div>
        <div class="stat-card"><div class="stat-top">Awaiting approval <span class="stat-icon">◷</span></div><div class="stat-number">${pending}</div><div class="stat-foot">Need your attention</div></div>
        <div class="stat-card"><div class="stat-top">Houses <span class="stat-icon">⌂</span></div><div class="stat-number">${houses().length}</div><div class="stat-foot">In this competition</div></div>
        <div class="stat-card"><div class="stat-top">Categories <span class="stat-icon">▦</span></div><div class="stat-number">${records("categories").length}</div><div class="stat-foot">Event groupings</div></div>
      </div>
      ${renderSchoolSettings()}
      <section class="table-card admin-table"><div class="table-toolbar"><div class="toolbar-left"><h3>Registered users</h3><small>${users.length} accounts</small></div><input class="search-input" data-filter="users" placeholder="Search users…"></div><div class="table-wrap"><table><thead><tr><th>NAME</th><th>USERNAME</th><th>EMAIL</th><th>ROLE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody id="usersBody">${renderUserRows(users)}</tbody></table></div></section>
      <section class="table-card" style="margin-top:17px"><div class="table-toolbar"><div class="toolbar-left"><h3>Houses</h3><small>${houses().length} houses</small></div>${button("Add houses","add-houses")}</div><div class="table-wrap"><table><thead><tr><th>HOUSE</th><th>DESCRIPTION</th><th>COLOR</th><th>ADDED</th><th>ACTIONS</th></tr></thead><tbody>${houses().map((house,index)=>`<tr><td>${escapeHtml(house.name)}</td><td>${escapeHtml(house.description || "—")}</td><td><span class="house-color-swatch" style="--house-bg:${houseColor(house,index)}"></span></td><td>${dateLabel(house.createdAt)}</td><td><div class="actions-cell"><button class="table-action" data-action="edit-house" data-id="${escapeHtml(house.id)}">Edit</button><button class="table-action delete" data-action="delete-house" data-id="${escapeHtml(house.id)}">Delete</button></div></td></tr>`).join("") || emptyRow(5,"No houses added yet.")}</tbody></table></div></section>
      <section class="table-card" style="margin-top:17px"><div class="table-toolbar"><div class="toolbar-left"><h3>Competition setup</h3><small>${records("categories").length} categories · ${records("events").length} events · ${records("points").length} point values · ${records("positions").length} positions</small></div></div>
      ${renderOptionTable("Categories","categories",records("categories"),"name")}${renderOptionTable("Events","events",records("events"),"name")}${renderOptionTable("Points","points",records("points"),"value")}${renderOptionTable("Positions","positions",records("positions"),"value")}</section>`;
  }
  function renderSchoolSettings() {
    const settings = schoolSettings();
    return `<section class="table-card school-settings-card"><div class="table-toolbar"><div class="toolbar-left"><h3>School identity & certificate setup</h3><small>Displayed in the workspace and on certificates</small></div><button type="button" class="button button-danger" data-action="clear-school-info">Clear school identity</button></div>
      <form id="schoolSettingsForm" class="school-settings-form">
        <div class="form-row"><label>School name<input name="schoolName" required maxlength="120" value="${escapeHtml(settings.schoolName||"")}" placeholder="School name"></label><label>School motto<input name="motto" maxlength="200" value="${escapeHtml(settings.motto||"")}" placeholder="School motto"></label></div>
        <label>School address<textarea name="address" maxlength="300" placeholder="School address">${escapeHtml(settings.address||"")}</textarea></label>
        <div class="school-logo-setting"><div class="school-logo-preview-wrap"><img id="schoolLogoPreview" class="school-logo-preview" src="${settings.logo?escapeHtml(settings.logo):""}" alt="School logo preview" ${settings.logo?"":"hidden"}><span id="schoolLogoFallback" class="school-logo-fallback" ${settings.logo?"hidden":""}>Logo</span></div><div class="school-logo-controls"><label>School logo<input name="schoolLogo" type="file" accept="image/jpeg,image/png,image/webp"></label><label class="profile-remove-option"><input name="removeSchoolLogo" type="checkbox" ${settings.logo?"":"disabled"}> Remove current logo</label></div></div>
        <div class="form-row"><label>Meet title<input name="meetTitle" required maxlength="120" value="${escapeHtml(settings.meetTitle||"1st Annual Inter-Athlete Sports Meet")}"></label><label>Certificate template<select name="templateId">${certificateTemplateOptions(settings.templateId||1)}</select></label></div>
        <div class="form-row"><label>Certificate layout per sheet<select name="certificatesPerPage"><option value="1" ${String(settings.certificatesPerPage)==="1"?"selected":""}>1 landscape certificate on A4 landscape</option><option value="2" ${String(settings.certificatesPerPage||"2")==="2"?"selected":""}>2 landscape certificates on A4 portrait (stacked)</option></select></label><div class="school-settings-help">The two-per-sheet option stacks two landscape certificates vertically on portrait paper. Individual certificate previews show the full landscape design.</div></div>
        <div class="school-settings-actions"><button type="submit" class="button button-dark">Save school settings <span>→</span></button></div>
      </form></section>`;
  }
  function renderUserRows(users) {
    return users.map(user => `<tr><td>${escapeHtml(user.fullName)}</td><td>${escapeHtml(user.username)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td><td><span class="pill ${user.status === "Pending" ? "pending" : user.status === "Denied" ? "denied" : ""}">${escapeHtml(user.status)}</span></td><td><div class="actions-cell">${user.status !== "Approved" ? `<button class="table-action" data-action="approve-user" data-id="${escapeHtml(user.id)}">Approve</button>` : ""}${user.status !== "Denied" ? `<button class="table-action" data-action="deny-user" data-id="${escapeHtml(user.id)}">Deny</button>` : ""}<button class="table-action delete" data-action="delete-user" data-id="${escapeHtml(user.id)}">Delete</button></div></td></tr>`).join("") || emptyRow(6,"No registered users yet.");
  }
  function renderOptionTable(title, kind, items, key) {
    const addAction = kind === "points" ? "add-point-values" : "add-"+kind;
    return `<div class="table-toolbar" style="border-top:1px solid var(--line)"><div class="toolbar-left"><h3>${title}</h3><small>${items.length} saved</small></div><div class="toolbar-actions">${button("Add "+title.toLowerCase(), addAction, true)}<button class="button button-danger" data-action="clear-"+kind>Delete all</button></div></div><div class="table-wrap"><table><thead><tr><th>${title.toUpperCase()}</th><th>ADDED</th><th>ACTION</th></tr></thead><tbody>${items.map(item=>`<tr><td>${escapeHtml(kind === "positions" ? ordinal(item.value) : item.value)}</td><td>${dateLabel(item.createdAt)}</td><td><button class="table-action delete" data-action="delete-option" data-kind="${kind}" data-id="${escapeHtml(item.id)}">Delete</button></td></tr>`).join("") || emptyRow(3,`No ${title.toLowerCase()} added yet.`)}</tbody></table></div>`;
  }

  function renderPoints() {
    const totals=totalsByHouse();
    const leaders=houses().slice().sort((a,b)=>(totals[b.id]||0)-(totals[a.id]||0));
    const canDelete=isAdmin();
    return `${heading("Enter point","Award event points and follow your house leaderboard.",canEditPoints()?button("Add points","add-points"): "")}
      <div class="score-grid">${leaders.map((house,index)=>`<div class="score-card"><span><i class="house-dot" style="--dot:${houseColor(house,index)}"></i> ${escapeHtml(house.name)}</span><strong>${totals[house.id]||0} <small style="font-size:11px;color:#8b978f">pts</small></strong></div>`).join("") || `<div class="notice">Add houses in the admin control panel to start awarding points.</div>`}</div>
      <div class="table-card"><div class="table-toolbar"><div class="toolbar-left"><h3>Point history</h3><small>${records("scoreEntries").length} scoring rounds</small></div>${canDelete?`<button class="button button-danger" data-action="clear-score-entries">Delete all</button>`:""}</div><div class="table-wrap"><table><thead><tr><th>DATE</th><th>CATEGORY</th><th>EVENT</th><th>HOUSE AWARDS</th><th>RECORDED BY</th></tr></thead><tbody>${records("scoreEntries").map(entry=>{const cats=records("categories").find(x=>x.id===entry.categoryId);const evt=records("events").find(x=>x.id===entry.eventId);return `<tr><td>${dateLabel(entry.createdAt)}</td><td>${escapeHtml(cats?cats.value:"—")}</td><td>${escapeHtml(evt?evt.value:"—")}</td><td>${(entry.awards||[]).map(award=>`${houseName(award.houseId)}: <b>${escapeHtml(award.points)}</b>`).join(" &nbsp;·&nbsp; ")}</td><td>${escapeHtml(entry.createdBy||"—")}</td></tr>`;}).join("")||emptyRow(5,"No points have been awarded yet.")}</tbody></table></div></div>`;
  }

  function renderResults() {
    const total=totalsByHouse();
    const sorted=houses().slice().sort((a,b)=>(total[b.id]||0)-(total[a.id]||0));
    return `${heading("Results","The season standings, updated as scores are entered.")}
      <section class="welcome-banner" style="min-height:145px;margin-bottom:18px"><div class="welcome-copy"><span class="eyebrow">THE SEASON SO FAR</span><h1 style="font-size:25px">${sorted.length?escapeHtml(sorted[0].name)+" is setting the pace.":"The leaderboard is ready."}</h1><p>${sorted.length?escapeHtml(sorted[0].name)+" leads with "+(total[sorted[0].id]||0)+" points. Keep the competition going!":"Once points are awarded, each house's result will appear here."}</p></div></section>
      <div class="score-grid">${sorted.map((house,index)=>`<div class="score-card"><span>#${index+1} &nbsp; <i class="house-dot" style="--dot:${houseColor(house,index)}"></i> ${escapeHtml(house.name)}</span><strong>${total[house.id]||0} <small style="font-size:11px;color:#8b978f">points</small></strong><span>${escapeHtml(house.description||"Competing this season")}</span></div>`).join("")||`<div class="notice">No houses have been added yet.</div>`}</div>
      <section class="table-card"><div class="table-toolbar"><h3>House standings</h3><small>${sorted.length} houses</small></div><div class="table-wrap"><table><thead><tr><th>POSITION</th><th>HOUSE</th><th>TOTAL POINTS</th><th>EVENTS RECORDED</th></tr></thead><tbody>${sorted.map((house,index)=>`<tr><td>${ordinal(index+1)}</td><td>${houseName(house.id)}</td><td><b>${total[house.id]||0}</b></td><td>${records("scoreEntries").filter(entry=>(entry.awards||[]).some(a=>a.houseId===house.id)).length}</td></tr>`).join("")||emptyRow(4,"No results to display.")}</tbody></table></div></section>`;
  }

  function renderLiveScore() {
    const totals = totalsByHouse();
    const sorted = houses().slice().sort((a,b)=>(totals[b.id]||0)-(totals[a.id]||0));
    return `<section class="live-score-grid">${sorted.map((house,index)=>{
      const color = houseColor(house,index);
      return `<article class="live-score-card" style="--house-bg:${color};--house-text:${houseTextColor(color)}"><span>${escapeHtml(house.name)}</span><p class="live-score-description">${escapeHtml(house.description||"")}</p><strong>${totals[house.id]||0}</strong><small>POINTS</small></article>`;
    }).join("")||`<div class="notice">No houses have been added yet.</div>`}</section>`;
  }

  function renderCertificates() {
    const cats=records("categories"), events=records("events");
    const rows=records("certificates");
    const selectedHouse=$("#certHouseFilter")?$("#certHouseFilter").value:"all";
    return `${heading("Certificates","Recognize athletic achievement across every house.",button("Add certificate","add-cert"))}
      <div class="certificate-print-controls"><label>House<select id="certHouseFilter" class="search-input"><option value="all">All houses</option>${houses().map(house=>`<option value="${escapeHtml(house.id)}" ${selectedHouse===house.id?"selected":""}>${escapeHtml(house.name)}</option>`).join("")}</select></label><div class="toolbar-actions"><button class="button button-dark" data-action="print-certificates">Print certificates / Save as PDF</button><button class="button button-light" data-action="print-certificate-list">Print list</button>${isAdmin()?`<button class="button button-danger" data-action="reset-print-history">Reset print history</button>`:""}</div></div><p class="print-history-note">Confirmed prints are skipped on repeat runs for the same house and print type. All-house runs include records previously printed by house.</p>
      <div class="table-card"><div class="table-toolbar"><div class="toolbar-left"><h3>Certificate records</h3><small>${rows.length} athletes · printed records highlighted</small></div><input class="search-input" id="certSearch" placeholder="Search by athlete…"></div><div class="table-toolbar certificate-filter-toolbar"><label>Category<select id="certCategoryFilter" class="search-input"><option value="">All categories</option>${cats.map(cat=>`<option value="${escapeHtml(cat.id)}">${escapeHtml(cat.value)}</option>`).join("")}</select></label></div><div class="table-wrap"><table><thead><tr><th>ATHLETE</th><th>HOUSE</th><th>CATEGORY</th><th>EVENT</th><th>POSITION</th><th>DATE</th><th>PRINT STATUS</th><th>ACTIONS</th></tr></thead><tbody id="certificateRows">${renderCertificateRows(rows)}</tbody></table></div></div>`;
  }
  function renderCertificateRows(rows) {
    const catMap=Object.fromEntries(records("categories").map(x=>[x.id,x.value]));
    const eventMap=Object.fromEntries(records("events").map(x=>[x.id,x.value]));
    const history=records("printHistory");
    return rows.map(cert=>{
      const printedCertificate=history.some(item=>String(item.certificateId)===String(cert.id)&&item.printType==="certificate");
      const printedList=history.some(item=>String(item.certificateId)===String(cert.id)&&item.printType==="list");
      const printed=printedCertificate||printedList;
      const status=`${printedCertificate?`<span class="pill printed-pill">Certificate</span>`:""}${printedList?`<span class="pill printed-pill">List</span>`:""}${printed?"":`<span class="muted-status">Not printed</span>`}`;
      return `<tr class="${printed?"certificate-printed":""}" data-athlete="${escapeHtml(cert.athleteName.toLowerCase())}" data-house="${escapeHtml(cert.houseId)}" data-category="${escapeHtml(cert.categoryId)}"><td>${escapeHtml(cert.athleteName)}</td><td>${houseName(cert.houseId)}</td><td>${escapeHtml(catMap[cert.categoryId]||"—")}</td><td>${escapeHtml(eventMap[cert.eventId]||"—")}</td><td>${ordinal(cert.position)} place</td><td>${dateLabel(cert.createdAt)}</td><td>${status}</td><td><div class="actions-cell"><button class="table-action" data-action="view-cert" data-id="${escapeHtml(cert.id)}" title="View certificate" aria-label="View certificate">◉</button><button class="table-action" data-action="edit-cert" data-id="${escapeHtml(cert.id)}">Edit</button><button class="table-action delete" data-action="delete-cert" data-id="${escapeHtml(cert.id)}">Delete</button></div></td></tr>`;
    }).join("") || emptyRow(8,"No certificates found. Add an athlete to get started.");
  }

  function certificateTrophyIcon() {
    return `<svg class="certificate-trophy" viewBox="0 0 100 120" aria-hidden="true"><path class="trophy-gold" d="M25 12h50v22c0 20-9 33-25 41-16-8-25-21-25-41z"/><path class="trophy-line" d="M25 22H11v12c0 15 9 23 25 25M75 22h14v12c0 15-9 23-25 25"/><path class="trophy-gold" d="M43 72h14v20H43zM33 92h34v9H33zM27 103h46v8H27z"/><path class="trophy-star" d="m50 20 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/></svg>`;
  }

  function renderCertificate(cert) {
    const school=schoolSettings(), template=certificateTemplate(school.templateId);
    const house=houses().find(item=>String(item.id)===String(cert.houseId));
    const category=records("categories").find(item=>String(item.id)===String(cert.categoryId));
    const event=records("events").find(item=>String(item.id)===String(cert.eventId));
    const logo=school.logo?`<img src="${escapeHtml(school.logo)}" alt="">`:`<span class="certificate-logo-fallback">${escapeHtml((school.schoolName||"S").charAt(0).toUpperCase())}</span>`;
    const watermark=school.logo?`<img src="${escapeHtml(school.logo)}" alt="">`:certificateTrophyIcon();
    const address=escapeHtml(school.address||"").replace(/\n/g,"<br>");
    return `<article class="certificate" data-family="${template.family}" style="--cert-primary:${template.primary};--cert-accent:${template.accent}">
      <div class="certificate-frame"></div><div class="certificate-watermark" aria-hidden="true">${watermark}</div><header class="certificate-header"><div class="certificate-logo">${logo}</div><div class="certificate-school"><h1>${escapeHtml(school.schoolName||"School Name")}</h1>${school.motto?`<p class="certificate-motto">${escapeHtml(school.motto)}</p>`:""}${address?`<p class="certificate-address">${address}</p>`:""}</div><div class="certificate-logo">${logo}</div></header>
      <div class="certificate-content"><div class="certificate-award-mark">${certificateTrophyIcon()}<span>SPORTS ACHIEVEMENT</span></div><p class="certificate-meet-title">${escapeHtml(school.meetTitle||"1st Annual Inter-Athlete Sports Meet")}</p><p class="certificate-presented">This certificate is proudly presented to</p><h2>${escapeHtml(cert.athleteName)}</h2><p class="certificate-message">In recognition of outstanding effort, sportsmanship, and achievement.</p>
        <div class="certificate-details"><div><small>EVENT</small><b>${escapeHtml(event?event.value:"—")}</b></div><div><small>CATEGORY</small><b>${escapeHtml(category?category.value:"—")}</b></div><div><small>POSITION</small><b>${escapeHtml(ordinal(cert.position)+" place")}</b></div><div><small>HOUSE</small><b>${escapeHtml(house?house.name:"—")}</b></div></div>
      </div><footer class="certificate-footer"><span>${escapeHtml(new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}))}</span><div class="certificate-signatures"><div><i></i><b>Meet Organizer</b></div><div><i></i><b>School Authority</b></div></div></footer>
    </article>`;
  }

  function openCertificatePreview(cert) {
    modal("Certificate preview", `<div class="certificate-preview">${renderCertificate(cert)}</div><div class="certificate-preview-actions"><button class="button button-dark" data-action="print-single-cert" data-id="${escapeHtml(cert.id)}">Print / Save as PDF</button><button class="button button-light" data-action="save-cert-image" data-id="${escapeHtml(cert.id)}">Save as PNG</button></div>`);
    $("#modalRoot .modal").classList.add("certificate-modal");
  }

  function svgCertificate(cert) {
    const school=schoolSettings(), template=certificateTemplate(school.templateId);
    const house=houses().find(item=>String(item.id)===String(cert.houseId));
    const category=records("categories").find(item=>String(item.id)===String(cert.categoryId));
    const event=records("events").find(item=>String(item.id)===String(cert.eventId));
    const text=value=>escapeHtml(value||"");
    const logo=school.logo?`<image href="${text(school.logo)}" x="85" y="78" width="130" height="130" preserveAspectRatio="xMidYMid meet"/>`:`<text x="150" y="160" text-anchor="middle" font-size="76" font-family="Georgia" fill="${template.primary}">${text((school.schoolName||"S").charAt(0).toUpperCase())}</text>`;
    const rightLogo=logo.replace(/x="85"/,"x=\"1185\"").replace(/x="150"/,"x=\"1250\"");
    const line=(value,y,size,color,weight)=>`<text x="700" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" font-weight="${weight||400}" fill="${color}">${text(value)}</text>`;
    const logoWatermark=school.logo?`<image href="${text(school.logo)}" x="455" y="350" width="490" height="420" opacity=".09" preserveAspectRatio="xMidYMid meet"/>`:"";
    const trophy=`<g transform="translate(665 375) scale(.7)"><path d="M25 12h50v22c0 20-9 33-25 41-16-8-25-21-25-41z" fill="#d7ad4a" stroke="#9b762b" stroke-width="3"/><path d="M25 22H11v12c0 15 9 23 25 25M75 22h14v12c0 15-9 23-25 25" fill="none" stroke="#9b762b" stroke-width="5"/><path d="M43 72h14v20H43zM33 92h34v9H33zM27 103h46v8H27z" fill="#c29435"/><path d="m50 20 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#fff5d5"/></g>`;
    const frame=template.family==="heritage"
      ? `<rect x="28" y="28" width="1344" height="934" rx="8" fill="none" stroke="${template.primary}" stroke-width="12"/><rect x="52" y="52" width="1296" height="886" rx="5" fill="none" stroke="${template.accent}" stroke-width="3"/>`
      : template.family==="modern"
        ? `<path d="M35 35V955M35 955H1365" fill="none" stroke="${template.primary}" stroke-width="18"/><path d="M62 927H1365" fill="none" stroke="${template.accent}" stroke-width="5"/>`
        : template.family==="geometric"
          ? `<rect x="28" y="28" width="1344" height="934" rx="8" fill="none" stroke="${template.primary}" stroke-width="7"/><path d="M1372 28L1250 28L1372 150ZM28 962L150 962L28 840Z" fill="${template.accent}"/>`
          : `<rect x="28" y="28" width="1344" height="934" rx="8" fill="none" stroke="${template.primary}" stroke-width="8"/><rect x="48" y="48" width="1304" height="894" rx="5" fill="none" stroke="${template.accent}" stroke-width="2"/>`;
    const familyWatermark=template.family==="laurel"?`<text x="700" y="610" text-anchor="middle" font-size="250" font-family="Georgia" fill="${template.accent}" opacity=".08">✦</text>`:"";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990"><rect width="1400" height="990" fill="#fffdf7"/>${frame}${logoWatermark}${familyWatermark}${logo}${rightLogo}${line(school.schoolName||"School Name",150,42,template.primary,700)}${line(school.motto||"",200,23,template.accent,600)}${line(school.address||"",238,18,"#59636b",400)}<path d="M280 275H1120" stroke="${template.accent}" stroke-width="3"/>${line("SPORTS ACHIEVEMENT",315,17,template.accent,700)}${line(school.meetTitle||"1st Annual Inter-Athlete Sports Meet",350,30,template.primary,700)}${trophy}${line("THIS CERTIFICATE IS PROUDLY PRESENTED TO",475,20,"#59636b",600)}${line(cert.athleteName,560,62,template.primary,700)}<path d="M430 582H970" stroke="${template.accent}" stroke-width="2"/>${line("In recognition of outstanding effort, sportsmanship, and achievement.",625,22,"#59636b",400)}${line("EVENT: "+(event?event.value:"—"),695,23,template.primary,600)}${line("CATEGORY: "+(category?category.value:"—"),740,23,template.primary,600)}${line("POSITION: "+ordinal(cert.position)+" place     •     HOUSE: "+(house?house.name:"—"),785,23,template.primary,600)}<path d="M340 860H570M830 860H1060" stroke="${template.primary}" stroke-width="2"/>${line("Meet Organizer",895,18,"#59636b",400)}<text x="945" y="895" text-anchor="middle" font-family="Georgia" font-size="18" fill="#59636b">School Authority</text><text x="700" y="935" text-anchor="middle" font-family="Georgia" font-size="17" fill="#59636b">${text(new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}))}</text></svg>`;
  }

  function saveCertificateImage(cert) {
    const svgUrl=URL.createObjectURL(new Blob([svgCertificate(cert)],{type:"image/svg+xml;charset=utf-8"}));
    const image=new Image();
    image.onerror=()=>{URL.revokeObjectURL(svgUrl);toast("The certificate image could not be created.",true);};
    image.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=1400;canvas.height=990;
      const context=canvas.getContext("2d");
      if(!context){URL.revokeObjectURL(svgUrl);toast("This browser cannot create certificate images.",true);return;}
      context.drawImage(image,0,0,canvas.width,canvas.height);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob(blob=>{
        if(!blob){toast("The certificate image could not be saved.",true);return;}
        const link=document.createElement("a");
        link.href=URL.createObjectURL(blob);
        link.download=(cert.athleteName||"certificate").trim().replace(/[^\w-]+/g,"-")+".png";
        link.click();
        setTimeout(()=>URL.revokeObjectURL(link.href),1000);
        toast("Certificate image saved.");
      },"image/png");
    };
    image.src=svgUrl;
  }

  function printCandidates(printType,scope) {
    const history=records("printHistory");
    return records("certificates").filter(cert=>{
      if(scope!=="all"&&String(cert.houseId)!==String(scope))return false;
      return !history.some(item=>String(item.certificateId)===String(cert.id)&&item.printType===printType&&String(item.scope)===String(scope));
    });
  }

  function printCertificateBatch(certs,printType,scope,perPage) {
    if(!certs.length){toast("No unprinted records match this selection.",true);return;}
    const printWindow=window.open("","_blank");
    if(!printWindow){toast("Allow pop-ups to open the print preview.",true);return;}
    const twoUpPortrait=printType==="certificate"&&perPage===2;
    const pageOrientation=twoUpPortrait?"portrait":"landscape";
    const pageLayout=twoUpPortrait
      ? ".print-page{width:194mm;height:281mm;grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(2,137.2mm);align-content:center}"
      : ".print-page{width:281mm;height:194mm;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}";
    let handled=false;
    printWindow.onafterprint=async()=>{
      if(handled)return;
      handled=true;
      const label=printType==="list"?"certificate list":"certificate(s)";
      if(!window.confirm("Did the "+label+" print or save successfully?")){
        toast("Print history was not changed.");
        printWindow.close();
        return;
      }
      let result;
      try{
        result=await api("recordPrintBatch",{certificateIds:certs.map(cert=>cert.id),printType:printType,scope:scope});
      }catch(error){
        toast("The print completed, but print history could not be saved: "+error.message,true);
        printWindow.close();
        return;
      }
      try{await loadData();}
      catch(error){
        toast("Print history was saved, but the display could not be refreshed: "+error.message,true);
        printWindow.close();
        return;
      }
      toast((result.recordedIds||[]).length+" "+label+" marked as printed.");
      printWindow.close();
    };

    const school=schoolSettings();
    let body;
    let styles;
    if(printType==="list"){
      const logo=school.logo?`<img class="list-logo" src="${escapeHtml(school.logo)}" alt="">`:"";
      const categoryMap=Object.fromEntries(records("categories").map(item=>[item.id,item.value]));
      const eventMap=Object.fromEntries(records("events").map(item=>[item.id,item.value]));
      body=`<header class="list-heading">${logo}<div><h1>${escapeHtml(school.schoolName||"School")}</h1><p>${escapeHtml(school.motto||"")}</p><p>${escapeHtml(school.address||"")}</p><h2>Certificate Recipient List</h2><p>${escapeHtml(school.meetTitle||"1st Annual Inter-Athlete Sports Meet")}</p></div></header><table class="recipient-list"><thead><tr><th>ATHLETE</th><th>HOUSE</th><th>CATEGORY</th><th>EVENT</th><th>POSITION</th></tr></thead><tbody>${certs.map(cert=>{const house=houses().find(item=>String(item.id)===String(cert.houseId));return `<tr><td>${escapeHtml(cert.athleteName)}</td><td>${escapeHtml(house?house.name:"—")}</td><td>${escapeHtml(categoryMap[cert.categoryId]||"—")}</td><td>${escapeHtml(eventMap[cert.eventId]||"—")}</td><td>${escapeHtml(ordinal(cert.position)+" place")}</td></tr>`;}).join("")}</tbody></table>`;
      styles=`.list-heading{display:flex;align-items:center;gap:18px;text-align:center;justify-content:center;margin:0 0 16px}.list-logo{width:72px;height:72px;object-fit:contain}.list-heading h1,.list-heading h2,.list-heading p{margin:4px}.list-heading h1{font-size:22px}.list-heading h2{font-size:16px}.recipient-list{width:100%;border-collapse:collapse}.recipient-list th,.recipient-list td{border:1px solid #49545a;padding:8px 10px;text-align:left}.recipient-list th{background:#edf1f3}.recipient-list tr{break-inside:avoid;page-break-inside:avoid}`;
    }else{
      const pages=[];
      for(let index=0;index<certs.length;index+=perPage){
        pages.push(`<section class="print-page" style="--per-page:${perPage}">${certs.slice(index,index+perPage).map(cert=>renderCertificate(cert)).join("")}</section>`);
      }
      body=pages.join("");
      styles=certificatePrintStyles(twoUpPortrait);
    }
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(school.schoolName||"School")} - ${printType==="list"?"Certificate list":"Certificates"}</title><style>@page{size:A4 ${pageOrientation};margin:8mm}*{box-sizing:border-box}body{margin:0;color:#1b2826;font-family:Arial,sans-serif}.print-page{display:grid;gap:4mm;page-break-after:always;break-after:page}.print-page:last-child{page-break-after:auto;break-after:auto}${pageLayout}.print-list-page{width:281mm;min-height:194mm}.recipient-list thead{display:table-header-group}${styles}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}@media screen{body{padding:16px;background:#dfe5e2}.print-page,.print-list-page{margin:0 auto 16px;background:white;box-shadow:0 4px 20px #0002}}</style></head><body>${printType==="list"?`<section class="print-list-page">${body}</section>`:body}</body></html>`);
    printWindow.document.close();
    const images=Array.from(printWindow.document.images);
    Promise.all(images.map(image=>image.complete?Promise.resolve(image):new Promise(resolve=>{
      image.onload=()=>resolve(image);
      image.onerror=()=>resolve(image);
    }))).then(loadedImages=>{
      if(printWindow.closed)return;
      if(loadedImages.some(image=>!image.naturalWidth)){
        toast("A school logo could not be loaded. Check the school logo and try printing again.",true);
        printWindow.close();
        return;
      }
      printWindow.focus();
      printWindow.print();
    });
  }

  function certificatePrintStyles(twoUpPortrait) {
    const compactStyles=twoUpPortrait?`
      .certificate{padding:3mm}
      .certificate-frame{inset:2mm}
      .certificate-header{gap:2mm}
      .certificate-logo{width:13mm;height:13mm}
      .certificate-school h1{font-size:11pt}
      .certificate-motto,.certificate-address{margin-top:.7mm;font-size:6pt}
      .certificate-watermark{width:46mm;height:46mm}
      .certificate-award-mark{gap:.5mm;font-size:5pt;letter-spacing:.7px}
      .certificate-award-mark .certificate-trophy{width:8mm;height:10mm}
      .certificate-content{gap:1mm}
      .certificate-meet-title{font-size:9pt;letter-spacing:.5px}
      .certificate-presented{font-size:7pt}
      .certificate-content h2{margin:0;padding:0 2mm 1mm;font-size:24pt}
      .certificate-message{font-size:7pt}
      .certificate-details{gap:1mm;margin-top:1mm}
      .certificate-details div{gap:.5mm;padding:1mm 0}
      .certificate-details small{font-size:5pt}
      .certificate-details b{font-size:6.5pt}
      .certificate-footer{font-size:6pt}
      .certificate-signatures{gap:7mm}
      .certificate-signatures i{width:19mm}
      .certificate-signatures b{font-size:5.5pt}
    `:` 
      .certificate{padding:5mm}
      .certificate-frame{inset:3mm}
      .certificate-header{gap:5mm}
      .certificate-logo{width:22mm;height:22mm}
      .certificate-school h1{font-size:21pt}
      .certificate-motto,.certificate-address{font-size:9pt}
      .certificate-watermark{width:76mm;height:76mm}
      .certificate-award-mark{font-size:7pt}
      .certificate-award-mark .certificate-trophy{width:14mm;height:17mm}
      .certificate-content{gap:2mm}
      .certificate-meet-title{font-size:14pt}
      .certificate-presented{font-size:10pt}
      .certificate-content h2{font-size:36pt}
      .certificate-message{font-size:10pt}
      .certificate-details{gap:2mm;margin-top:3mm}
      .certificate-details div{gap:1mm;padding:2mm 1mm}
      .certificate-details small{font-size:6pt}
      .certificate-details b{font-size:9pt}
      .certificate-footer{font-size:8pt}
      .certificate-signatures{gap:12mm}
      .certificate-signatures i{width:30mm}
    `;
    return `
      .certificate{position:relative;isolation:isolate;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border:2px solid var(--cert-primary);background:#fffdf7;color:#27342f;text-align:center}
      .certificate-frame{position:absolute;z-index:0;inset:3mm;border:1px solid var(--cert-accent);pointer-events:none}
      .certificate[data-family="heritage"]{border:5px double var(--cert-primary)}
      .certificate[data-family="modern"]{border:0;border-left:8px solid var(--cert-primary);border-bottom:5px solid var(--cert-accent)}
      .certificate[data-family="geometric"]{background:linear-gradient(135deg,#fffdf7 0 91%,var(--cert-accent) 91% 92%,#fffdf7 92%)}
      .certificate[data-family="laurel"]:after{content:"✦";position:absolute;z-index:0;top:44%;left:50%;transform:translate(-50%,-50%);font-size:90pt;color:var(--cert-accent);opacity:.08;pointer-events:none}
      .certificate-watermark{position:absolute;z-index:0;top:52%;left:50%;width:64mm;height:64mm;transform:translate(-50%,-50%);display:grid;place-items:center;opacity:.1;pointer-events:none}
      .certificate-watermark img{width:100%;height:100%;object-fit:contain;filter:grayscale(1)}
      .certificate-watermark .certificate-trophy{width:70%;height:70%}
      .certificate-header,.certificate-content,.certificate-footer{position:relative;z-index:1}
      .certificate-header{display:grid;grid-template-columns:1fr 4fr 1fr;align-items:center;gap:5mm}
      .certificate-logo{margin:auto;display:grid;place-items:center}
      .certificate-logo img{max-width:100%;max-height:100%;object-fit:contain}
      .certificate-logo-fallback{color:var(--cert-primary);font:700 34pt Georgia,serif}
      .certificate-school{min-width:0}
      .certificate-school h1{margin:0;color:var(--cert-primary);font:700 21pt Georgia,serif;text-transform:uppercase;letter-spacing:.7px;overflow-wrap:anywhere}
      .certificate-motto,.certificate-address{margin:1mm 0 0;color:#5e6867;font-size:9pt;overflow-wrap:anywhere}
      .certificate-motto{color:var(--cert-accent);font-style:italic}
      .certificate-content{min-height:0;display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:2mm}
      .certificate-award-mark{display:flex;align-items:center;justify-content:center;gap:1mm;color:var(--cert-accent);font:700 7pt Arial,sans-serif;letter-spacing:1px}
      .certificate-trophy{width:14mm;height:17mm;flex:none}
      .trophy-gold{fill:#d7ad4a}
      .trophy-line{fill:none;stroke:#9b762b;stroke-width:5}
      .trophy-star{fill:#fff5d5}
      .certificate-meet-title{margin:0;color:var(--cert-primary);font:700 14pt Georgia,serif;text-transform:uppercase;letter-spacing:.7px;overflow-wrap:anywhere}
      .certificate-presented{margin:0;color:#69726e;font:italic 10pt Georgia,serif}
      .certificate-content h2{max-width:95%;margin:0;color:var(--cert-primary);font:700 36pt Georgia,serif;border-bottom:1px solid var(--cert-accent);padding:0 5mm 1mm;overflow-wrap:anywhere}
      .certificate-message{margin:0;color:#59635f;font:10pt Georgia,serif}
      .certificate-details{width:92%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2mm;margin-top:3mm}
      .certificate-details div{min-width:0;display:grid;gap:1mm;padding:2mm 1mm;border-top:1px solid var(--cert-accent);border-bottom:1px solid var(--cert-accent)}
      .certificate-details small{color:#7a817d;font-size:6pt;letter-spacing:.7px}
      .certificate-details b{color:var(--cert-primary);font:700 9pt Georgia,serif;overflow-wrap:anywhere}
      .certificate-footer{display:flex;justify-content:space-between;align-items:flex-end;color:#59635f;font-size:8pt}
      .certificate-signatures{display:flex;gap:12mm}
      .certificate-signatures div{display:grid;justify-items:center;gap:1mm}
      .certificate-signatures i{display:block;width:30mm;border-top:1px solid var(--cert-primary)}
      .certificate-signatures b{font:italic 7pt Georgia,serif}
      ${compactStyles}
    `;
  }

  function renderPage() {
    if (!state.user) return;
    const views = {home:renderHome,points:renderPoints,results:renderResults,liveScore:renderLiveScore,certificates:renderCertificates,admin:renderAdmin};
    $("#pageContent").innerHTML = (views[state.page] || renderHome)();
    if (state.page === "certificates") filterCertificates();
  }

  function modal(title, content) {
    $("#modalRoot").innerHTML = `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><div class="modal-header"><h3>${escapeHtml(title)}</h3><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div><div class="modal-body">${content}</div></section></div>`;
  }
  function closeModal() { $("#modalRoot").innerHTML = ""; }
  function modalFooter(label) { return `<div class="modal-footer"><button type="button" class="button button-light" data-action="close-modal">Cancel</button><button type="submit" class="button button-dark">${escapeHtml(label)}</button></div>`; }
  function openHouseForm(house) {
    const houseIndex = house ? houses().findIndex(item=>item.id===house.id) : -1;
    const savedColor = house && /^#[0-9a-f]{6}$/i.test(String(house.color || "")) ? house.color : "";
    const rows = house ? [Object.assign({},house,{color:savedColor||colorForHouseName(house.name)||houseColor(house,houseIndex)})] : Array.from({length:4},(_,index)=>({name:"",description:"",color:colors[(houses().length+index)%colors.length]}));
    modal(house ? "Edit house" : "Add houses", `<form id="houseForm" class="modal-form" data-id="${house?escapeHtml(house.id):""}"><div class="notice">Add up to 10 houses. Each house needs a name; a description is optional. Choose a color for the live scoreboard.</div><div id="houseFields" class="field-list">${rows.map(item=>houseField(item,!house)).join("")}</div>${!house?`<button type="button" class="button button-light" id="addHouseField">＋ Add another house</button>`:""}${modalFooter(house?"Save changes":"Save houses")}</form>`);
  }
  function houseField(item, removable) {
    return `<div class="dynamic-row house-field"><label style="flex:1">House name<input name="houseName" value="${escapeHtml(item.name)}" required maxlength="60" placeholder="e.g. Green House"></label><label style="flex:1">Description<input name="houseDescription" value="${escapeHtml(item.description||"")}" maxlength="160" placeholder="A short description (optional)"></label><label class="house-color-field">Color<input name="houseColor" type="color" value="${escapeHtml(item.color||colors[0])}" aria-label="House color"></label>${removable?`<button type="button" class="remove-field" data-action="remove-house-field" aria-label="Remove house">×</button>`:""}</div>`;
  }
  function openOptionsForm(kind) {
    const title={categories:"Categories",events:"Events",points:"Points",positions:"Positions"}[kind];
    const numeric=kind==="points"||kind==="positions";
    modal("Add "+title.toLowerCase(), `<form id="optionForm" class="modal-form" data-kind="${kind}"><div class="notice">Enter one or more ${title.toLowerCase()}. Save anytime; open this form again to add more. ${kind==="positions"?"Position values must be positive whole numbers.":kind==="points"?"Point values must be whole numbers.":""}</div><div class="field-list" id="optionFields">${Array.from({length:10},()=>optionField(kind,numeric)).join("")}</div>${modalFooter("Save "+title.toLowerCase())}</form>`);
  }
  function optionField(kind,numeric) {
    const label={categories:"Category name",events:"Event name",points:"Points",positions:"Position"}[kind];
    return `<label class="option-field">${label}<input name="optionValue" ${numeric?'type="number" step="1" min="1"':'type="text" maxlength="80"'} placeholder="${numeric?"Enter a number":"Enter "+label.toLowerCase()}"></label>`;
  }
  function openScoreForm() {
    const categories=records("categories"), events=records("events");
    if (!categories.length || !events.length || !houses().length || !allPoints().length) {
      toast("Add at least one category, event, house, and point value in Admin control panel first.", true); return;
    }
    const options=list=>list.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.value)}</option>`).join("");
    const pointOptions=records("points").map(item=>`<option value="${escapeHtml(item.value)}">${escapeHtml(item.value)} points</option>`).join("");
    modal("Award event points", `<form id="scoreForm" class="modal-form"><label>Category<select name="categoryId" required><option value="">Select category</option>${options(categories)}</select></label><label>Event<select name="eventId" required><option value="">Select event</option>${options(events)}</select></label><div class="notice">Choose a point value for each house. A house marked Awarded 0 can receive zero points. Non-zero point values must be unique between houses.</div><div>${houses().map((house,index)=>`<div class="points-entry" data-house-entry="${escapeHtml(house.id)}"><div><b><i class="house-dot" style="--dot:${houseColor(house,index)}"></i> ${escapeHtml(house.name)}</b><small>${escapeHtml(house.description||"")}</small></div><select name="point-${escapeHtml(house.id)}"><option value="">Select points</option>${pointOptions}</select><label><input type="checkbox" name="zero-${escapeHtml(house.id)}"> Awarded 0</label></div>`).join("")}</div>${modalFooter("Save points")}</form>`);
  }
  function openPointsForm() { openScoreForm(); }
  function openProfileForm() {
    const image = state.user.profileImage || "";
    const initial = (state.user.fullName || state.user.username || "U").charAt(0).toUpperCase();
    modal("Edit profile", `<form id="profileForm" class="modal-form">
      <div class="profile-edit-heading"><div><img id="profilePreview" class="profile-preview" alt="Profile picture preview" ${image?`src="${escapeHtml(image)}"`:"hidden"}><span id="profilePreviewFallback" class="avatar profile-preview-fallback" ${image?"hidden":""}>${escapeHtml(initial)}</span></div><div><b>${escapeHtml(state.user.fullName)}</b><small class="profile-role">${escapeHtml(state.user.role)}</small></div></div>
      <label>Username<input name="username" required maxlength="50" autocomplete="username" value="${escapeHtml(state.user.username)}"></label>
      <label>Current password<input name="currentPassword" type="password" required autocomplete="current-password" placeholder="Required to save profile changes"></label>
      <label>New password (leave blank to keep current password)<input name="newPassword" type="password" minlength="8" autocomplete="new-password" placeholder="At least 8 characters"></label>
      <label>Confirm new password<input name="confirmPassword" type="password" minlength="8" autocomplete="new-password" placeholder="Repeat new password"></label>
      <label>Profile picture<input name="profilePicture" type="file" accept="image/jpeg,image/png,image/webp"></label>
      <label class="profile-remove-option"><input name="removeProfilePicture" type="checkbox" ${image?"":"disabled"}> Remove current profile picture</label>
      ${modalFooter("Save profile")}
    </form>`);
  }
  function openCertificateForm(cert) {
    const categories=records("categories"), events=records("events"), positions=records("positions");
    if (!categories.length || !events.length || !houses().length || !positions.length) {
      toast("Add at least one category, event, house, and position in Admin control panel first.", true); return;
    }
    const selectOptions=(items,value)=>items.map(item=>`<option value="${escapeHtml(item.id)}" ${item.id===value?"selected":""}>${escapeHtml(item.value)}</option>`).join("");
    const positionOptions=positions.map(item=>`<option value="${escapeHtml(item.value)}" ${Number(item.value)===Number(cert&&cert.position)?"selected":""}>${ordinal(item.value)}</option>`).join("");
    const row=cert||{athleteName:"",houseId:"",position:""};
    modal(cert?"Edit certificate":"Add certificates", `<form id="certificateForm" class="modal-form" data-edit-id="${cert?escapeHtml(cert.id):""}"><div class="form-row"><label>Category<select name="categoryId" required><option value="">Select category</option>${selectOptions(categories,cert&&cert.categoryId)}</select></label><label>Event<select name="eventId" required><option value="">Select event</option>${selectOptions(events,cert&&cert.eventId)}</select></label></div><div class="notice">Category and event are shared by all athletes entered in this form.</div><div id="athleteFields" class="field-list">${cert?athleteField(row,true):athleteField(row,false)+athleteField(row,false)}</div>${!cert?`<button type="button" class="button button-light" id="addAthleteField">＋ Add another athlete</button>`:""}${modalFooter(cert?"Save changes":"Save certificates")}</form>`);
    $("#certificateForm").dataset.positionOptions=positionOptions;
  }
  function athleteField(row, editing) {
    const cat=records("categories"), evt=records("events");
    const positions=records("positions").map(item=>`<option value="${escapeHtml(item.value)}" ${Number(item.value)===Number(row.position)?"selected":""}>${ordinal(item.value)}</option>`).join("");
    return `<div class="athlete-row" style="padding:12px;border:1px solid var(--line);border-radius:8px;display:grid;gap:12px"><div class="form-row"><label>Athlete name<input name="athleteName" required maxlength="100" value="${escapeHtml(row.athleteName)}" placeholder="Full name"></label><label>House<select name="houseId" required><option value="">Select house</option>${houses().map(h=>`<option value="${escapeHtml(h.id)}" ${h.id===row.houseId?"selected":""}>${escapeHtml(h.name)}</option>`).join("")}</select></label></div><div class="form-row"><label>Position<select name="position" required><option value="">Select position</option>${positions}</select></label>${editing?"":`<div style="display:flex;align-items:end;justify-content:flex-end"><button type="button" class="remove-field" data-action="remove-athlete-field">Remove</button></div>`}</div></div>`;
  }

  function filterCertificates() {
    if (!$("#certificateRows")) return;
    const query=($("#certSearch").value||"").toLowerCase(), house=$("#certHouseFilter").value||"all", category=$("#certCategoryFilter").value;
    $$("tr[data-athlete]",$("#certificateRows")).forEach(row=>{row.hidden=!(row.dataset.athlete.includes(query)&&(house==="all"||row.dataset.house===house)&&(!category||row.dataset.category===category));});
  }
  async function perform(action, payload, success, button) {
    const restoreButton = showButtonProgress(button, "Saving...");
    try {
      await api(action,payload);
      closeModal();
      toast(success);
      try { await loadData(); }
      catch(error) { toast(success+" Data refresh failed: "+error.message,true); }
    }
    catch(error) { toast(error.message,true); }
    finally { restoreButton(); }
  }

  document.addEventListener("click", async event => {
    const nav=event.target.closest("[data-page]");
    if(nav){event.preventDefault();goTo(nav.dataset.page);if(window.matchMedia("(max-width: 720px)").matches)setNavigationOpen(false);return;}
    const tab=event.target.closest("[data-auth]");
    if(tab){setAuthTab(tab.dataset.auth);return;}
    const buttonEl=event.target.closest("[data-action]");
    if(!buttonEl)return;
    const action=buttonEl.dataset.action,idValue=buttonEl.dataset.id,kind=buttonEl.dataset.kind;
    if(action==="close-modal"||(action==="backdrop-close"&&event.target===buttonEl)){closeModal();return;}
    if(action==="add-houses"){openHouseForm();return;}
    if(action==="add-categories"||action==="add-events"||action==="add-point-values"||action==="add-positions"){openOptionsForm(action==="add-point-values"?"points":action.slice(4));return;}
    if(action==="add-points"&&state.page==="points"){openPointsForm();return;}
    if(action==="add-cert"){openCertificateForm();return;}
    if(action==="open-profile"){openProfileForm();return;}
    if(action==="edit-house"){openHouseForm(houses().find(item=>item.id===idValue));return;}
    if(action==="edit-cert"){openCertificateForm(records("certificates").find(item=>item.id===idValue));return;}
    if(action==="view-cert"){const cert=records("certificates").find(item=>String(item.id)===String(idValue));if(cert)openCertificatePreview(cert);return;}
    if(action==="print-single-cert"){
      const cert=records("certificates").find(item=>String(item.id)===String(idValue));
      if(cert&&printCandidates("certificate",String(cert.houseId)).some(item=>String(item.id)===String(cert.id)))printCertificateBatch([cert],"certificate",String(cert.houseId),1);
      else if(cert)toast("This certificate was already printed for its house.",true);
      return;
    }
    if(action==="save-cert-image"){const cert=records("certificates").find(item=>String(item.id)===String(idValue));if(cert)saveCertificateImage(cert);return;}
    if(action==="print-certificates"||action==="print-certificate-list"){
      const scope=$("#certHouseFilter").value||"all", printType=action==="print-certificates"?"certificate":"list";
      printCertificateBatch(printCandidates(printType,scope),printType,scope,Number(schoolSettings().certificatesPerPage)||2);
      return;
    }
    if(action==="clear-school-info"&&confirm("Clear the school name, motto, address, and logo from the workspace and certificates?")){
      perform("clearSchoolInfo",{},"School identity cleared.",buttonEl);return;
    }
    if(action==="reset-print-history"&&confirm("Reset all certificate and list print history? Previously printed records will be available to print again.")){
      perform("resetPrintHistory",{},"Print history reset.",buttonEl);return;
    }
    if(action==="remove-house-field"){buttonEl.closest(".house-field").remove();return;}
    if(action==="remove-athlete-field"){buttonEl.closest(".athlete-row").remove();return;}
    if(action==="approve-user"||action==="deny-user"){perform("setUserStatus",{userId:idValue,status:action==="approve-user"?"Approved":"Denied"},action==="approve-user"?"User approved.":"User denied.",buttonEl);return;}
    if(action==="delete-user"&&confirm("Delete this user account?")){perform("deleteUser",{userId:idValue},"User deleted.",buttonEl);return;}
    if(action==="delete-house"&&confirm("Delete this house? Existing scores for the house will no longer be included in totals.")){perform("deleteHouse",{houseId:idValue},"House deleted.",buttonEl);return;}
    if(action==="delete-option"&&confirm("Delete this item?")){perform("deleteOption",{kind:kind,itemId:idValue},"Item deleted.",buttonEl);return;}
    if(action.startsWith("clear-")) {
      const clearKind=action.slice(6);
      if(confirm("Delete all "+clearKind+"? This cannot be undone.")){perform("clearOptions",{kind:clearKind},"All "+clearKind+" deleted.",buttonEl);}
      return;
    }
    if(action==="clear-score-entries"&&confirm("Delete all point and score records? This cannot be undone.")){perform("clearScoreEntries",{},"All scoring records deleted.",buttonEl);return;}
    if(action==="delete-cert"&&confirm("Delete this certificate record?")){perform("deleteCertificate",{certificateId:idValue},"Certificate deleted.",buttonEl);return;}
  });

  document.addEventListener("submit", async event => {
    event.preventDefault();
    const form=event.target;
    const submitButton=event.submitter||$("button[type='submit']",form);
    if(form.id==="loginForm"){
      const values=Object.fromEntries(new FormData(form).entries());
      const restoreButton=showButtonProgress(submitButton,"Signing in...");
      try {const result=await api("login",values);if(result.user.status!=="Approved")throw new Error(result.user.status==="Denied"?"Your account has been denied. Contact an administrator.":"Your account is awaiting administrator approval.");setAuthenticated(result.user,result.token);toast("Signed in successfully.");}
      catch(error){toast(error.message,true);}
      finally{restoreButton();}
    }
    if(form.id==="schoolSettingsForm"){
      const fields=form.elements, file=fields.schoolLogo.files[0];
      const payload={
        schoolName:fields.schoolName.value.trim(),
        motto:fields.motto.value.trim(),
        address:fields.address.value.trim(),
        meetTitle:fields.meetTitle.value.trim(),
        templateId:fields.templateId.value,
        certificatesPerPage:fields.certificatesPerPage.value,
        logo:schoolSettings().logo||""
      };
      const restoreButton=showButtonProgress(submitButton,"Saving school settings...");
      try{
        if(file)payload.logo=await resizeProfileImage(file);
        else if(fields.removeSchoolLogo.checked)payload.logo="";
        await api("saveSchoolSettings",payload);
        await loadData();
        toast("School settings saved.");
      }catch(error){toast(error.message,true);}
      finally{restoreButton();}
    }
    if(form.id==="registerForm"){
      const values=Object.fromEntries(new FormData(form).entries());
      if(values.password!==values.confirmPassword){toast("Passwords do not match.",true);return;}
      const restoreButton=showButtonProgress(submitButton,"Creating account...");
      try {
        const result=await api("register",values);
        form.reset();
        setAuthTab("login");
        if(result.status==="Approved"){
          $("#loginForm").elements.role.value=result.role;
          toast("Registration successful. Your first account is an approved Master Admin; sign in to continue.");
        }else{
          toast("Registration submitted successfully. An administrator must approve your account.");
        }
      }
      catch(error){toast(error.message,true);}
      finally{restoreButton();}
    }
    if(form.id==="profileForm"){
      const newPassword=form.elements.newPassword.value;
      if(newPassword!==form.elements.confirmPassword.value){toast("The new passwords do not match.",true);return;}
      const file=form.elements.profilePicture.files[0];
      const restoreButton=showButtonProgress(submitButton,"Updating profile...");
      try {
        const payload={username:form.elements.username.value.trim(),currentPassword:form.elements.currentPassword.value,newPassword:newPassword};
        if(file) payload.profileImage=await resizeProfileImage(file);
        else if(form.elements.removeProfilePicture.checked) payload.profileImage="";
        const result=await api("updateProfile",payload);
        state.user=result.user;
        localStorage.setItem("fieldhouse.user",JSON.stringify(state.user));
        updateProfileDisplay();
        closeModal();
        toast("Profile updated successfully.");
      }
      catch(error){toast(error.message,true);}
      finally{restoreButton();}
    }
    if(form.id==="houseForm"){
      const rows=$$(".house-field",form).map(row=>({name:row.querySelector('[name="houseName"]').value.trim(),description:row.querySelector('[name="houseDescription"]').value.trim(),color:row.querySelector('[name="houseColor"]').value}));
      if(rows.some(entry=>!entry.name&&entry.description)){toast("A description needs a house name.",true);return;}
      const entries=rows.filter(entry=>entry.name);
      if(!entries.length){toast("Enter at least one house name.",true);return;}
      if(entries.length>10){toast("You can add up to 10 houses at a time.",true);return;}
      if(form.dataset.id){perform("updateHouse",{houseId:form.dataset.id,...entries[0]},"House updated.",submitButton);}
      else{perform("addHouses",{houses:entries},"Houses saved.",submitButton);}
    }
    if(form.id==="optionForm"){
      const values=$$('[name="optionValue"]',form).map(input=>input.value.trim()).filter(Boolean);
      if(!values.length){toast("Enter at least one value to save.",true);return;}
      if(["points","positions"].includes(form.dataset.kind)&&values.some(value=>!Number.isInteger(Number(value))||Number(value)<1)){toast("Enter positive whole numbers only.",true);return;}
      perform("addOptions",{kind:form.dataset.kind,values:values},"Saved "+values.length+" item(s).",submitButton);
    }
    if(form.id==="scoreForm"){
      const values=new FormData(form), awards=[];
      let missing=false;
      houses().forEach(house=>{
        const zero=values.get("zero-"+house.id)==="on", selected=values.get("point-"+house.id);
        if(!zero&&!selected)missing=true;
        awards.push({houseId:house.id,points:zero?0:Number(selected||0),zero:zero});
      });
      if(missing){toast("Select a point value or Awarded 0 for every house.",true);return;}
      const nonzero=awards.filter(award=>award.points>0).map(award=>award.points);
      if(new Set(nonzero).size!==nonzero.length){toast("Each non-zero point value must be unique. Awarded 0 is the only allowed tie.",true);return;}
      perform("addScoreEntry",{categoryId:values.get("categoryId"),eventId:values.get("eventId"),awards:awards,createdBy:state.user.fullName},"Event points saved.",submitButton);
    }
    if(form.id==="certificateForm"){
      const athletes=$$(".athlete-row",form).map(row=>({athleteName:row.querySelector('[name="athleteName"]').value.trim(),houseId:row.querySelector('[name="houseId"]').value,position:Number(row.querySelector('[name="position"]').value)}));
      if(athletes.some(row=>!row.athleteName||!row.houseId||!row.position)){toast("Complete the athlete name, house, and position for every entry.",true);return;}
      if(form.dataset.editId){perform("updateCertificate",{certificateId:form.dataset.editId,categoryId:form.elements.categoryId.value,eventId:form.elements.eventId.value,...athletes[0]},"Certificate updated.",submitButton);}
      else{perform("addCertificates",{categoryId:form.elements.categoryId.value,eventId:form.elements.eventId.value,athletes:athletes},"Certificates saved.",submitButton);}
    }
  });

  document.addEventListener("input",event=>{
    if(event.target.id==="certSearch")filterCertificates();
    if(event.target.matches(".house-field [name='houseName']")){
      const color=colorForHouseName(event.target.value);
      if(color)event.target.closest(".house-field").querySelector("[name='houseColor']").value=color;
    }
    if(event.target.dataset.filter==="users"){
      const query=event.target.value.toLowerCase();
      const matched=records("users").filter(user=>[user.fullName,user.username,user.email,user.role,user.status].some(value=>String(value).toLowerCase().includes(query)));
      $("#usersBody").innerHTML=renderUserRows(matched);
    }
  });
  document.addEventListener("change",event=>{
    if(event.target.id==="certCategoryFilter"||event.target.id==="certHouseFilter")filterCertificates();
    if(event.target.matches("#profileForm [name='profilePicture']")){
      const file=event.target.files[0];
      if(!file)return;
      if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>8*1024*1024){
        toast("Choose a JPG, PNG, or WebP image smaller than 8 MB.",true);
        event.target.value="";
        return;
      }
      const reader=new FileReader();
      reader.onerror=()=>toast("The selected picture preview could not be loaded.",true);
      reader.onload=()=>{
        const preview=$("#profilePreview"), fallback=$("#profilePreviewFallback");
        if(!preview||!fallback)return;
        preview.src=String(reader.result);
        preview.hidden=false;
        fallback.hidden=true;
        $("#profileForm").elements.removeProfilePicture.checked=false;
      };
      reader.readAsDataURL(file);
    }
    if(event.target.matches("#profileForm [name='removeProfilePicture']")){
      const preview=$("#profilePreview"), fallback=$("#profilePreviewFallback");
      if(event.target.checked){
        $("#profileForm").elements.profilePicture.value="";
        preview.hidden=true;
        fallback.hidden=false;
      }else if(state.user.profileImage){
        preview.src=state.user.profileImage;
        preview.hidden=false;
        fallback.hidden=true;
      }
    }
    if(event.target.matches("#schoolSettingsForm [name='schoolLogo']")){
      const file=event.target.files[0];
      if(!file)return;
      if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>8*1024*1024){
        toast("Choose a JPG, PNG, or WebP logo smaller than 8 MB.",true);
        event.target.value="";
        return;
      }
      const reader=new FileReader();
      reader.onerror=()=>toast("The selected school logo preview could not be loaded.",true);
      reader.onload=()=>{
        const preview=$("#schoolLogoPreview"), fallback=$("#schoolLogoFallback");
        preview.src=String(reader.result);
        preview.hidden=false;
        fallback.hidden=true;
        $("#schoolSettingsForm").elements.removeSchoolLogo.checked=false;
      };
      reader.readAsDataURL(file);
    }
    if(event.target.matches("#schoolSettingsForm [name='removeSchoolLogo']")){
      const preview=$("#schoolLogoPreview"),fallback=$("#schoolLogoFallback");
      if(event.target.checked){
        $("#schoolSettingsForm").elements.schoolLogo.value="";
        preview.hidden=true;
        fallback.hidden=false;
      }else if(schoolSettings().logo){
        preview.src=schoolSettings().logo;
        preview.hidden=false;
        fallback.hidden=true;
      }
    }
  });
  $("#logoutButton").addEventListener("click",logout);
  $("#refreshButton").addEventListener("click",async event=>{
    const restoreButton=showButtonProgress(event.currentTarget,"Refreshing...");
    try { await loadData(); toast("Data refreshed successfully."); }
    catch(error) { toast(error.message,true); }
    finally { restoreButton(); }
  });
  document.addEventListener("click",event=>{
    if(event.target.id==="addHouseField"){
      const container=$("#houseFields");
      if(container.children.length>=10){toast("You can add up to 10 houses.",true);return;}
      container.insertAdjacentHTML("beforeend",houseField({name:"",description:"",color:colors[(houses().length+container.children.length)%colors.length]},true));
      toast("House entry added.");
    }
    if(event.target.id==="addAthleteField"){
      $("#athleteFields").insertAdjacentHTML("beforeend",athleteField({athleteName:"",houseId:"",position:""},false));
      toast("Athlete entry added.");
    }
  });

  setInterval(()=>{
    if(!$("#dashboardView").hidden&&state.page==="liveScore")loadData().catch(error=>toast(error.message,true));
  },15000);

  if(state.user&&state.token)showDashboard();
})();

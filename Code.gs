const SHEETS = {
  Users: ["id", "fullName", "email", "username", "passwordHash", "salt", "role", "status", "createdAt", "profileImage"],
  Houses: ["id", "name", "description", "createdAt", "color"],
  Categories: ["id", "value", "createdAt"],
  Events: ["id", "value", "createdAt"],
  Points: ["id", "value", "createdAt"],
  Positions: ["id", "value", "createdAt"],
  ScoreEntries: ["id", "categoryId", "eventId", "awards", "createdBy", "createdAt"],
  Certificates: ["id", "athleteName", "houseId", "categoryId", "eventId", "position", "createdAt"],
  Settings: ["key", "value"],
  PrintHistory: ["id", "certificateId", "printType", "scope", "printedAt"],
  Sessions: ["token", "userId", "expiresAt"]
};
const ROLES = ["Master Admin", "House Master", "Field Recorder"];
const SESSION_DAYS = 7;

function doGet() {
  ensureSheets_();
  return json_({ ok: true, message: "Fieldhouse API is ready." });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    ensureSheets_();
    const body = JSON.parse(event.postData.contents || "{}");
    const result = dispatch_(body);
    return json_(Object.assign({ ok: true }, result || {}));
  } catch (error) {
    return json_({ ok: false, error: error && error.message ? error.message : "The request could not be completed." });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function dispatch_(request) {
  switch (request.action) {
    case "register": return register_(request);
    case "login": return login_(request);
    case "getDashboard": return { data: dashboard_(requireUser_(request.token)) };
    case "updateProfile": return updateProfile_(request, requireUser_(request.token));
    case "setUserStatus": return setUserStatus_(request, requireRole_(request.token, ["Master Admin"]));
    case "deleteUser": return deleteUser_(request, requireRole_(request.token, ["Master Admin"]));
    case "addHouses": return addHouses_(request, requireRole_(request.token, ["Master Admin"]));
    case "updateHouse": return updateHouse_(request, requireRole_(request.token, ["Master Admin"]));
    case "deleteHouse": return deleteHouse_(request, requireRole_(request.token, ["Master Admin"]));
    case "addOptions": return addOptions_(request, requireRole_(request.token, ["Master Admin"]));
    case "deleteOption": return deleteOption_(request, requireRole_(request.token, ["Master Admin"]));
    case "clearOptions": return clearOptions_(request, requireRole_(request.token, ["Master Admin"]));
    case "addScoreEntry": return addScoreEntry_(request, requireRole_(request.token, ["Master Admin", "House Master", "Field Recorder"]));
    case "clearScoreEntries": return clearScoreEntries_(request, requireRole_(request.token, ["Master Admin"]));
    case "addCertificates": return addCertificates_(request, requireRole_(request.token, ["Master Admin", "House Master", "Field Recorder"]));
    case "updateCertificate": return updateCertificate_(request, requireRole_(request.token, ["Master Admin", "House Master", "Field Recorder"]));
    case "deleteCertificate": return deleteCertificate_(request, requireRole_(request.token, ["Master Admin", "House Master", "Field Recorder"]));
    case "saveSchoolSettings": return saveSchoolSettings_(request, requireRole_(request.token, ["Master Admin"]));
    case "clearSchoolInfo": return clearSchoolInfo_(request, requireRole_(request.token, ["Master Admin"]));
    case "recordPrintBatch": return recordPrintBatch_(request, requireUser_(request.token));
    case "resetPrintHistory": return resetPrintHistory_(request, requireRole_(request.token, ["Master Admin"]));
    default: throw new Error("Unknown request.");
  }
}

function ensureSheets_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Bind this Apps Script project to a Google spreadsheet.");
  Object.keys(SHEETS).forEach(function (name) {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    const headers = SHEETS[name];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    } else {
      const lastColumn = sheet.getLastColumn();
      const current = sheet.getRange(1, 1, 1, Math.max(lastColumn, headers.length)).getValues()[0];
      headers.forEach(function (header, index) {
        if (current[index] === header) return;
        if (index >= lastColumn && !current[index]) {
          sheet.getRange(1, index + 1).setValue(header);
          current[index] = header;
          return;
        }
        throw new Error("Unexpected columns in the " + name + " sheet.");
      });
    }
  });
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function rows_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.filter(function (row) { return row.some(function (cell) { return cell !== ""; }); }).map(function (row) {
    const result = {};
    headers.forEach(function (header, index) { result[header] = row[index]; });
    return result;
  });
}

function append_(name, object) {
  const headers = SHEETS[name];
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  sheet.appendRow(headers.map(function (header) { return object[header] === undefined ? "" : object[header]; }));
}

function updateById_(name, id, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");
  const rowIndex = values.findIndex(function (row, index) { return index > 0 && String(row[idIndex]) === String(id); });
  if (rowIndex < 1) throw new Error("The requested record was not found.");
  Object.keys(updates).forEach(function (key) {
    const column = headers.indexOf(key);
    if (column >= 0) sheet.getRange(rowIndex + 1, column + 1).setValue(updates[key]);
  });
}

function deleteById_(name, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");
  const rowIndex = values.findIndex(function (row, index) { return index > 0 && String(row[idIndex]) === String(id); });
  if (rowIndex < 1) throw new Error("The requested record was not found.");
  sheet.deleteRow(rowIndex + 1);
}

function clearData_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
}

function now_() {
  return new Date().toISOString();
}

function makeId_() {
  return Utilities.getUuid();
}

function register_(request) {
  const fullName = String(request.fullName || "").trim();
  const email = String(request.email || "").trim().toLowerCase();
  const username = String(request.username || "").trim();
  const password = String(request.password || "");
  const role = String(request.role || "");
  if (!fullName || !username || !email || !password) throw new Error("Complete all required registration fields.");
  if (password.length < 8) throw new Error("Password must contain at least 8 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (ROLES.indexOf(role) < 0) throw new Error("Select a valid role.");
  const users = rows_("Users");
  if (users.some(function (user) { return String(user.username).toLowerCase() === username.toLowerCase(); })) throw new Error("That username is already registered.");
  if (users.some(function (user) { return String(user.email).toLowerCase() === email; })) throw new Error("That email address is already registered.");
  const salt = Utilities.getUuid() + Utilities.getUuid();
  const isFirstUser = users.length === 0;
  const assignedRole = isFirstUser ? "Master Admin" : role;
  const status = isFirstUser ? "Approved" : "Pending";
  append_("Users", {
    id: makeId_(), fullName: fullName, email: email, username: username,
    passwordHash: passwordHash_(password, salt), salt: salt, role: assignedRole, status: status, createdAt: now_(), profileImage: ""
  });
  return { status: status, role: assignedRole };
}

function login_(request) {
  const username = String(request.username || "").trim().toLowerCase();
  const password = String(request.password || "");
  const role = String(request.role || "");
  const user = rows_("Users").find(function (item) { return String(item.username).toLowerCase() === username; });
  if (!user || user.passwordHash !== passwordHash_(password, user.salt)) throw new Error("Invalid username or password.");
  if (user.role !== role) throw new Error("The selected role does not match this account.");
  if (user.status !== "Approved")   return { user: publicUser_(user, true), token: "" };
  const token = Utilities.getUuid() + Utilities.getUuid();
  append_("Sessions", { token: token, userId: user.id, expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000 });
  return { user: publicUser_(user, true), token: token };
}

function passwordHash_(password, salt) {
  let value = salt + password;
  for (let iteration = 0; iteration < 10000; iteration++) {
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
    value = Utilities.base64Encode(digest);
  }
  return value;
}

function publicUser_(user, includeProfileImage) {
  const result = { id: String(user.id), fullName: String(user.fullName), email: String(user.email), username: String(user.username), role: String(user.role), status: String(user.status) };
  if (includeProfileImage) result.profileImage = String(user.profileImage || "");
  return result;
}

function updateProfile_(request, user) {
  const currentPassword = String(request.currentPassword || "");
  if (!currentPassword || passwordHash_(currentPassword, user.salt) !== user.passwordHash) {
    throw new Error("Your current password is incorrect.");
  }
  const username = String(request.username || "").trim();
  if (!username || username.length > 50) throw new Error("Enter a username of up to 50 characters.");
  const users = rows_("Users");
  if (users.some(function (item) {
    return String(item.id) !== String(user.id) && String(item.username).toLowerCase() === username.toLowerCase();
  })) throw new Error("That username is already registered.");

  const updates = { username: username };
  if (Object.prototype.hasOwnProperty.call(request, "profileImage")) {
    const profileImage = String(request.profileImage || "");
    if (profileImage && (profileImage.length > 40000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(profileImage))) {
      throw new Error("Choose a supported profile picture smaller than 30 KB.");
    }
    updates.profileImage = profileImage;
  }
  const newPassword = String(request.newPassword || "");
  if (newPassword) {
    if (newPassword.length < 8) throw new Error("Your new password must contain at least 8 characters.");
    const salt = Utilities.getUuid() + Utilities.getUuid();
    updates.passwordHash = passwordHash_(newPassword, salt);
    updates.salt = salt;
  }
  updateById_("Users", user.id, updates);
  return { user: publicUser_(Object.assign({}, user, updates), true) };
}

function requireUser_(token) {
  if (!token) throw new Error("Please sign in again.");
  const now = Date.now();
  const session = rows_("Sessions").find(function (item) { return item.token === token && Number(item.expiresAt) > now; });
  if (!session) throw new Error("Your session has expired. Please sign in again.");
  const user = rows_("Users").find(function (item) { return String(item.id) === String(session.userId); });
  if (!user || user.status !== "Approved") throw new Error("This account is no longer approved.");
  return user;
}

function requireRole_(token, roles) {
  const user = requireUser_(token);
  if (roles.indexOf(user.role) < 0) throw new Error("You do not have permission to perform this action.");
  return user;
}

function dashboard_(user) {
  const data = {
    houses: rows_("Houses"),
    categories: rows_("Categories"),
    events: rows_("Events"),
    points: rows_("Points"),
    positions: rows_("Positions"),
    scoreEntries: rows_("ScoreEntries").map(function (entry) {
      entry.awards = entry.awards ? JSON.parse(entry.awards) : [];
      return entry;
    }),
    certificates: rows_("Certificates"),
    schoolSettings: schoolSettings_(),
    printHistory: rows_("PrintHistory")
  };
  if (user.role === "Master Admin") data.users = rows_("Users").map(publicUser_);
  return data;
}

function schoolSettings_() {
  const saved = {};
  rows_("Settings").forEach(function (item) { saved[String(item.key)] = String(item.value || ""); });
  return {
    schoolName: saved.schoolName || "",
    motto: saved.motto || "",
    address: saved.address || "",
    logo: saved.logo || "",
    meetTitle: saved.meetTitle || "1st Annual Inter-Athlete Sports Meet",
    templateId: saved.templateId || "1",
    certificatesPerPage: saved.certificatesPerPage || "2"
  };
}

function saveSchoolSettings_(request) {
  const schoolName = String(request.schoolName || "").trim();
  const motto = String(request.motto || "").trim();
  const address = String(request.address || "").trim();
  const meetTitle = String(request.meetTitle || "").trim();
  const logo = String(request.logo || "");
  const templateId = String(request.templateId || "");
  const certificatesPerPage = String(request.certificatesPerPage || "");
  if (!schoolName || schoolName.length > 120) throw new Error("Enter a school name of up to 120 characters.");
  if (motto.length > 200) throw new Error("The school motto must be 200 characters or fewer.");
  if (address.length > 300) throw new Error("The school address must be 300 characters or fewer.");
  if (!meetTitle || meetTitle.length > 120) throw new Error("Enter a meet title of up to 120 characters.");
  if (logo && (logo.length > 40000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(logo))) {
    throw new Error("Choose a supported school logo smaller than 30 KB.");
  }
  if (!/^(?:[1-9]|1\d|20)$/.test(templateId)) throw new Error("Choose a certificate template from 1 to 20.");
  if (certificatesPerPage !== "1" && certificatesPerPage !== "2") throw new Error("Choose one or two certificates per page.");

  const updates = {
    schoolName: schoolName,
    motto: motto,
    address: address,
    logo: logo,
    meetTitle: meetTitle,
    templateId: templateId,
    certificatesPerPage: certificatesPerPage
  };
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  const values = sheet.getDataRange().getValues();
  const keyIndex = values[0].indexOf("key");
  Object.keys(updates).forEach(function (key) {
    const rowIndex = values.findIndex(function (row, index) { return index > 0 && String(row[keyIndex]) === key; });
    if (rowIndex < 1) {
      sheet.appendRow([key, updates[key]]);
      values.push([key, updates[key]]);
    } else {
      sheet.getRange(rowIndex + 1, 2).setValue(updates[key]);
    }
  });
  return { schoolSettings: schoolSettings_() };
}

function clearSchoolInfo_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  const values = sheet.getDataRange().getValues();
  const keyIndex = values[0].indexOf("key");
  ["schoolName", "motto", "address", "logo"].forEach(function (key) {
    const rowIndex = values.findIndex(function (row, index) { return index > 0 && String(row[keyIndex]) === key; });
    if (rowIndex > 0) sheet.getRange(rowIndex + 1, 2).clearContent();
  });
  return {};
}

function recordPrintBatch_(request) {
  const printType = String(request.printType || "");
  const scope = String(request.scope || "");
  const ids = request.certificateIds;
  if (printType !== "certificate" && printType !== "list") throw new Error("Choose a valid print type.");
  if (scope !== "all" && !rows_("Houses").some(function (house) { return String(house.id) === scope; })) {
    throw new Error("Choose a valid house for this print batch.");
  }
  if (!Array.isArray(ids) || !ids.length || ids.length > 2000) throw new Error("Choose between 1 and 2,000 certificates to record.");

  const certificates = rows_("Certificates");
  const history = rows_("PrintHistory");
  const seen = {};
  const selected = [];
  ids.forEach(function (id) {
    const certificateId = String(id);
    if (seen[certificateId]) return;
    seen[certificateId] = true;
    const certificate = certificates.find(function (item) { return String(item.id) === certificateId; });
    if (!certificate) throw new Error("A certificate in this print batch no longer exists.");
    if (scope !== "all" && String(certificate.houseId) !== scope) throw new Error("A certificate does not belong to the selected house.");
    selected.push(certificateId);
  });

  const recordedIds = [];
  selected.forEach(function (certificateId) {
    if (history.some(function (item) {
      return String(item.certificateId) === certificateId && item.printType === printType && String(item.scope) === scope;
    })) return;
    append_("PrintHistory", {
      id: makeId_(), certificateId: certificateId, printType: printType,
      scope: scope, printedAt: now_()
    });
    recordedIds.push(certificateId);
  });
  return { recordedIds: recordedIds };
}

function resetPrintHistory_() {
  clearData_("PrintHistory");
  return {};
}

function setUserStatus_(request, actor) {
  if (String(request.userId) === String(actor.id)) throw new Error("You cannot change your own account status.");
  const user = rows_("Users").find(function (item) { return String(item.id) === String(request.userId); });
  if (!user) throw new Error("The requested user was not found.");
  if (request.status !== "Approved" && request.status !== "Denied") throw new Error("Invalid user status.");
  updateById_("Users", request.userId, { status: request.status });
  return {};
}

function deleteUser_(request, actor) {
  const user = rows_("Users").find(function (item) { return String(item.id) === String(request.userId); });
  if (!user) throw new Error("The requested user was not found.");
  if (String(user.id) === String(actor.id)) throw new Error("You cannot delete your own account.");
  if (user.role === "Master Admin" && user.status === "Approved" && rows_("Users").filter(function (item) { return item.role === "Master Admin" && item.status === "Approved"; }).length <= 1) {
    throw new Error("At least one approved Master Admin must remain.");
  }
  deleteById_("Users", request.userId);
  return {};
}

function addHouses_(request) {
  const houses = request.houses;
  if (!Array.isArray(houses) || houses.length < 1 || houses.length > 10) throw new Error("Add between 1 and 10 houses.");
  const current = rows_("Houses");
  const names = current.map(function (house) { return String(house.name).toLowerCase(); });
  houses.forEach(function (house) {
    const name = String(house.name || "").trim();
    if (!name) throw new Error("Every house needs a name.");
    if (names.indexOf(name.toLowerCase()) >= 0) throw new Error("House names must be unique.");
    names.push(name.toLowerCase());
  });
  houses.forEach(function (house) { append_("Houses", { id: makeId_(), name: String(house.name).trim(), description: String(house.description || "").trim(), createdAt: now_(), color: houseColor_(house.color) }); });
  return {};
}

function updateHouse_(request) {
  const name = String(request.name || "").trim();
  if (!name) throw new Error("House name is required.");
  if (rows_("Houses").some(function (house) { return String(house.id) !== String(request.houseId) && String(house.name).toLowerCase() === name.toLowerCase(); })) throw new Error("House names must be unique.");
  updateById_("Houses", request.houseId, { name: name, description: String(request.description || "").trim(), color: houseColor_(request.color) });
  return {};
}

function houseColor_(value) {
  const color = String(value || "#6e9a72").trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error("Choose a valid house color.");
  return color.toLowerCase();
}

function deleteHouse_(request) {
  deleteById_("Houses", request.houseId);
  return {};
}

function optionSheet_(kind) {
  const map = { categories: "Categories", events: "Events", points: "Points", positions: "Positions" };
  const sheet = map[kind];
  if (!sheet) throw new Error("Invalid setup list.");
  return sheet;
}

function addOptions_(request) {
  const sheet = optionSheet_(request.kind);
  if (!Array.isArray(request.values) || request.values.length < 1 || request.values.length > 10) throw new Error("Enter between 1 and 10 values.");
  const numeric = sheet === "Points" || sheet === "Positions";
  const existing = rows_(sheet).map(function (item) { return String(item.value).toLowerCase(); });
  const values = request.values.map(function (value) {
    const normalized = String(value).trim();
    if (!normalized) throw new Error("Values cannot be blank.");
    if (numeric && (!/^\d+$/.test(normalized) || Number(normalized) < 1)) throw new Error(sheet + " must be positive whole numbers.");
    return numeric ? String(Number(normalized)) : normalized;
  });
  values.forEach(function (value) {
    const key = value.toLowerCase();
    if (existing.indexOf(key) >= 0) throw new Error("Values must be unique; " + value + " already exists.");
    existing.push(key);
  });
  values.forEach(function (value) { append_(sheet, { id: makeId_(), value: value, createdAt: now_() }); });
  return {};
}

function deleteOption_(request) {
  deleteById_(optionSheet_(request.kind), request.itemId);
  return {};
}

function clearOptions_(request) {
  clearData_(optionSheet_(request.kind));
  return {};
}

function addScoreEntry_(request) {
  if (!request.categoryId || !request.eventId) throw new Error("Select a category and event.");
  if (!rows_("Categories").some(function (item) { return String(item.id) === String(request.categoryId); })) throw new Error("The selected category no longer exists.");
  if (!rows_("Events").some(function (item) { return String(item.id) === String(request.eventId); })) throw new Error("The selected event no longer exists.");
  const currentHouses = rows_("Houses");
  if (!currentHouses.length) throw new Error("Add houses before recording scores.");
  if (!Array.isArray(request.awards) || request.awards.length !== currentHouses.length) throw new Error("Provide an award or zero status for every house.");
  const houseIds = currentHouses.map(function (house) { return String(house.id); });
  const seen = {};
  const nonzero = [];
  request.awards.forEach(function (award) {
    if (houseIds.indexOf(String(award.houseId)) < 0 || seen[award.houseId]) throw new Error("Each house must appear exactly once.");
    seen[award.houseId] = true;
    if (award.zero) {
      if (Number(award.points) !== 0) throw new Error("Awarded 0 houses must receive zero points.");
    } else {
      const point = rows_("Points").find(function (item) { return Number(item.value) === Number(award.points); });
      if (!point) throw new Error("Select a configured point value for each house.");
      nonzero.push(Number(award.points));
    }
  });
  if (new Set(nonzero).size !== nonzero.length) throw new Error("Non-zero point values must be unique between houses.");
  append_("ScoreEntries", {
    id: makeId_(), categoryId: request.categoryId, eventId: request.eventId,
    awards: JSON.stringify(request.awards.map(function (award) { return { houseId: String(award.houseId), points: Number(award.points) }; })),
    createdBy: String(request.createdBy || "").slice(0, 100), createdAt: now_()
  });
  return {};
}

function clearScoreEntries_() {
  clearData_("ScoreEntries");
  return {};
}

function addCertificates_(request) {
  validateCertificateShared_(request.categoryId, request.eventId);
  if (!Array.isArray(request.athletes) || !request.athletes.length || request.athletes.length > 100) throw new Error("Add at least one athlete.");
  request.athletes.forEach(function (athlete) { validateAthlete_(athlete); });
  request.athletes.forEach(function (athlete) {
    append_("Certificates", {
      id: makeId_(), athleteName: String(athlete.athleteName).trim(), houseId: String(athlete.houseId),
      categoryId: request.categoryId, eventId: request.eventId, position: Number(athlete.position), createdAt: now_()
    });
  });
  return {};
}

function validateCertificateShared_(categoryId, eventId) {
  if (!rows_("Categories").some(function (item) { return String(item.id) === String(categoryId); })) throw new Error("Select a valid category.");
  if (!rows_("Events").some(function (item) { return String(item.id) === String(eventId); })) throw new Error("Select a valid event.");
}

function validateAthlete_(athlete) {
  if (!String(athlete.athleteName || "").trim()) throw new Error("Athlete name is required.");
  if (!rows_("Houses").some(function (item) { return String(item.id) === String(athlete.houseId); })) throw new Error("Select a valid house.");
  if (!rows_("Positions").some(function (item) { return Number(item.value) === Number(athlete.position); })) throw new Error("Select a configured position.");
}

function updateCertificate_(request) {
  validateCertificateShared_(request.categoryId, request.eventId);
  validateAthlete_(request);
  updateById_("Certificates", request.certificateId, {
    athleteName: String(request.athleteName).trim(), houseId: String(request.houseId),
    categoryId: request.categoryId, eventId: request.eventId, position: Number(request.position)
  });
  return {};
}

function deleteCertificate_(request) {
  deleteById_("Certificates", request.certificateId);
  return {};
}

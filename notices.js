// ---------- find the nodes ----------
var wall = document.querySelector("#wall");
var upBtn = document.querySelector("#up");
var downBtn = document.querySelector("#down");
var leftBtn = document.querySelector("#left");
var rightBtn = document.querySelector("#right");
var moveBtn = document.querySelector("#move");
var spot = document.querySelector("#spot");
var statusLine = document.querySelector("#status");
var fireAt = document.querySelector("#fire-at");

// a missing node stops the script before any listener is stored on null
if (wall === null || upBtn === null || downBtn === null ||
    leftBtn === null || rightBtn === null || moveBtn === null) {
  throw new Error("A needed node is missing");
}

// ---------- helpers ----------
function getCurrent() {
  return wall.querySelector(".now");
}

function getRows() {
  return wall.querySelectorAll(".row");
}

// where is Fire? (counts the top row first)
function updateFire() {
  var notices = wall.querySelectorAll(".notice");
  for (var i = 0; i < notices.length; i++) {
    var word = notices[i].querySelector("span").textContent;
    if (word === "Fire") {
      fireAt.textContent = i + 1;
    }
  }
}

// swap two notices that are in different rows
function swap(a, b) {
  var aNext = a.nextElementSibling;
  var aRow = a.parentElement;
  b.parentElement.insertBefore(a, b);
  aRow.insertBefore(b, aNext);
}

// the screen sentence changes, the sentence in the file does not
function afterMove(cur) {
  var word = cur.querySelector("span").textContent;
  statusLine.textContent = word + " was moved.";
  updateFire();
}

// ---------- click on a notice ----------
function pickNotice(event) {
  var notice = event.target.closest(".notice");
  if (notice === null) {
    return;
  }
  var all = wall.querySelectorAll(".notice");
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove("now");
  }
  notice.classList.add("now");
}

// ---------- four directions ----------
function goLeft() {
  var cur = getCurrent();
  if (cur === null) { return; }
  var before = cur.previousElementSibling;
  if (before === null) { return; }
  cur.parentElement.insertBefore(cur, before);
  afterMove(cur);
}

function goRight() {
  var cur = getCurrent();
  if (cur === null) { return; }
  var after = cur.nextElementSibling;
  if (after === null) { return; }
  cur.parentElement.insertBefore(after, cur);
  afterMove(cur);
}

function goUp() {
  var cur = getCurrent();
  if (cur === null) { return; }
  var rows = getRows();
  var row = cur.parentElement;
  if (row === rows[0]) { return; }
  var place = Array.prototype.indexOf.call(row.children, cur);
  var other = rows[0].children[place];
  swap(cur, other);
  afterMove(cur);
}

function goDown() {
  var cur = getCurrent();
  if (cur === null) { return; }
  var rows = getRows();
  var row = cur.parentElement;
  if (row === rows[1]) { return; }
  var place = Array.prototype.indexOf.call(row.children, cur);
  var other = rows[1].children[place];
  swap(cur, other);
  afterMove(cur);
}

// ---------- a position, and a word ----------
function moveToSpot() {
  var number = Number(spot.value);

  // a word (or an empty box) is not a number
  if (spot.value.trim() === "" || isNaN(number)) {
    spot.setCustomValidity("not a number");
    spot.reportValidity();
    return;
  }

  // a good number clears the message
  spot.setCustomValidity("");

  var cur = getCurrent();
  if (cur === null) { return; }
  if (number < 1 || number > 6) { return; }

  // collect the other five notices in order
  var all = wall.querySelectorAll(".notice");
  var others = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i] !== cur) {
      others.push(all[i]);
    }
  }

  // put the current notice in its new place
  others.splice(number - 1, 0, cur);

  // first three go on top, last three on the bottom
  var rows = getRows();
  for (var j = 0; j < 6; j++) {
    if (j < 3) {
      rows[0].appendChild(others[j]);
    } else {
      rows[1].appendChild(others[j]);
    }
  }
  afterMove(cur);
}

// ---------- listeners (the functions are NOT called here) ----------
wall.addEventListener("click", pickNotice);
upBtn.addEventListener("click", goUp);
downBtn.addEventListener("click", goDown);
leftBtn.addEventListener("click", goLeft);
rightBtn.addEventListener("click", goRight);
moveBtn.addEventListener("click", moveToSpot);
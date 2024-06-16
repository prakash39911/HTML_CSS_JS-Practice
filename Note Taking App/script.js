//You are working on a note-taking app, and you want to implement a function named saveNoteToLocalStorage that takes a note object and saves it to the browser's local storage.

const btn = document.querySelector("#button");
const notearea = document.querySelector(".main");
const input = document.querySelector("#input");

// All the notes object will be stored in this array.
let arr = [];

// this function takes arr containing notes object as an argument, and displays it.
const displayNotes = function (arr) {
  notearea.innerHTML = "";
  if (arr.length > 0) {
    arr.map((obj) => {
      const html = `<div class = 'notes'>
        <div class = "notetext">
          <div class = "dot"></div>
          <div>${obj.note}</div>
        </div>

        <div class = "editdelete">
          <button class="edit" ><img id = "editImg" data-keye = "${obj.id}" src="./assets/editIcon.svg" alt="" /></button>
          <button class="delete" ><img id = "deleteImg" data-keyd = "${obj.id}" src="./assets/deleteIcon.svg" alt="" /></button>
        </div>
    </div>`;
      notearea.insertAdjacentHTML("afterbegin", html);
    });
  }
};

// Generating Unique ID for individual Notes Object
const generateUniqueId = function () {
  const string1 = Date.now().toString(36);
  const string2 = Math.random().toString(36).substring(2, 9);
  return string1 + string2;
};

// Generate unique Objects with unique ID and a particular Note

const uniqueObject = function (note) {
  let obj = {
    id: "",
    note: "",
    editID: "",
  };
  obj.id = generateUniqueId();
  obj.note = note;
  return obj;
};

// Store final objects array into Local Storage

const storeNote = function (e) {
  e.preventDefault();
  this.blur(); // Remove foucus from a button after it is clicked.

  if (JSON.parse(localStorage.getItem("item"))) {
    let retrievedArr = JSON.parse(localStorage.getItem("item"));
    if (input.value) {
      let newObject = uniqueObject(input.value);
      retrievedArr.push(newObject);
      localStorage.setItem("item", JSON.stringify(retrievedArr));
      displayNotes(retrievedArr);
      input.value = "";
    }
  } else {
    if (input.value) {
      let objCreated = uniqueObject(input.value);
      arr.push(objCreated);
      localStorage.setItem("item", JSON.stringify(arr));
      displayNotes(arr);
      input.value = "";
    }
  }
};

const clearStorage = function (e) {
  e.preventDefault();
  localStorage.removeItem("item");
  arr = [];
  notearea.innerHTML = "";
};

const getDatafromLocalStorage = function (e) {
  let value = JSON.parse(localStorage.getItem("item"));
  if (value) {
    displayNotes(value);
  }
  return;
};

const deleteNote = function (e) {
  console.log(e.target);
  let idToBeDeleted = e.target.dataset.keyd;
  arr = JSON.parse(localStorage.getItem("item"));
  arr.map((obj, i) => {
    if (obj.id == idToBeDeleted) {
      arr.splice(i, 1);
      if (arr.length > 0) {
        localStorage.setItem("item", JSON.stringify(arr));
        displayNotes(arr);
      } else {
        clearStorage(e);
      }
    }
    return;
  });
};

const UpdateNote = function (e) {
  e.preventDefault();
  arr = JSON.parse(localStorage.getItem("item"));
  arr.map((obj) => {
    if (obj.editID !== "") {
      obj.note = input.value;
      obj.editID = "";
      localStorage.setItem("item", JSON.stringify(arr));
      input.value = "";
      btn.innerHTML = "Add";
      displayNotes(arr);
    }
    return;
  });
};

const editNote = function (e) {
  let idToBeEdited = e.target.dataset.keye;
  arr = JSON.parse(localStorage.getItem("item"));
  arr.map((obj) => {
    if (obj.id == idToBeEdited) {
      btn.innerHTML = "Update";
      input.value = obj.note;
      obj.editID = idToBeEdited;
      localStorage.setItem("item", JSON.stringify(arr));
      input.focus();
      return;
    }
  });
};

document.getElementById("clearbutton").addEventListener("click", clearStorage);
window.addEventListener("load", getDatafromLocalStorage);
btn.addEventListener("click", function (e) {
  if (btn.innerHTML === "Update") {
    UpdateNote(e);
  } else {
    storeNote(e);
  }
});
notearea.addEventListener("click", function (e) {
  if (e.target.id === "deleteImg") {
    deleteNote(e);
  } else {
    editNote(e);
  }
});

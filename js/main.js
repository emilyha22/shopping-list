// Register a service worker, this one located in serviceworker.js
// A service worker is a piece of code the browser runs behind the scenes.
if ('serviceWorker' in navigator) {
  console.log('CLIENT: service worker registration in progress.');
  navigator.serviceWorker.register('sw.js').then(function() {
    console.log('CLIENT: service worker registration complete.');
  }, function() {
    console.log('CLIENT: service worker registration failure.');
  });
} else {
  console.log('CLIENT: service workers are not supported.');
}



let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});


let outputHeader = document.querySelector("#listOutput");
let inputName = document.querySelector("#name");
let inputNotes = document.querySelector("#notes");
let addButton = document.querySelector("#addButton");
let list = document.querySelector("#shoppingList");
const draggables = document.querySelectorAll('.draggable');
var checkbox = document.querySelector("#check");




// display data/items
function displayItems(doc){

var checkbox = document.createElement('input');
let li = document.createElement('li');
let name = document.createElement('p');
let notes = document.createElement('p');
let trash = document.createElement('div');
let flex1 = document.createElement('div');
let flex2 = document.createElement('div');
let flex3 = document.createElement('div');
let flex4 = document.createElement('div');
let btnEdit = document.createElement('button');
let newUpdate = document.createElement('button');

checkbox.setAttribute("id", "check");
checkbox.setAttribute('type','checkbox');
li.setAttribute('data-id', doc.id);

notes.classList.add("notes");
name.classList.add("name");
trash.classList.add("trash");
li.classList.add("draggable");
btnEdit.classList.add('btn-edit')
newUpdate.classList.add('btn-update')

name.textContent = doc.data().item;
notes.textContent = doc.data().notes;
trash.textContent = 'x';
btnEdit.textContent = 'edit';
newUpdate.textContent="update";

newUpdate.style.display = "none";

flex1.appendChild(checkbox);
flex2.appendChild(name);
flex2.appendChild(notes);
flex3.appendChild(trash);
flex4.appendChild(flex1);
flex4.appendChild(flex2);
li.appendChild(flex4);
li.appendChild(btnEdit);
li.appendChild(newUpdate);
li.appendChild(trash);
flex4.classList.add("flex4");
flex2.classList.add("flex2");

shoppingList.appendChild(li);

//trash to do
trash.addEventListener('click', (e) => {
  e.stopPropagation();
  let idNum = e.target.parentElement.getAttribute('data-id');
  db.collection('shoppingList').doc(idNum).delete();
})

// edit
btnEdit.addEventListener('click', (e) =>{
  e.stopPropagation();

  btnEdit.style.display ="none";
  newUpdate.style.display = "block";
  name.style.border = "solid #047bfe 1px";
  name.style.borderRadius = "5px";
  notes.style.border = "solid #047bfe 1px";
  notes.style.borderRadius = "5px";
  let idNum = e.target.parentElement.getAttribute('data-id');
  name.setAttribute("contenteditable", "true");
  notes.setAttribute("contenteditable", "true");
  newUpdate.addEventListener('click', (e) =>{
    newUpdate.style.color = "#00733f";
    newUpdate.textContent = "updated!";
    name.style.border = "solid #00733f 1px";
    notes.style.border = "solid #00733f 1px";
    db.collection('shoppingList').doc(idNum).update({
      item: name.innerHTML,
      notes:notes.innerHTML
  }).then(() => {
    name.style.border = "none";
    notes.style.border = "none";
  }).catch((error) => {
    console.error("error updating doc", error);
  });
})
})

}

//get data in real time
db.collection("shoppingList").orderBy("timestamp", "asc").onSnapshot(snapshot => {
let changes = snapshot.docChanges();
changes.forEach(change => {
  if (change.type == 'added'){
    displayItems(change.doc);
    console.log("added change");
  }
  else if (change.type == 'modified'){
    let id = list.querySelector('[data-id=' + change.doc.id + ']');
    console.log(id);
    if (id) {
      // get class with item name/note innerhtml
      let name = id.querySelector(".name").innerHTML;
      let notes = id.querySelector(".notes").innerHTML;
      console.log(name);
      console.log(notes);
      // replace inner html with new item
      id.querySelector(".name").innerHTML = change.doc.data().item;
      id.querySelector(".notes").innerHTML = change.doc.data().notes;
  }
}
  else if (change.type == 'removed'){
    let removeLi = list.querySelector('[data-id=' + change.doc.id + ']');
    list.removeChild(removeLi);
  }
})
})



addButton.addEventListener("click", (e) =>{
  const nameToFirestore = inputName.value;
  const noteToFirestore = inputNotes.value;
  db.collection("shoppingList").add({
      item: nameToFirestore,
      notes: noteToFirestore,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(){
      inputName.value = "";
      inputNotes.value = "";
  }).catch(function(){
      console.log("got an error: ", error);
  });
})


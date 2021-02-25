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

let outputHeader = document.querySelector("#listOutput");
let inputName = document.querySelector("#name");
let inputNotes = document.querySelector("#notes");
let addButton = document.querySelector("#addButton");
let list = document.querySelector("#shoppingList");

// display data/items
function displayItems(doc){
let checkbox = document.createElement('input');
let li = document.createElement('li');
let name = document.createElement('p');
let notes = document.createElement('p');
let trash = document.createElement('div');
let flex1 = document.createElement('div');
let flex2 = document.createElement('div');
let flex3 = document.createElement('div');
let flex4 = document.createElement('div');

checkbox.setAttribute('type','checkbox');
notes.classList.add("notes");
name.classList.add("name");
trash.classList.add("trash");
li.classList.add("draggable");

li.setAttribute('data-id', doc.id);
name.textContent = doc.data().item;
notes.textContent = doc.data().notes;
trash.textContent = 'x';
flex1.appendChild(checkbox);
flex2.appendChild(name);
flex2.appendChild(notes);
flex3.appendChild(trash);
flex4.appendChild(flex1);
flex4.appendChild(flex2);
li.appendChild(flex4)
li.appendChild(trash);
flex4.classList.add("flex4");
flex2.classList.add("flex2");

/*li.appendChild(checkbox);
li.appendChild(name);
li.appendChild(notes);
li.appendChild(trash);
*/
shoppingList.appendChild(li);

//trash to do
trash.addEventListener('click', (e) => {
  e.stopPropagation();
  let idNum = e.target.parentElement.getAttribute('data-id');
  db.collection('shoppingList').doc(idNum).delete();
})
}

//get data in real time
db.collection("shoppingList").orderBy("timestamp", "asc").onSnapshot(snapshot => {
let changes = snapshot.docChanges();
changes.forEach(change => {
  if (change.type == 'added'){
    displayItems(change.doc);
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
  console.log("I am going to add " + nameToFirestore + " and " + noteToFirestore + " to Firestore");
  db.collection("shoppingList").add({
      item: nameToFirestore,
      notes: noteToFirestore,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(){
      inputName.value = "";
      inputNotes.value = "";
      console.log("status saved!");
  }).catch(function(){
      console.log("got an error: ", error);
  });
})
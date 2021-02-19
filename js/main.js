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
  let li = document.createElement('li');
  let name = document.createElement('p');
  let notes = document.createElement('p');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().item;
  notes.textContent = doc.data().notes;
  li.appendChild(name);
  li.appendChild(notes);

  shoppingList.appendChild(li);
}

//get data in real time
db.collection('shoppingList').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == 'added'){
      displayItems(change.doc)
    }
  })
})

addButton.addEventListener("click", function(){
    const nameToFirestore = inputName.value;
    const noteToFirestore = inputNotes.value;
    console.log("I am going to add " + nameToFirestore + " and " + noteToFirestore + " to Firestore");
    db.collection("shoppingList").add({
        item: nameToFirestore,
        notes: noteToFirestore 
    }).then(function(){
        inputName.value = "";
        inputNotes.value = "";
        console.log("status saved!");
    }).catch(function(){
        console.log("got an error: ", error);
    });
})



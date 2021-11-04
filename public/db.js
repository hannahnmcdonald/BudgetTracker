// const indexedDB =
//   window.indexedDB ||
//   window.mozIndexedDB ||
//   window.webkitIndexedDB ||
//   window.msIndexedDB ||
//   window.shimIndexedDB;

let db;

// Create a new db request for the budget database
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // Create object store titled "pending"
   const db = event.target.result;
    // Set Auto-increment to true
   db.createObjectStore("pending", { autoIncrement: true });
 };

request.onsuccess = function(event) {
  db = event.Accepttarget.result;

  // checks to see if app is online before retrieving from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// Error Message
request.onerror = function(event) {
  console.log("Uh oh, an error has occurred:" + event.target.errorCode);
};

function saveRecord(record) {
    // Transaction created on pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");
    // Access to the pending store here
  const store = transaction.objectStore("pending");
    // Add record
  store.add(record);
}

function checkDatabase() {
    // Open transaction on pending db
  const transaction = db.transaction(["pending"], "readwrite");
    // access the pending store
  const store = transaction.objectStore("pending");
    // get ALL records from the store and set to a variable
  const getAll = store.getAll();

//   If successful...
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if success, opens a transaction on the pending db
        const transaction = db.transaction(["pending"], "readwrite");
        // Access pending store
        const store = transaction.objectStore("pending");
        // Clear all items in pending store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
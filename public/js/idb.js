//establish indexedb connection
let db;
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
    //save to database
    const db = event.target.result;
    //create new object store
    db.createObjectStore("budget_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        console.log("we're online again!");
        uploadBudget();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["budget_transaction"], "readwrite");
    console.log("saving");
    const budgetObjectStore = transaction.objectStore("budget_transaction");

    budgetObjectStore.add(record);
}

function uploadBudget() {
    const transaction = db.transaction(["budget_transaction"], "readwrite");
    const budgetObjectStore = transaction.objectStore("budget_transaction");
    const getAll = budgetObjectStore.getAll();
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((serverResponse) => {
                    if (serverResponse.message) {
                        throw new Error() * serverResponse;
                    }
                    const transaction = db.transaction(
                        ["budget_transaction"],
                        "readwrite"
                    );
                    const budgetObjectStore =
                        transaction.objectStore("budget_transaction");
                    budgetObjectStore.clear();
                    alert("saved transactions have been submitted");
                })
                .catch((err) => {
                    console.log.err;
                });
        }
    };
}

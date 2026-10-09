/* =================================
   SHOP SMART - JAVASCRIPT
================================= */


/* =================================
   1. APP DATA
================================= */

let items = [];
let references = [];
let savedLists = [];

let budget = 0;
let editingItemId = null;
let editingSavedListId = null;



/* =================================
   2. GET HTML ELEMENTS
================================= */

const budgetInput = document.getElementById("budgetInput");
const budgetDisplay = document.getElementById("budgetDisplay");

const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const qtyInput = document.getElementById("qtyInput");
const addItemButton = document.getElementById("addItemButton");

const groceryItems = document.getElementById("groceryItems");
const itemCount = document.getElementById("itemCount");
const totalDisplay = document.getElementById("totalDisplay");
const budgetStatus = document.getElementById("budgetStatus");

const clearListButton = document.getElementById("clearListButton");
const saveListButton = document.getElementById("saveListButton");

const referenceNameInput =
    document.getElementById("referenceNameInput");

const referencePriceInput =
    document.getElementById("referencePriceInput");

const referenceShopInput =
    document.getElementById("referenceShopInput");

const addReferenceButton =
    document.getElementById("addReferenceButton");

const referenceSearch =
    document.getElementById("referenceSearch");

const referenceCount =
    document.getElementById("referenceCount");

const referenceItems =
    document.getElementById("referenceItems");

const listNameInput =
    document.getElementById("listNameInput");

const saveNamedListButton =
    document.getElementById("saveNamedListButton");

const savedListCount =
    document.getElementById("savedListSummary");

const savedListsContainer =
    document.getElementById("savedLists");

const savedListsSummary =
    document.getElementById("savedListsSummary");

const groceryEditingStatus =
    document.getElementById("groceryEditingStatus");

const editingListStatus =
    document.getElementById("editingListStatus");

const cancelEditListButton =
    document.getElementById("cancelEditListButton");

const sortItems=
    document.getElementById("sortItems");

const categoryFilter = 
    document.getElementById("categoryFilter");

const grocerysearch = 
    document.getElementById("grocerySearch");


/* =================================
   3. MONEY FORMAT
================================= */

function formatMoney(amount) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2
    }).format(amount);

}


/* =================================
   4. NAVIGATION
================================= */

const navigationButtons =
    document.querySelectorAll(".nav button");

const screens =
    document.querySelectorAll(".screen");


navigationButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetScreen =
            button.dataset.screen;

        navigationButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        screens.forEach(screen => {
            screen.classList.remove("active");
        });

        const target =
            document.getElementById(targetScreen);

        if (target) {
            target.classList.add("active");
        }

    });

});


/* =================================
   5. BUDGET
================================= */

budgetInput.addEventListener("input", () => {

    budget =
        Number(budgetInput.value) || 0;
        saveAppData();

    updateBudgetDisplay();
    updateTotal();

});


function updateBudgetDisplay() {

    if (budget > 0) {

        budgetDisplay.textContent =
            `Budget: ${formatMoney(budget)}`;

    } else {

        budgetDisplay.textContent =
            "Not set";

    }

}


/* =================================
   6. ADD / UPDATE ITEM
================================= */

addItemButton.addEventListener(
    "click",
    handleItemSubmit
);

function handleItemSubmit() {

    const name =
        itemInput.value.trim();

    const price =
        Number(priceInput.value);

    const quantity =
        Number(qtyInput.value);

    const category =
        document.getElementById("categoryInput").value;


    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (!name) {
        alert("Please enter a grocery item.");
        itemInput.focus();
        return;
    }

    if (
        priceInput.value === "" ||
        isNaN(price) ||
        price < 0
    ) {
        alert("Please enter a valid price.");
        priceInput.focus();
        return;
    }

    if (
        qtyInput.value === "" ||
        isNaN(quantity) ||
        quantity < 1
    ) {
        alert("Quantity must be at least 1.");
        qtyInput.focus();
        return;
    }


    /* -----------------------------
       UPDATE EXISTING ITEM
    ----------------------------- */

    if (editingItemId !== null) {

        const item =
            items.find(
                item => item.id === editingItemId
            );

        if (item) {
            item.name = name;
            item.price = price;
            item.quantity = quantity;
            item.category = category;
        }

        editingItemId = null;

        addItemButton.textContent =
            "+ Add to Grocery List";

        clearItemInputs();

        saveAppData();
        renderItems();
        updateTotal();
        updateShoppingProgress();

        return;
    }


    /* -----------------------------
       ADD NEW ITEM
    ----------------------------- */

    const newItem = {

        id: Date.now(),
        name: name,
        price: price,
        quantity: quantity,
        category: category,
        bought: false

    };

    items.push(newItem);

    saveAppData();

    clearItemInputs();

    renderItems();
    updateTotal();
    updateShoppingProgress();

}


/* =================================
   7. CLEAR ITEM INPUTS
================================= */

function clearItemInputs() {

    itemInput.value = "";

    priceInput.value = "";

    qtyInput.value = "1";

document.getElementById("categoryInput").value = "Food";

}


/* =================================
   8. DISPLAY GROCERY ITEMS
================================= */

function renderItems() {

    groceryItems.innerHTML = "";


    if (items.length === 0) {

        groceryItems.innerHTML = `
            <div class="empty">
                Your grocery list is empty.
                <br>
                Add your first item above.
            </div>
        `;

        itemCount.textContent =
            "0 items";

        return;
    }


    const selectedCategory =
    categoryFilter ? categoryFilter.value : "all";

const searchTerm =
    grocerySearch
        ? grocerySearch.value.trim().toLowerCase()
        : "";

const filteredItems = items.filter(item => {

    const matchesCategory =
        selectedCategory === "all" ||
        (item.category || "Other") === selectedCategory;

    const matchesSearch =
        item.name.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;

});

const sortedItems = [...filteredItems];

if (sortItems) {

    if (sortItems.value === "name") {
        sortedItems.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    else if (sortItems.value === "priceLow") {
        sortedItems.sort((a, b) =>
            Number(a.price) - Number(b.price)
        );
    }

    else if (sortItems.value === "priceHigh") {
        sortedItems.sort((a, b) =>
            Number(b.price) - Number(a.price)
        );
    }
}

sortedItems.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        const itemElement =
            document.createElement("div");


        itemElement.className =
            `grocery-item ${
                item.bought ? "completed" : ""
            }`;


        itemElement.innerHTML = `

            <input
                type="checkbox"
                class="item-check"
                ${item.bought ? "checked" : ""}
            >

            <div class="item-info">

                <p class="item-name">
                    ${escapeHTML(item.name)}
                </p>

                <div class="item-details">
                    ${escapeHTML(item.category||"Other")} •
                    ${formatMoney(item.price)}
                    × ${item.quantity}
                </div>

            </div>

            <div class="item-total">
                ${formatMoney(itemTotal)}
            </div>

            <div class="item-actions">

                <button
                    class="icon-btn edit-btn"
                    title="Edit">
                    ✏️
                </button>

                <button
                    class="icon-btn delete-btn"
                    title="Delete">
                    🗑️
                </button>

            </div>
        `;


        /* CHECKBOX */

        const checkbox =
            itemElement.querySelector(".item-check");


        checkbox.addEventListener("change", () => {

            toggleBought(item.id);

        });


        /* EDIT BUTTON */

        const editButton =
            itemElement.querySelector(".edit-btn");


        editButton.addEventListener("click", () => {

            editItem(item.id);

        });


        /* DELETE BUTTON */

        const deleteButton =
            itemElement.querySelector(".delete-btn");


        deleteButton.addEventListener("click", () => {

            deleteItem(item.id);

        });


        groceryItems.appendChild(itemElement);

    });


    itemCount.textContent =
        `${items.length} ${
            items.length === 1 ? "item" : "items"
        }`;

}

/* =================================
   8B. GROCERY SORT AND FILTER EVENT
================================= */

sortItems.addEventListener("change", () => {
    renderItems();
});

categoryFilter.addEventListener("change", () => {
    renderItems();
});

grocerySearch.addEventListener("input", () => {
    renderItems();
});

/* =================================
   8A. UPDATE SHOPPING PROGRESS
================================= */

function updateShoppingProgress() {

    const totalItems = items.reduce(
        (sum, item) =>
            sum + Number(item.quantity || 0),
        0
    );

    const boughtItems = items.reduce(
        (sum, item) =>
            sum + (
                item.bought
                    ? Number(item.quantity || 0)
                    : 0
            ),
        0
    );

    const percentage =
        totalItems === 0
            ? 0
            : Math.round(
                (boughtItems / totalItems) * 100
            );

    document.getElementById(
        "progressPercentage"
    ).textContent = `${percentage}%`;

    document.getElementById(
        "progressFill"
    ).style.width = `${percentage}%`;

    let message =
        `${boughtItems} of ${totalItems} items bought`;

    if (totalItems > 0 && percentage === 100) {
        message = "🎉 Shopping complete! You've bought everything.";
    }

    document.getElementById(
        "progressMessage"
    ).textContent = message;
}


/* =================================
   9. ESCAPE HTML
================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}
/* =================================
   9A. LOCAL STORAGE
================================= */

function saveAppData() {

    localStorage.setItem(
        "shopSmartItems",
        JSON.stringify(items)
    );

    localStorage.setItem(
        "shopSmartReferences",
        JSON.stringify(references)
    );

    localStorage.setItem(
        "shopSmartSavedLists",
        JSON.stringify(savedLists)
    );

    localStorage.setItem(
        "shopSmartBudget",
        JSON.stringify(budget)
    );

}


function loadAppData() {

    const storedItems =
        localStorage.getItem("shopSmartItems");

    const storedReferences =
        localStorage.getItem("shopSmartReferences");

    const storedSavedLists =
        localStorage.getItem("shopSmartSavedLists");

    const storedBudget =
        localStorage.getItem("shopSmartBudget");


    if (storedItems) {

        items =
            JSON.parse(storedItems);

    }


    if (storedReferences) {

        references =
            JSON.parse(storedReferences);

    }


    if (storedSavedLists) {

        savedLists =
            JSON.parse(storedSavedLists);

    }


    if (storedBudget) {

        budget =
            JSON.parse(storedBudget);

        budgetInput.value =
            budget || "";

    }

}


/* =================================
   10. CALCULATE TOTAL
================================= */

function updateTotal() {

    const total =
        items.reduce((sum, item) => {

            if (item.bought) {
                return sum;
            }

            return sum +
                (Number(item.price) *
                 Number(item.quantity));

        }, 0);

    totalDisplay.textContent =
        formatMoney(total);

    updateBudgetStatus(total);
}


/* =================================
   11. BUDGET STATUS
================================= */

function updateBudgetStatus(total) {

    if (budget <= 0) {

        budgetStatus.textContent =
            "💰 Set a budget to track your spending.";

        budgetStatus.className =
            "budget-status";

        return;
    }

    const difference = budget - total;

    if (difference > 0) {

        budgetStatus.textContent =
            `✅ You have ${formatMoney(difference)} left in your budget.`;

        budgetStatus.className =
            "budget-status good";

    } else if (difference === 0) {

        budgetStatus.textContent =
            "🎯 Your remaining shopping cost matches your budget.";

        budgetStatus.className =
            "budget-status good";

    } else {

        budgetStatus.textContent =
            `⚠️ You are over budget by ${formatMoney(Math.abs(difference))}.`;

        budgetStatus.className =
            "budget-status over";
    }
}
/* =================================
   12. DELETE ITEM
================================= */

function deleteItem(id) {

    const item =
        items.find(item => item.id === id);


    if (!item) return;


    const confirmed =
        confirm(
            `Remove "${item.name}" from your grocery list?`
        );


    if (!confirmed) return;


    items =
        items.filter(item => item.id !== id);
        saveAppData();


    renderItems();

    updateTotal();

}


/* =================================
   13. MARK ITEM AS BOUGHT
================================= */

function toggleBought(id) {

    const item =
        items.find(item => item.id === id);


    if (!item) return;


    item.bought =
        !item.bought;
        saveAppData();


    renderItems();
    updateShoppingProgress();
    updateTotal();
}

/* =================================
   14. EDIT ITEM
================================= */

function editItem(id) {

    const item =
        items.find(item => item.id === id);


    if (!item) return;


    itemInput.value =
        item.name;

    priceInput.value =
        item.price;

    qtyInput.value =
        item.quantity;


    editingItemId =
        id;


    addItemButton.textContent =
        "Update Item";


    itemInput.focus();

}


/* =================================
   15. CANCEL EDIT
================================= */

function cancelEdit() {

    editingItemId =
        null;


    clearItemInputs();


    addItemButton.textContent =
        "+ Add to Grocery List";

}


/* =================================
   16. CLEAR ENTIRE LIST
================================= */

clearListButton.addEventListener("click", () => {

    if (items.length === 0) {

        alert("Your grocery list is already empty.");

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to clear your grocery list?"
        );


    if (!confirmed) return;


    items = [];
    saveAppData();


    cancelEdit();

    renderItems();

    updateTotal();

});


/* =================================
   17. REFERENCE PRICES
================================= */

addReferenceButton.addEventListener(
    "click",
    addReference
);


function addReference() {

    const name =
        referenceNameInput.value.trim();

    const price =
        Number(referencePriceInput.value);

    const shop =
        referenceShopInput.value.trim();


    if (!name) {

        alert("Please enter a product name.");

        return;
    }


    if (
        referencePriceInput.value === "" ||
        isNaN(price) ||
        price < 0
    ) {

        alert("Please enter a valid price.");

        return;
    }


    const reference = {

        id: Date.now(),

        name: name,

        price: price,

        shop: shop

    };


    references.push(reference);
    saveAppData();


    referenceNameInput.value = "";

    referencePriceInput.value = "";

    referenceShopInput.value = "";


    renderReferences();

}


/* =================================
   18. DISPLAY REFERENCE PRICES
================================= */

function renderReferences() {

    const searchTerm =
        referenceSearch.value
            .trim()
            .toLowerCase();


    const filtered =
        references.filter(reference => {

            return (
                reference.name
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                reference.shop
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    referenceItems.innerHTML = "";


    if (filtered.length === 0) {

        referenceItems.innerHTML = `
            <div class="empty">
                ${
                    references.length === 0
                    ? "No reference prices yet."
                    : "No matching reference prices found."
                }
            </div>
        `;

        referenceCount.textContent =
            "0";

        return;
    }


    filtered.forEach(reference => {

        const element =
            document.createElement("div");


        element.className =
            "reference-item";


        element.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(reference.name)}
                </strong>

                ${
                    reference.shop
                    ? `<small>${escapeHTML(
                        reference.shop
                    )}</small>`
                    : ""
                }

            </div>

            <div class="reference-price">

                ${formatMoney(reference.price)}

                <button
                    class="icon-btn delete-reference"
                    title="Delete">
                    🗑️
                </button>

            </div>

        `;


        const deleteButton =
            element.querySelector(
                ".delete-reference"
            );


        deleteButton.addEventListener(
            "click",
            () => deleteReference(reference.id)
        );


        referenceItems.appendChild(element);

    });


    referenceCount.textContent =
        filtered.length;

}


/* =================================
   19. DELETE REFERENCE
================================= */

function deleteReference(id) {

    references =
        references.filter(
            reference => reference.id !== id
        );
        saveAppData();


    renderReferences();

}


/* =================================
   20. SEARCH REFERENCE PRICES
================================= */

referenceSearch.addEventListener(
    "input",
    renderReferences
);


/* =================================
   21. SAVE CURRENT LIST
================================= */

saveListButton.addEventListener(
    "click",
    saveCurrentList
);


saveNamedListButton.addEventListener(
    "click",
    saveCurrentList
);


function saveCurrentList() {

    /* -----------------------------
       CHECK THAT LIST HAS ITEMS
    ----------------------------- */

    if (items.length === 0) {

        alert(
            "Please add at least one item before saving your list."
        );

        return;
    }


    /* -----------------------------
       GET LIST NAME
    ----------------------------- */

    let name =
        listNameInput.value.trim();


    /*
       If we are editing an existing
       saved list and the name box is
       empty, keep the original name.
    */

    if (
        !name &&
        editingSavedListId !== null
    ) {

        const existingList =
            savedLists.find(
                list =>
                    list.id === editingSavedListId
            );


        if (existingList) {

            name =
                existingList.name;

        }

    }


    /*
       If this is a completely new list
       and no name was entered, create
       a default name.
    */

    if (!name) {

        name =
            `Shopping List ${
                savedLists.length + 1
            }`;

    }


    /* -----------------------------
       UPDATE EXISTING SAVED LIST
    ----------------------------- */

    if (editingSavedListId !== null) {
        const confirmUpdate = confirm(
            `Are you sure you want to update "${name}"?`
        );

        if (!confirmUpdate) {
            return;
        }

        const existingList =
            savedLists.find(
                list =>
                    list.id === editingSavedListId
            );


        if (existingList) {

            existingList.name =
                name;

            existingList.budget =
                budget;

            existingList.items =
                JSON.parse(
                    JSON.stringify(items)
                );

            existingList.updatedAt =
                new Date().toLocaleDateString(
                    "en-NG",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );


            saveAppData();

            renderSavedLists();


            alert(
                `"${name}" has been updated successfully.`
            );


            editingSavedListId =
                null;

            listNameInput.value = "";
            updateEditingListStatus();


            return;
        }

    }


    /* -----------------------------
       CREATE NEW SAVED LIST
    ----------------------------- */

    const savedList = {

        id: Date.now(),

        name: name,

        budget: budget,

        items:
            JSON.parse(
                JSON.stringify(items)
            ),

        date:
            new Date().toLocaleDateString(
                "en-NG",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            )

    };


    savedLists.push(savedList);


    saveAppData();


    listNameInput.value = "";


    renderSavedLists();


    alert(
        `"${name}" has been saved successfully.`
    );

    editingSavedListId = null;
    updateEditingListStatus();

}

/* =================================
   21A. EDITING LIST STATUS
================================= */

function updateEditingListStatus() {

    if (editingSavedListId === null) {

        editingListStatus.textContent =
            "";

        editingListStatus.style.display =
            "none";

        groceryEditingStatus.textContent =
            "";

        groceryEditingStatus.style.display =
            "none";

        cancelEditListButton.style.display =
            "none";

        saveNamedListButton.textContent =
            "Save current List";

        return;
    }

    const list =
        savedLists.find(
            list =>
                list.id === editingSavedListId
        );

    if (!list) {

        editingSavedListId =
            null;

        editingListStatus.textContent =
            "";

        editingListStatus.style.display =
            "none";

        groceryEditingStatus.textContent =
            "";

        groceryEditingStatus.style.display =
            "none";

        cancelEditListButton.style.display =
            "none";

        return;
    }

    const message =
        `✏️ Editing saved list: ${list.name}`;

    editingListStatus.textContent =
        message;

    editingListStatus.style.display =
        "block";

    groceryEditingStatus.textContent =
        message;

    groceryEditingStatus.style.display =
        "block";

    cancelEditListButton.style.display =
        "inline-block";
}

    saveNamedListButton.textContent =
        "Save Changes";

/* =================================
   21B. CANCEL SAVED LIST EDIT
================================= */

cancelEditListButton.addEventListener(
    "click",
    cancelSavedListEdit
);


function cancelSavedListEdit() {

    editingSavedListId =
        null;


    listNameInput.value =
        "";


    updateEditingListStatus();

}

/* =================================
   22. DISPLAY SAVED LISTS
================================= */

function renderSavedLists() {

    let totalSavedItems = 0;
    let totalSavedValue = 0;


    /* -----------------------------
       CALCULATE SUMMARY
    ----------------------------- */

    savedLists.forEach(list => {

        totalSavedItems += list.items.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );


        totalSavedValue += list.items.reduce(
            (sum, item) =>
                sum +
                (Number(item.price) || 0) *
                (Number(item.quantity) || 0),
            0
        );

    });


    /* -----------------------------
       DISPLAY SUMMARY
    ----------------------------- */

    savedListsSummary.textContent =
        `${savedLists.length} list${savedLists.length === 1 ? "" : "s"} • ` +
        `${totalSavedItems} item${totalSavedItems === 1 ? "" : "s"} • ` +
        `${formatMoney(totalSavedValue)}`;


    savedListsContainer.innerHTML = "";


    /* -----------------------------
       EMPTY LIST
    ----------------------------- */

    if (savedLists.length === 0) {

        savedListsContainer.innerHTML = `
            <div class="empty">
                You haven't saved any
                shopping lists yet.
            </div>
        `;

        return;
    }


    /* -----------------------------
       SORT NEWEST FIRST
    ----------------------------- */

    const sortedLists =
        [...savedLists].sort(
            (a, b) => b.id - a.id
        );


    /* -----------------------------
       DISPLAY EACH LIST
    ----------------------------- */

    sortedLists.forEach(list => {

        const total =
            list.items.reduce(
                (sum, item) =>
                    sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    ),
                0
            );


        const element =
            document.createElement("div");


        element.className =
            "saved-list";


        element.innerHTML = `

            <div class="saved-list-info">

                <h3>
                    ${escapeHTML(list.name)}
                </h3>

                <div class="saved-list-summary">

                    ${list.items.length}
                    item${list.items.length === 1 ? "" : "s"}

                    •

                    ${formatMoney(total)}

                </div>

                <p>

                    ${list.items.length}
                    ${
                        list.items.length === 1
                        ? "item"
                        : "items"
                    }

                    •

                    ${list.updatedAt || list.date}

                </p>

                <strong>
                    ${formatMoney(total)}
                </strong>

            </div>


            <div class="saved-list-actions">

                <button
                    type="button"
                    class="small-button open-list">

                    Open

                </button>


                <button
                    type="button"
                    class="small-button duplicate-list">

                    📋 Duplicate

                </button>


                <button
                    type="button"
                    class="small-button rename-list">

                    ✏️ Rename

                </button>


                <button
                    type="button"
                    class="small-button delete-list">

                    Delete

                </button>

            </div>

        `;


        /* -----------------------------
           OPEN BUTTON
        ----------------------------- */

        element
            .querySelector(".open-list")
            .addEventListener(
                "click",
                () => openSavedList(list.id)
            );


        /* -----------------------------
           DUPLICATE BUTTON
        ----------------------------- */

        element
            .querySelector(".duplicate-list")
            .addEventListener(
                "click",
                () => duplicateSavedList(list.id)
            );


        /* -----------------------------
           RENAME BUTTON
        ----------------------------- */

        element
            .querySelector(".rename-list")
            .addEventListener(
                "click",
                () => showRenameBox(list, element)
            );


        /* -----------------------------
           DELETE BUTTON
        ----------------------------- */

        element
            .querySelector(".delete-list")
            .addEventListener(
                "click",
                () => deleteSavedList(list.id)
            );


        savedListsContainer.appendChild(
            element
        );

    });

}
/* =================================
   23. OPEN SAVED LIST
================================= */

function openSavedList(id) {

    const list =
        savedLists.find(
            list => list.id === id
        );


    if (!list) return;


    /* -----------------------------
       LOAD SAVED ITEMS
    ----------------------------- */

    items =
        JSON.parse(
            JSON.stringify(list.items)
        );


    /* -----------------------------
       LOAD BUDGET
    ----------------------------- */

    budget =
        list.budget || 0;


    budgetInput.value =
        budget || "";


    /* -----------------------------
       REMEMBER WHICH LIST
       WE ARE EDITING
    ----------------------------- */

    editingSavedListId =
        list.id;
        updateEditingListStatus();


    /* -----------------------------
       PUT LIST NAME INTO
       THE NAME FIELD
    ----------------------------- */

    listNameInput.value =
        list.name;


    /* -----------------------------
       SAVE CURRENT STATE
    ----------------------------- */

    saveAppData();


    /* -----------------------------
       UPDATE DISPLAY
    ----------------------------- */

    updateBudgetDisplay();

    renderItems();

    updateTotal();

    updateShoppingProgress();


    /* -----------------------------
       GO TO GROCERY LIST
    ----------------------------- */

    navigationButtons.forEach(button => {

        button.classList.remove("active");

    });


    const listButton =
        document.querySelector(
            '[data-screen="listScreen"]'
        );


    if (listButton) {

        listButton.classList.add("active");

    }


    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    document
        .getElementById("listScreen")
        .classList.add("active");


    alert(
        `"${list.name}" is now open for editing.`
    );

}

/* =================================
   24. DELETE SAVED LIST
================================= */

function deleteSavedList(id) {

    const list =
        savedLists.find(
            list => list.id === id
        );


    if (!list) return;


    const confirmed =
        confirm(
            `Delete the saved list "${list.name}"?`
        );


    if (!confirmed) return;


    savedLists =
        savedLists.filter(
            list => list.id !== id
        );
        saveAppData();


    renderSavedLists();

}

/* =================================
   24A. DUPLICATE SAVED LIST
================================= */

function duplicateSavedList(id) {

    const originalList =
        savedLists.find(
            list => list.id === id
        );

    if (!originalList) return;

    const duplicateList = {
        id: Date.now(),
        name: `${originalList.name} - Copy`,
        budget: originalList.budget,
        items: JSON.parse(
            JSON.stringify(originalList.items)
        ),
        date: new Date().toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ),

        updatedAt: new Date().toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
    };

    savedLists.push(duplicateList);

    saveAppData();

    renderSavedLists();

    alert(
        `"${duplicateList.name}" has been created.`
    );
}

/* =================================
   24B. RENAME SAVED LIST
================================= */

function showRenameBox(list, element) {

    const actions =
        element.querySelector(
            ".saved-list-actions"
        );


    /* -----------------------------
       CREATE INPUT
    ----------------------------- */

    const input =
        document.createElement("input");

    input.type = "text";

    input.value =
        list.name;

    input.className =
        "rename-input";


    /* -----------------------------
       CREATE SAVE BUTTON
    ----------------------------- */

    const saveButton =
        document.createElement("button");

    saveButton.type =
        "button";

    saveButton.className =
        "small-button";

    saveButton.textContent =
        "Save Name";


    /* -----------------------------
       CREATE CANCEL BUTTON
    ----------------------------- */

    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.className =
        "small-button";

    cancelButton.textContent =
        "Cancel";


    /* -----------------------------
       CREATE RENAME BOX
    ----------------------------- */

    const renameBox =
        document.createElement("div");

    renameBox.className =
        "rename-box";


    renameBox.appendChild(input);

    renameBox.appendChild(saveButton);

    renameBox.appendChild(cancelButton);


    /* -----------------------------
       REPLACE ACTION BUTTONS
    ----------------------------- */

    actions.innerHTML = "";

    actions.appendChild(
        renameBox
    );


    input.focus();

    input.select();


    /* -----------------------------
       SAVE NEW NAME
    ----------------------------- */

    saveButton.addEventListener(
        "click",
        () => {

            const newName =
                input.value.trim();


            if (!newName) {

                alert(
                    "Please enter a valid list name."
                );

                input.focus();

                return;
            }


            list.name =
                newName;


            list.updatedAt =
                new Date().toLocaleDateString(
                    "en-NG",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );


            saveAppData();

            renderSavedLists();


            alert(
                `"${newName}" has been renamed successfully.`
            );

        }
    );


    /* -----------------------------
       CANCEL
    ----------------------------- */

    cancelButton.addEventListener(
        "click",
        () => {

            renderSavedLists();

        }
    );

}
/* =================================
   25. INITIAL DISPLAY
================================= */
loadAppData();

renderItems();

updateShoppingProgress();

updateTotal();

updateBudgetDisplay();

renderReferences();

renderSavedLists();
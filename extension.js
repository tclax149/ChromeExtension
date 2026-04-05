
let myLeads = [];


const inputButton = document.getElementById("input-button");
const titleElement = document.getElementById("title-element");
const inputElement = document.getElementById("input-element");
const notesElement = document.getElementById("notes-element");
const unorderedListEl = document.getElementById("unorderedList");
const deleteButton = document.getElementById("delete-button");
const saveTabButton = document.getElementById("save-tab");

const noteModal = document.getElementById("note-modal");
const tabTitleInput = document.getElementById("tab-title-input");
const tabNoteInput = document.getElementById("tab-note-input");
const cancelNoteButton = document.getElementById("cancel-note");
const confirmSaveTabButton = document.getElementById("confirm-save-tab");
let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    renderLeads(myLeads)
}



function renderLeads(leads) {
    let listItems = "";

    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <div class="lead-content">
                    <p class="lead-title">${leads[i].title || "Untitled"}</p>
                    <a target="_blank" href="${leads[i].url}">
                        ${leads[i].url}
                    </a>
                    <p class="lead-note">${leads[i].note || ""}</p>
                </div>
                <button class="delete-item" data-index="${i}">&times;</button>
            </li>
        `;
    }

    unorderedListEl.innerHTML = listItems;

    const deleteButtons = document.querySelectorAll(".delete-item");
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const index = Number(this.dataset.index);
            myLeads.splice(index, 1);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            renderLeads(myLeads);
        });
    });
}


let pendingTabUrl = "";

saveTabButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        pendingTabUrl = tabs[0].url;
        tabTitleInput.value = "";
        tabNoteInput.value = "";
        noteModal.classList.remove("hidden");
        tabTitleInput.focus();
    });
});

deleteButton.addEventListener("dblclick", function () {
    localStorage.clear();
    myLeads = [];
    renderLeads(myLeads);
})


inputButton.addEventListener("click", function () {
    let enteredUrl = inputElement.value.trim();

    if (!enteredUrl) {
        alert("Please enter a URL.");
        return;
    }

    if (
        !enteredUrl.startsWith("http://") &&
        !enteredUrl.startsWith("https://")
    ) {
        enteredUrl = "https://" + enteredUrl;
    }

    const lead = {
        title: titleElement.value.trim(),
        url: enteredUrl,
        note: notesElement.value.trim()
    };

    myLeads.push(lead);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));

    titleElement.value = "";
    inputElement.value = "";
    notesElement.value = "";

    renderLeads(myLeads);
});


cancelNoteButton.addEventListener("click", function () {
    console.log("Cancel clicked");
    pendingTabUrl = "";
    tabTitleInput.value = "";
    tabNoteInput.value = "";
    noteModal.classList.add("hidden");
});

confirmSaveTabButton.addEventListener("click", function () {
    if (!pendingTabUrl) return;

    const lead = {
        title: tabTitleInput.value.trim(),
        url: pendingTabUrl,
        note: tabNoteInput.value.trim()
    };

    myLeads.push(lead);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads(myLeads);

    pendingTabUrl = "";
    tabTitleInput.value = "";
    tabNoteInput.value = "";
    noteModal.classList.add("hidden");
});
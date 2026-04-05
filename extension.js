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

const STORAGE_KEY = "myLeads";

let myLeads = [];
let pendingTabUrl = "";

/* Utilities  */

const readLeadsFromStorage = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

const saveLeadsToStorage = (leads) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

const normalizeUrl = (url) => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) return "";

    const hasProtocol =
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://");

    return hasProtocol ? trimmedUrl : `https://${trimmedUrl}`;
};

const createLead = ({ title = "", url = "", note = "" }) => ({
    title: title.trim(),
    url: normalizeUrl(url),
    note: note.trim(),
});

const clearManualInputs = () => {
    titleElement.value = "";
    inputElement.value = "";
    notesElement.value = "";
};

const clearModalInputs = () => {
    tabTitleInput.value = "";
    tabNoteInput.value = "";
};

const openModal = () => {
    noteModal.classList.remove("hidden");
    tabTitleInput.focus();
};

const closeModal = () => {
    pendingTabUrl = "";
    clearModalInputs();
    noteModal.classList.add("hidden");
};

const updateLeads = (nextLeads) => {
    myLeads = nextLeads;
    saveLeadsToStorage(myLeads);
    renderLeads(myLeads);
};

const addLead = (lead) => updateLeads([...myLeads, lead]);

const removeLeadByIndex = (indexToRemove) =>
    updateLeads(myLeads.filter((_, index) => index !== indexToRemove));

const clearAllLeads = () => updateLeads([]);

/* Chrome Helpers */

const getCurrentTab = async () => {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    return tabs[0];
};

/* Rendering  */

const createLeadMarkup = ({ title, url, note }, index) => `
    <li>
        <div class="lead-content">
            <p class="lead-title">${title || "Untitled"}</p>
            <a target="_blank" href="${url}">
                ${url}
            </a>
            <p class="lead-note">${note || ""}</p>
        </div>
        <button
            class="delete-item"
            data-index="${index}"
            aria-label="Delete saved link ${title || url}"
        >
            &times;
        </button>
    </li>
`;

const bindDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll(".delete-item");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const { index } = button.dataset;
            removeLeadByIndex(Number(index));
        });
    });
};

const renderLeads = (leads) => {
    unorderedListEl.innerHTML = leads
        .map((lead, index) => createLeadMarkup(lead, index))
        .join("");

    bindDeleteButtons();
};

/* Event Logic  */

const handleManualSave = () => {
    const lead = createLead({
        title: titleElement.value,
        url: inputElement.value,
        note: notesElement.value,
    });

    if (!lead.url) {
        alert("Please enter a URL.");
        return;
    }

    addLead(lead);
    clearManualInputs();
};

const handleSaveTabClick = async () => {
    try {
        const currentTab = await getCurrentTab();
        const { url = "" } = currentTab ?? {};

        if (!url) {
            alert("Could not get the current tab URL.");
            return;
        }

        pendingTabUrl = url;
        clearModalInputs();
        openModal();
    } catch (error) {
        console.error("Error getting current tab:", error);
        alert("Unable to save the current tab right now.");
    }
};

const handleConfirmSaveTab = () => {
    if (!pendingTabUrl) return;

    const lead = createLead({
        title: tabTitleInput.value,
        url: pendingTabUrl,
        note: tabNoteInput.value,
    });

    addLead(lead);
    closeModal();
};

const handleDeleteAll = () => {
    localStorage.clear();
    clearAllLeads();
};

/* Initialize */

const initializeApp = () => {
    myLeads = readLeadsFromStorage();
    renderLeads(myLeads);

    inputButton.addEventListener("click", handleManualSave);
    saveTabButton.addEventListener("click", handleSaveTabClick);
    confirmSaveTabButton.addEventListener("click", handleConfirmSaveTab);
    cancelNoteButton.addEventListener("click", closeModal);
    deleteButton.addEventListener("dblclick", handleDeleteAll);
};

initializeApp();

let myLeads = [];

const inputButton = document.getElementById("input-button");
const inputElement = document.getElementById("input-element");
const unorderedListEl = document.getElementById("unorderedList");
let leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const deleteButton = document.getElementById("delete-button")
const saveTabButton = document.getElementById("save-tab")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    renderLeads(myLeads)
}



function renderLeads(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
     listItems += `
        <li>
             <a target='_blank' href='${leads[i]}'>
             ${leads[i]}  
             </a>
        </li>
        `
    }
 unorderedListEl.innerHTML = listItems
}

saveTabButton.addEventListener("click", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    myLeads.push(tabs[0].url)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    renderLeads(myLeads)
    })

})

deleteButton.addEventListener("dblclick", function(){
    localStorage.clear();
    myLeads = [];
    renderLeads(myLeads);
})

inputButton.addEventListener("click", function() {
    myLeads.push(inputElement.value)
    inputElement.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    renderLeads(myLeads)
})
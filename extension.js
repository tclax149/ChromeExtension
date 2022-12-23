
let myLeads = [];

const inputButton = document.getElementById("input-button");
const inputElement = document.getElementById("input-element");
const unorderedListEl = document.getElementById("unorderedList");
let leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    renderLeads()
}

inputButton.addEventListener("click", function() {
    myLeads.push(inputElement.value)
    inputElement.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    renderLeads()
})

function renderLeads() {
let listItems = ""
for (let i = 0; i < myLeads.length; i++) {
 listItems += `
    <li>
         <a target='_blank' href='${myLeads[i]}'>
         ${myLeads[i]}  
         </a>
    </li>
    `
}

    unorderedListEl.innerHTML = listItems;

}
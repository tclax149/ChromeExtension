
let myLeads = [];

const inputButton = document.getElementById("input-button");
const inputElement = document.getElementById("input-element");
const unorderedListEl = document.getElementById("unorderedList");

localStorage.setItem("myLeads", "www.exampleLead.com")



inputButton.addEventListener("click", function(){
    myLeads.push(inputElement.value)
    renderLeads();
    inputElement.value = "";
})

function renderLeads(){
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
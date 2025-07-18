//glue b/w view and model/service(input output)
import {validateDate, validateDesc, validateName} from "./validation.js";
import todoOperations from "./service.js";
import {init} from "./utils.js";
window.addEventListener('load',initialize);
let autoId;
function initialize(){
    bindEvents();
    autoId=init();
    showId();
    todoOperations.loadTasks();
    printAllTask();
}
function bindEvents(){
    document.getElementById('Add').addEventListener('click',addTask);
    document.querySelector('#Delete').addEventListener('click',deleteForever);
    document.querySelector('#Clear').addEventListener('click',clearAll);
    document.querySelector('#Update').addEventListener('click',updateRow);
    document.querySelector('#sortName').addEventListener('click',Sorting);
    document.querySelector('#Search').addEventListener('click',searchFn);
    document.querySelector('#searchIcon').addEventListener('click',performSearch);
    document.querySelector('#Save').addEventListener('click',saveTasks);
}
function saveTasks(){
    todoOperations.saveTasks();
}
function performSearch(){
    const query=document.getElementById("searchInput").value.toLowerCase();
    const rows=document.querySelectorAll("#task-list tr");
    if(rows.length==0){
        console.warn("No table rows found yet!");
        return;
    }
    rows.forEach(row=>{
        const cells=row.querySelectorAll("td");
        const nameCell=cells[1];
        if(nameCell && nameCell.innerText.toLowerCase().trim() === query){
            row.classList.add("highlight");
        }
        else{
            row.classList.remove("highlight");
        }
    });
}
let isSearchVisible = false;
function searchFn() {
    const searchBox = document.querySelector('#SearchBox');
    const searchIcon = document.querySelector('#searchIcon');
    if (!isSearchVisible) {
        // Show the search input
        searchBox.innerHTML = '<input type="text" placeholder="Enter your Search" class="search-box" id="searchInput">';
        searchIcon.innerHTML = '<i class="fas fa-search sIcon searchIcon"></i>'; // close icon

        // Auto-focus the input after it appears
        setTimeout(() => {
            const input = document.getElementById("searchInput");
            if (input) input.focus();
        }, 50);
    } else {
        // Hide the search input
        searchBox.innerHTML = '';
        searchIcon.innerHTML = ''; 

        // Clear any row highlights
        const rows = document.querySelectorAll("#task-list tr");
        rows.forEach(row => row.classList.remove("highlight"));
    }
    isSearchVisible = !isSearchVisible; // Toggle the flag
}
let sortAsc=true;
function Sorting(){
    todoOperations.sortTask(sortAsc);
    sortAsc=!sortAsc;
    refreshTable();
}
function refreshTable(){
    const tbody=document.querySelector('#task-list');
    tbody.innerHTML="";
    printAllTask();
    computeTotal();
}
function clearAll(){
    const rows = document.querySelectorAll('#task-list tr');
    rows.forEach(row => {
        row.classList.add('fade-out');
    });
    setTimeout(() => {
        document.querySelector('#task-list').innerHTML = '';
        todoOperations.tasks = [];
        todoOperations.clearAll(); 
        computeTotal();
    }, 400);
}
function deleteForever(){
    const tbody=document.querySelector('#task-list');
    const markedRows=tbody.querySelectorAll('tr.red');
    markedRows.forEach(row=>{
        row.classList.add('fade-out');
    })
    setTimeout(()=>{
        tbody.innerHTML='';
        todoOperations.removeTask();
        printAllTask();
    },400);
}
function showId(){
    if(todoOperations.getTotal()==0){
        autoId=init()
    }
    document.querySelector('#id').innerText=autoId();


}
function addTask(){
    var task = readFields();
    if(verifyFields(task)){
        todoOperations.addTask(task);
        printTask(task);
        computeTotal();
        showId();
    };//
    //console.log("task is",task);
}
function printAllTask(){
    todoOperations.tasks.forEach(printTask);
    computeTotal();
}
function printTask(task) {
    const tbody = document.querySelector('#task-list');
    const tr = tbody.insertRow();
    let index = 0;
    for (let key in task) {
        if (key === 'isMarked') continue;
        const td = tr.insertCell(index);
        if (key === 'photo') {
            const img = document.createElement('img');
            img.src = task[key];
            img.alt = 'Task Photo';
            img.width = 50;
            img.height = 50;
            img.style.objectFit = 'cover';  
            td.appendChild(img);
        } else {
            td.innerText = task[key];
        }
        index++;
    }
     const td = tr.insertCell(index);
   td.appendChild(createIcon(task.id, toggleMarking));
   td.appendChild(createIcon(task.id, edit, 'fa-pen'));
}

function computeTotal(){
    document.querySelector("#total").innerText=todoOperations.getTotal();
    document.querySelector("#marked").innerText=todoOperations.markCount();
    document.querySelector("#unmarked").innerText=todoOperations.unMarkCount();
    const btn=document.querySelector("#Delete");
    if(document.querySelector("#marked").innerText!=0){
        btn.disabled=false;
    }
    else{
        btn.disabled=true;
    }
}
function toggleMarking(){
    const currentButton=this;
    const id=currentButton.getAttribute('task-id');
    console.log('toggle Marking call',id);
    todoOperations.toggleTask(id);
    console.log('All Task',todoOperations.tasks);
    const tr=currentButton.parentNode.parentNode;
    tr.classList.toggle('red');
    computeTotal();
}
function edit(){
    editRow(this);  
}
function createIcon(id,fn,className='fa-trash'){
    const iTag=document.createElement('i');
    iTag.className=`fa-solid ${className} hand`;
    iTag.addEventListener('click',fn);
    iTag.setAttribute('task-id',id);
    return iTag;
}
let EditedRow=null;
function editRow(iTag){
    const row=iTag.closest("tr");
    const cells=row.querySelectorAll("td");
    console.log(cells);
    const fields=['name','desc','date','time','photo'];
    console.log(fields);
    for(let i=0;i<fields.length;i++){
        document.getElementById(fields[i]).value=cells[i+1].innerText;
    }
    EditedRow=row;
    document.getElementById("Update").disabled=false;
}
function updateRow() {
    if (!EditedRow) return;
    const cells = EditedRow.querySelectorAll("td");
    const fields = ['name', 'desc', 'date', 'time', 'photo'];
    for (let i = 0; i < fields.length; i++) {
        const value = document.getElementById(fields[i]).value;
        if (fields[i] === 'photo') {
            // Clear the old content (URL or previous <img>)
            cells[i + 1].innerHTML = '';
            // Create new image element
            const img = document.createElement('img');
            img.src = value;
            img.alt = 'Task Photo';
            img.width = 50;
            img.height = 50;
            img.style.objectFit = 'cover';
            // Append image to the cell
            cells[i + 1].appendChild(img);
        } else {
            cells[i + 1].innerText = value;
        }
    }
    EditedRow = null;
    document.getElementById("Update").disabled = true;
}
function verifyFields(task){
    var nameError="";
    var dateError="";
    var descError="";
    nameError=validateName(task.name);
    dateError=validateDate(task.date);
    descError=validateDesc(task.desc);
    let hasError = false;
    if(nameError){
        document.getElementById('name-error').innerText=validateName(task.name);
        hasError=true;
    }
    else{
        document.getElementById('name-error').innerText="";
    }
    if(descError){
        document.getElementById('desc-error').innerText=validateDesc(task.desc);
        hasError=true;
    }
    else{
        document.getElementById('desc-error').innerText="";
    }
    if(dateError){
        document.getElementById('date-error').innerText=validateDate(task.date);
        hasError=true;
    }
    else{
        document.getElementById('date-error').innerText="";
    }
    return !hasError;
}
function readFields(){
    const fields=['id','name','desc','date','time','photo'];
    var task={};
    for(let field of fields){
        if(field=='id'){
            task[field]=document.getElementById(field).innerText;
            continue;
        }
        task[field]=document.getElementById(field).value;
        console.log(field);
        console.log(task);
    }
    return task;
}

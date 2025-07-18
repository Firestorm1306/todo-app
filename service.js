//it contains logic of CRUD
const todoOperations={
    tasks:[],
    addTask(task){
        task.isMarked=false;
        this.tasks.push(task);
    },
    getTotal(){
        return this.tasks.length;
    },
    toggleTask(id){
        const taskObject=this.tasks.find(task=>task.id==id);
        taskObject.isMarked=!taskObject.isMarked;
    },
    markCount(){
        return this.tasks.filter(task=>task.isMarked).length;
    },
    unMarkCount(){
        return this.tasks.length-this.markCount();
    },
    removeTask(){
        this.tasks=this.tasks.filter(task=>!task.isMarked);
    },
    sortTask(sortAsc){
        if(sortAsc){
            this.tasks.sort((a,b)=>a.name.localeCompare(b.name));
        }
        else{
            this.tasks.sort((a,b)=>b.name.localeCompare(a.name));
        }
    },
    saveTasks(){
        localStorage.setItem('tasks',JSON.stringify(this.tasks));
        console.log('data saved to local storage');
    },
    loadTasks(){
        const savedTasks= localStorage.getItem('tasks');
        if(savedTasks){
            this.tasks=JSON.parse(savedTasks);
        }    
    },
    clearAll(){
        localStorage.removeItem('tasks');
    }
}
export default todoOperations;
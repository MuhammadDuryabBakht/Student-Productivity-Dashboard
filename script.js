const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitle =document.getElementById("taskTitle");
const taskCourse =document.getElementById("taskCourse");
const taskDueDate =document.getElementById("taskDueDate");
const saveTaskBtn =document.getElementById("saveTaskBtn");

const tasks=[
    
]

function renderTasks() {
    tasksList.innerHTML = "";
    tasks.forEach(function (task) {
        const taskCard =document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.course}</p>
                <p>Due: ${task.dueDate}</p>
            </div>
            <div>
                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;
        tasksList.appendChild(taskCard);
    });
}
function resetTaskForm(){
    taskTitle.value="";
    taskCourse.value="";
    taskDueDate.value="";
    taskForm.classList.add("hidden");
}

addTaskBtn.addEventListener("click", function () {
    taskForm.classList.remove("hidden");
});
saveTaskBtn.addEventListener("click", function () {
    const newTask = {
    title: taskTitle.value,
    course: taskCourse.value,
    dueDate: taskDueDate.value,
    completed: false
};
if(taskTitle.value==="" && taskCourse.value===""){
    alert("Please fill the requirments completely");
}
else if(taskCourse.value===""){
    alert("Please fill the requirments completely");
}
else if(taskTitle.value===""){
    alert("Please fill the requirments completely");
}
else{
    tasks.push(newTask);
    renderTasks();
    resetTaskForm();
}
});

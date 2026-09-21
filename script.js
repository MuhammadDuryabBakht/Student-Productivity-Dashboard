const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitle =document.getElementById("taskTitle");
const taskCourse =document.getElementById("taskCourse");
const taskDueDate =document.getElementById("taskDueDate");
const saveTaskBtn =document.getElementById("saveTaskBtn");
const tasksList=document.getElementById("tasksList");
const assignmentCount =document.getElementById("assignmentCount");
const completedCount =document.getElementById("completedCount");
const pendingCount =document.getElementById("pendingCount");

let tasks=[
    
]

function updateStatistics() {
    const total = tasks.length;
    const completed =tasks.filter(function (task) {
            return task.completed;
        }).length;
    const pending = total - completed;
    assignmentCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

function renderTasks() {
    tasksList.innerHTML = "";
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-message">
            No tasks yet.
            </div>
        `;
    updateStatistics();
    return;
}
    tasks.forEach(function (task) {
        const taskCard =document.createElement("div");
        taskCard.classList.add("task-card");
        if (task.completed) {
            taskCard.classList.add("completed");
        }
        taskCard.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.course}</p>
                <p>Due: ${task.dueDate}</p>
            </div>
            <div class="taskActions">
                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;
        const deleteTaskBtn = taskCard.querySelector(".delete-btn");
        const completeTaskBtn = taskCard.querySelector(".complete-btn");
        deleteTaskBtn.addEventListener("click", function () {
            tasks = tasks.filter(t => t.id !== task.id); // remove only this task
            renderTasks(); // re-render the updated list
        });
        completeTaskBtn.addEventListener("click", function () {
            task.completed = !task.completed;
            renderTasks();
        });

        tasksList.appendChild(taskCard);
    });
    updateStatistics();
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
        id: Date.now(),
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
    tasks.unshift(newTask);
    renderTasks();
    resetTaskForm();
}
});


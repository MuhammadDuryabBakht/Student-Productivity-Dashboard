let editingTaskId = null;
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitle =document.getElementById("taskTitle");
const taskCourse =document.getElementById("taskCourse");
const taskDueDate =document.getElementById("taskDueDate");
const saveTaskBtn =document.getElementById("saveTaskBtn");
const tasksList=document.getElementById("tasksList");
const taskCount =document.getElementById("taskCount");
const completedCount =document.getElementById("completedCount");
const pendingCount =document.getElementById("pendingCount");
const cancelTaskForm=document.querySelector("#cancelTaskForm");
const searchTasks=document.querySelector("#searchTasks");

let tasks=JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateStatistics() {
    const total = tasks.length;
    const completed =tasks.filter(function (task) {
            return task.completed;
        }).length;
    const pending = total - completed;
    taskCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-message">
            No tasks yet.
            </div>
        `;
    updateStatistics();
    return;
    }
    tasksList.innerHTML = "";

    const searchText = searchTasks.value.toLowerCase();
    const filteredTasks = tasks.filter(function (task) {
        return task.title.toLowerCase().includes(searchText);
    })
    searchTasks.addEventListener("input", function () {
        renderTasks();
    });
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-message">
            No tasks found.
            </div>
        `;
    updateStatistics();
    return;
    }

    filteredTasks.forEach(function (task) {
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
                <button class="complete-btn" id="comp-btn">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button class="edit-btn">
                    Edit
                </button>
                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;
        const deleteTaskBtn = taskCard.querySelector(".delete-btn");
        const completeTaskBtn = taskCard.querySelector(".complete-btn");
        const editTaskBtn =taskCard.querySelector(".edit-btn");
        deleteTaskBtn.addEventListener("click", function () {
            tasks = tasks.filter(t => t.id !== task.id); // remove only this task
            saveTasks();
            renderTasks(); // re-render the updated list
        });
        completeTaskBtn.addEventListener("click", function () {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });
        editTaskBtn.addEventListener("click", function () {
            taskTitle.value = task.title;
            taskCourse.value = task.course;
            taskDueDate.value = task.dueDate;
            editingTaskId = task.id;
            taskForm.classList.remove("hidden");
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
    if (editingTaskId === null){
        const newTask= {
            id: Date.now(),
            title: taskTitle.value,
            course: taskCourse.value,
            dueDate: taskDueDate.value,
            completed: false
        };
        // if(taskTitle.value==="" && taskCourse.value===""){
        //     alert("Please fill the requirments completely");
        // }
        // else if(taskCourse.value===""){
        //     alert("Please fill the requirments completely");
        // }
        // else if(taskTitle.value===""){
        //     alert("Please fill the requirments completely");
        // }
        // else{
        //     resetTaskForm();
        //     tasks.unshift(newTask);
        // }
        if(taskTitle.value.trim()==="" || taskCourse.value===""){
            alert("Please fill the required data...");
        }
        else{
            resetTaskForm();
            tasks.unshift(newTask);
        }
    }else{
        const eidtTask = tasks.find(function (task) {
                return task.id === editingTaskId;
            });
        eidtTask.title = taskTitle.value;
        eidtTask.course = taskCourse.value;
        eidtTask.dueDate = taskDueDate.value;
        resetTaskForm();
        }
        saveTasks();
        renderTasks();
        editingTaskId = null;
});
cancelTaskForm.addEventListener("click",function(){
    resetTaskForm();
})
renderTasks();
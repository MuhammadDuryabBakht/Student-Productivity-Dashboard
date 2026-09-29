// Task Section

let editingTaskId = null;
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitle = document.getElementById("taskTitle");
const taskCourse = document.getElementById("taskCourse");
const taskDueDate = document.getElementById("taskDueDate");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const tasksList= document.getElementById("tasksList");
const taskForm=document.getElementById("taskForm");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const cancelTaskForm= document.querySelector("#cancelTaskForm");
const searchTasks= document.querySelector("#searchTasks");
const statusFilter = document.getElementById("statusFilter");
const sortTasks = document.getElementById("sortTasks");

// Course Section

const addCourseBtn =document.getElementById("addCourseBtn");
const courseForm = document.getElementById("courseForm");
const courseName = document.getElementById("courseName");
const saveCourseBtn = document.getElementById("saveCourseBtn");
const courseList = document.getElementById("courseList");
const cancelCourseForm = document.getElementById("cancelCourseForm");
const courseCount=document.getElementById("courseCount");

// Upcoming Section

const upcomingList = document.getElementById("upcomingList");

// Saving Section

let tasks=JSON.parse(localStorage.getItem("tasks")) || [];
let courses = JSON.parse(localStorage.getItem("courses")) || [];

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}
function saveCourses() {
    localStorage.setItem(
        "courses",
        JSON.stringify(courses)
    );
}


function updateStatistics() {
    const total = tasks.length;
    const totalCourse=courses.length;
    const completed =tasks.filter(function (task) {
            return task.completed;
        }).length;
    const pending = total - completed;
    taskCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
    courseCount.textContent=totalCourse;
}


//           Tasks Section



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
    const selectedStatus = statusFilter.value;
    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch=task.title.toLowerCase().includes(searchText);
        const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && task.completed) ||
        (selectedStatus === "pending" && !task.completed);
        
        return matchesSearch && matchesStatus;
    });
    if (sortTasks.value === "nearest") {
        filteredTasks.sort(function (a, b) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }
    if (sortTasks.value === "farthest") {
        filteredTasks.sort(function (a, b) {
            return new Date(b.dueDate) - new Date(a.dueDate);
        });
    }
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
            renderUpcomingTasks();
            renderTasks(); // re-render the updated list
        });
        completeTaskBtn.addEventListener("click", function () {
            task.completed = !task.completed;
            saveTasks();
            renderUpcomingTasks();
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
        if(taskTitle.value.trim()==="" || taskCourse.value==="" || taskDueDate.value===""){
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
    renderUpcomingTasks();
    renderTasks();
    editingTaskId = null;
});
cancelTaskForm.addEventListener("click",function(){
    resetTaskForm();
})
statusFilter.addEventListener("change", function () {
    renderTasks();
});
sortTasks.addEventListener("change", function () {
    renderTasks();
});



//           Courses Section



 function resetCourseForm(){
    courseName.value = "";
    courseForm.classList.add("hidden");
 }
addCourseBtn.addEventListener("click", function () {
    courseForm.classList.remove("hidden");
});

saveCourseBtn.addEventListener("click", function () {
    if (courseName.value.trim() === "") {
        alert("Please enter a course name.");
        return;
    }
    const newCourse = {
        id: Date.now(),
        name: courseName.value.trim()
    };
    courses.push(newCourse);
    saveCourses();
    updateStatistics();
    renderCourseOptions();
    renderCourse();
    resetCourseForm();
});
cancelCourseForm.addEventListener("click",function(){
    resetCourseForm();
})
function renderCourse() {
    courseList.innerHTML = "";
    if (courses.length === 0) {
        courseList.innerHTML = `
        <div class="empty-message">
            No courses yet.
        </div>
    `;
        return;
    }
    courses.forEach(function (course) {
        const courseCard = document.createElement("div");
        courseCard.classList.add("course-card");
        courseCard.innerHTML = `
            <div>
                <h3>${course.name}</h3>
            </div>
            <button class="delete-course-btn">
                Delete
            </button>
        `;
        const deleteCourseBtn = courseCard.querySelector(".delete-course-btn");
        deleteCourseBtn.addEventListener("click", function(){
            courses = courses.filter(function (item) {
                return item.id !== course.id;
            });
            saveCourses();
            updateStatistics();
            renderCourseOptions();
            renderCourse();
        });
        courseList.appendChild(courseCard);
    });
}
function renderCourseOptions() {
    taskCourse.innerHTML = `
        <option value="">Select Course</option>
    `;
    courses.forEach(function (course) {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        taskCourse.appendChild(option);
    });
}



//           Upcoming Section



function renderUpcomingTasks() {
    upcomingList.innerHTML = "";
    const upcomingTasks = tasks
        .filter(function (task) {
            return !task.completed;
        })
        .slice()
        .sort(function (a, b) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        })
        .slice(0, 3);
    if (upcomingTasks.length === 0) {
        upcomingList.innerHTML = `
            <div class="empty-message">
                No upcoming deadlines.
            </div>
        `;
        return;
    }
    upcomingTasks.forEach(function (task) {
        const item = document.createElement("div");
        item.classList.add("upcoming-item");
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        let deadlineText;
        if (dueDate < today) {
            deadlineText = "OVERDUE";
            item.classList.add("overdue");
        } else {
        deadlineText = task.dueDate;
        }
        item.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.course}</p>
            </div>
            <span>${task.dueDate}</span>
        `;
        upcomingList.appendChild(item);
    });
}
renderTasks();
renderCourse();
renderCourseOptions();
renderUpcomingTasks();
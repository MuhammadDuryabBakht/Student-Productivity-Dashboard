
// Toggle Theme Section

const themeToggle = document.getElementById("themeBtn");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    if (isDarkMode) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
} else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙";
}

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

// Progress Section

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

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


// Notes Section

let editingNoteId = null;
const addNoteBtn = document.getElementById("addNoteBtn");
const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteList = document.getElementById("noteList");
const cancelNoteForm = document.getElementById("cancelNoteForm");
const searchNotes = document.getElementById("searchNotes");
const sortNotes = document.getElementById("sortNotes");

// Saving Section

let tasks=JSON.parse(localStorage.getItem("tasks")) || [];
let courses = JSON.parse(localStorage.getItem("courses")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

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
function saveNotes() {
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
};


//  Statistics Updation

function updateStatistics() {
    const total = tasks.length;
    const totalCourse=courses.length;
    const completed =tasks.filter(function (task) {
            return task.completed;
        }).length;
    const pending = total - completed;
    let progress = 0;
    if (total > 0) {
        progress = Math.round((completed / total) * 100);
    }
    progressText.textContent = `${progress}% Complete`;
    progressFill.style.width = `${progress}%`;
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
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        const difference = dueDate.getTime() - today.getTime();
        const daysLeft = difference / (1000 * 60 * 60 * 24);
        let deadlineText;
        if (daysLeft < 0) {
            deadlineText = "OVERDUE";
            item.classList.add("overdue");
        } 
        else if (daysLeft === 0) {
            deadlineText = "Due Today";
            item.classList.add("due-today");
        } 
        else if (daysLeft === 1) {
            deadlineText = "Tomorrow";
        } 
        else {
            deadlineText = `${daysLeft} days left`;
        }
        item.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.course}</p>
            </div>
            <span>${deadlineText}</span>
        `;
        upcomingList.appendChild(item);
    });
}



//           Notes Section


function resetNoteForm(){
    noteTitle.value="";
    noteContent.value="";
    noteForm.classList.add("hidden");
};
function renderNotes() {
    noteList.innerHTML = "";
    const searchText = searchNotes.value.toLowerCase();
    const filteredNotes = notes.filter(function (note) {
        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
        );
    });
    if (filteredNotes.length === 0) {
        noteList.innerHTML = `
            <div class="empty-message">
                No notes yet.
            </div>
        `;
        return;
    }

    if (sortNotes.value === "newest") {
        filteredNotes.sort(function (a, b) {
            return b.id - a.id;
        });
    }
    if (sortNotes.value === "oldest") {
        filteredNotes.sort(function (a, b) {
            return a.id - b.id;
        });
    }

    filteredNotes.forEach(function (note) {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");
        noteCard.innerHTML = `
            <div>
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            </div>
            <div class="note-actions">
                <button class="edit-note-btn">
                    Edit
                </button>
                <button class="delete-note-btn">
                    Delete
                </button>
            </div>
        `;
        const deleteNoteBtn = noteCard.querySelector(".delete-note-btn");
        const editNoteBtn = noteCard.querySelector(".edit-note-btn");
        editNoteBtn.addEventListener("click", function () {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            editingNoteId = note.id;
            noteForm.classList.remove("hidden");
        });
        deleteNoteBtn.addEventListener("click", function () {
            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });
            saveNotes();
            renderNotes();
        });
        noteList.appendChild(noteCard);
    });
}

addNoteBtn.addEventListener("click",()=>{
    noteForm.classList.remove("hidden");
});
saveNoteBtn.addEventListener("click",()=>{
    if (editingNoteId === null) {
        const newNote = {
            id: Date.now(),
            title: noteTitle.value.trim(),
            content: noteContent.value.trim()
        };
        notes.unshift(newNote);
    } 
    else {
        const editNote = notes.find(function (item) {
            return item.id === editingNoteId;
        });
        editNote.title = noteTitle.value.trim();
        editNote.content = noteContent.value.trim();
    }
    saveNotes();
    renderNotes();
    editingNoteId = null;
    resetNoteForm();
});
cancelNoteForm.addEventListener("click",()=>{
    resetNoteForm();
})
searchNotes.addEventListener("input", function () {
    renderNotes();
});
sortNotes.addEventListener("change", function () {
    renderNotes();
});




renderTasks();
renderCourse();
renderCourseOptions();
renderUpcomingTasks();
renderNotes();
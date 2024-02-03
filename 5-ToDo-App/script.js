/* ---------------------- Variables --------------------- */
const inputText = document.getElementById("inputText");
const todosPending = document.getElementById("pending");
const todosCompleted = document.getElementById("completed");
const btnAdd = document.querySelector(".add");
const imgHeaderBackground = document.querySelector("img[data-src]");
const main = document.querySelector(".main");
let localStorageArray = [];

/* ------------------- imgLoadObserver ------------------ */
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entries);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgObserver.observe(imgHeaderBackground);

/* ----------- localStorage ---------- */

window.addEventListener("DOMContentLoaded", function () {
  const storedTasks = localStorage.getItem("tasksInLocalStorage");
  if (storedTasks) {
    localStorageArray = JSON.parse(storedTasks);
  }
  retriveTodos();
});

/* ------------------------ evet.key= 'keyup' ----------------------- */
inputText.addEventListener("keyup", function (event) {
  handleKeyUp();
});
function handleKeyUp() {
  const userEnteredValue = inputText.value.trim();
  if (userEnteredValue.length !== 0) {
    btnAdd.classList.add("active");
  } else {
    btnAdd.classList.remove("active");
  }
}

/* ---------------------- event.key='Enter' --------------------- */
inputText.addEventListener("keydown", function (e) {
  if (e.key === "Enter") handlebtnAddOnClick();
});

/* -------------------- btnAdd click event-------------------- */
btnAdd.addEventListener("click", function (e) {
  handlebtnAddOnClick();
});
function handlebtnAddOnClick() {
  const userEnteredValue = inputText.value.trim();
  if (userEnteredValue.length !== 0) {
    localStorageArray.push({
      task: userEnteredValue,
      isCheckboxChecked: false,
    });
    localStorage.setItem(
      "tasksInLocalStorage",
      JSON.stringify(localStorageArray)
    );
    retriveTodos();
    inputText.value = "";
    btnAdd.classList.remove("active");
  }
}

function moveCompletedTasks(index) {
  console.log(checkboxes);
  localStorageArray.forEach((task, index) => {
    if (task.isCheckboxChecked) {
      localStorageCompleted.push(localStorageArray[index]);
      localStorageArray.splice(index, 1);
    }
  });
  localStorage.setItem(
    "tasksInLocalStorage",
    JSON.stringify(localStorageArray)
  );
  localStorage.setItem(
    "tasksInLocalStorageCompleted",
    JSON.stringify(localStorageCompleted)
  );
  retriveTodos();
}
/* --------------------- delete functionality -------------------- */
function deleteTask(index) {
  localStorageArray.splice(index, 1);
  localStorage.setItem(
    "tasksInLocalStorage",
    JSON.stringify(localStorageArray)
  );
  retriveTodos();
}
/* -------------------- retrive todosPendin.innerHTML -------------------- */
function retriveTodos() {
  todosPending.innerHTML = ""; // Clear existing tasks
  todosCompleted.innerHTML = ""; // Clear existing completed tasks

  localStorageArray.forEach((task, index) => {
    const checkbox = task.isCheckboxChecked ? "checked" : "";
    const liStyle = task.isCheckboxChecked
      ? "text-decoration: line-through;"
      : "";

    const newLiElement = `
      <li class="" style="${liStyle}">
        <input type="checkbox" class="checkbox" onchange="handleCheckboxChange(${index})" ${checkbox} />
        <span id="span_${index}">${task.task}</span>
        <span class="icon" onclick="deleteTask(${index})">
          <i class="fas fa-trash"></i>
        </span>
      </li>
    `;

    if (task.isCheckboxChecked) {
      todosCompleted.innerHTML += newLiElement;
    } else {
      todosPending.innerHTML += newLiElement;
    }

    const newHrElement = `<hr style="width:${
      updateDecorativeLineWidth(index) + "px"
    }">`;

    if (task.isCheckboxChecked) {
      todosCompleted.innerHTML += newHrElement;
    } else {
      todosPending.innerHTML += newHrElement;
    }
  });
  updateMessage();
}
function updateDecorativeLineWidth(index) {
  const span = document.getElementById("span_" + index);
  return span.offsetWidth + 80;
}

function handleCheckboxChange(index) {
  localStorageArray[index].isCheckboxChecked =
    !localStorageArray[index].isCheckboxChecked;
  localStorage.setItem(
    "tasksInLocalStorage",
    JSON.stringify(localStorageArray)
  );
  retriveTodos();
}

function updateMessage() {
  const message = document.querySelector(".pendingTasks");
  const completedTasks = localStorageArray.filter(
    (task) => task.isCheckboxChecked
  );
  const numCompleted = completedTasks.length;
  const totalTasks = localStorageArray.length;
  message.textContent = `${numCompleted} of ${totalTasks} tasks are completed.`;
}

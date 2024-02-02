/* ---------------------- Variables --------------------- */
const inputText = document.getElementById("inputText");
const todosList = document.getElementById("todosList");
const btnAdd = document.querySelector(".add");
const mainToDoSection = document.querySelector(".section--2");
const doneToDosList = document.getElementById("doneToDosList");
const message = document.querySelector("section.message");
const imgHeaderBackground = document.querySelector("img[data-src]");

let done = 0;
let unDone = 0;

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

/* ---------------------- Listeners --------------------- */
btnAdd.addEventListener("click", handleAddButtonClick);
inputText.addEventListener("keydown", handleInputTextKeydown);
mainToDoSection.addEventListener("click", handleMainToDoSectionClick);

/* ---------------------- Functions --------------------- */
function handleAddButtonClick() {
  const todoText = inputText.value.trim();
  if (todoText && checkToDoTextLength(todoText)) {
    addToDo(todoText);
    inputText.value = "";
  }
}
function handleInputTextKeydown(event) {
  if (event.key === "Enter") {
    handleAddButtonClick();
  }
}

function handleMainToDoSectionClick(event) {
  const target = event.target;
  if (target.classList.contains("checkboxes")) {
    handleCheckboxChange(target);
  } else if (target.classList.contains("delete-icon")) {
    handleDeleteIconClick(target);
  }
}

function addToDo(todoText) {
  // const todoContainer = createTodoContainer();
  const todoContainer = document.createElement("div");
  todoContainer.className = "todo-container";
  const newToDo = createNewTodoElement(todoText);
  todoContainer.appendChild(newToDo);
  todosList.appendChild(todoContainer);
  updateDecorativeLineWidth(newToDo);
  unDone++;
  updateMessage();
  return todoContainer;
}

function createNewTodoElement(todoText) {
  const newToDo = document.createElement("li");
  newToDo.className = "todo";
  const checkbox = createCheckbox();
  const textNode = document.createTextNode(todoText);
  const imgDelete = createDeleteIcon();
  newToDo.append(checkbox, textNode, imgDelete);
  return newToDo;
}

function createCheckbox() {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkboxes";
  return checkbox;
}

function createDeleteIcon() {
  const imgDelete = document.createElement("img");
  imgDelete.className = "delete-icon";
  imgDelete.src = "./assets/delete.png";
  return imgDelete;
}

function updateDecorativeLineWidth(newToDo) {
  const decorativeLine = document.createElement("hr");
  decorativeLine.style.width = setDecorativeLineWidth(newToDo) + "px";
  const todoContainer = newToDo.parentNode;
  todoContainer.appendChild(decorativeLine);
}

function setDecorativeLineWidth(element) {
  return element.scrollWidth;
}

function checkToDoTextLength(todoText) {
  return todoText.length > 0 && todoText.length <= 100;
}

function handleCheckboxChange(checkbox) {
  const todoContainer = checkbox.closest(".todo-container");
  //console.log(todoContainer)
  if (checkbox.checked) {
    doneToDosList.appendChild(todoContainer);
    todoContainer.classList.add("doneStyle");
    done++;
    unDone--;
  } else {
    todosList.appendChild(todoContainer);
    todoContainer.classList.remove("doneStyle");
    done--;
    unDone++;
  }
  updateMessage();
}
function handleDeleteIconClick(deleteIcon) {
  const todoContainer = deleteIcon.closest(".todo-container");
  console.log(todoContainer);
  const parentList = todoContainer.parentNode;
  console.log(parentList);
  parentList.removeChild(todoContainer);
  if (parentList === todosList) {
    unDone--;
  } else if (parentList === doneToDosList) {
    done--;
  }
  updateMessage();
}
function updateMessage() {
  message.textContent = `${done} out of ${unDone + done} tasks completed!`;
}

import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import Footer from "./components/Footer";
import CompletedTaskList from "./components/CompletedTaskList";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]); // список задач
  const [sortType, setSortType] = useState("date"); // тип сортировки
  const [sortOrder, setSortOrder] = useState("asc"); // направление сортировки
  // открытые/закрытые секции
  const [openSection, setOpenSection] = useState({
    taskForm: false,
    tasks: true,
    completedTasks: true,
  });
  // текущие дата и время
  const [currentTime, setCurrentTime] = useState(Date.now());

  // изменение текущей даты, пока существует компонент
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // показать/скрыть секцию
  function toggleSection(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  // добавить задачу
  function addTask(task) {
    setTasks([...tasks, { ...task, completed: false, id: Date.now() }]);
  }

  // удалить задачу
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // выполнить задачу
  function completeTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  }

  // отсортировать задания
  function sortTask(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return sortOrder === "asc"
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      }
    });
  }

  // установить тип сортировки
  function toggleSortOrder(type) {
    if (sortType === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
  }

  const activeTasks = sortTask(tasks.filter((task) => !task.completed));
  const completedTasks = sortTask(tasks.filter((task) => task.completed));

  return (
    <div className="app">
      <div className="task-container">
        <h1>Список задач с приоритетом</h1>
        <button
          className={`close-button ${openSection.taskForm ? "open" : ""}`}
          onClick={() => toggleSection("taskForm")}
        >
          +
        </button>
        {openSection.taskForm && <TaskForm addTask={addTask} />}
      </div>
      <div className="task-container">
        <h2>Задачи</h2>
        <button
          className={`close-button ${openSection.tasks ? "open" : ""}`}
          onClick={() => toggleSection("tasks")}
        >
          +
        </button>
        <div className="sort-controls">
          <button
            className={`sort-button ${sortType === "date" ? "active" : ""}`}
            onClick={() => toggleSortOrder("date")}
          >
            По дате{" "}
            {sortType === "date" && (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
          <button
            className={`sort-button ${sortType === "priority" ? "active" : ""}`}
            onClick={() => toggleSortOrder("priority")}
          >
            По приоритету{" "}
            {sortType === "priority" &&
              (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
        </div>
        {openSection.tasks && (
          <TaskList
            completeTask={completeTask}
            deleteTask={deleteTask}
            activeTasks={activeTasks}
            currentTime={currentTime}
          />
        )}
      </div>
      <div className="completed-task-container">
        <h2>Выполненные задачи</h2>
        <button
          className={`close-button ${openSection.completedTasks ? "open" : ""}`}
          onClick={() => toggleSection("completedTasks")}
        >
          +
        </button>
        {openSection.completedTasks && (
          <CompletedTaskList
            deleteTask={deleteTask}
            completedTasks={completedTasks}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;

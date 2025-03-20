import TaskItem from "./TaskItem";

function TaskList({ activeTasks, deleteTask, completeTask, currentTime }) {
  return (
    <ul className="task-list">
      {activeTasks.map((task) => (
        <TaskItem
          completeTask={completeTask}
          deleteTask={deleteTask}
          task={task}
          key={task.id}
          isOverdue={currentTime > new Date(task.deadline).getTime()}
        />
      ))}
    </ul>
  );
}

export default TaskList;

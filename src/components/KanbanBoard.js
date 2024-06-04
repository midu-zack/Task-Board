import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './KanbanBoard.css';

const ItemTypes = {
  TASK: 'task',
};

function KanbanBoard() {
  const [tasks, setTasks] = useState({
    ideas: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    setTasks({
      ...tasks,
      ideas: [...tasks.ideas, newTask],
    });

    setNewTask('');
  };

  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDeleteTask = (category, index) => {
    const updatedTasks = tasks[category].filter((_, i) => i !== index);
    setTasks({
      ...tasks,
      [category]: updatedTasks,
    });
  };

  const moveTask = (task, fromCategory, toCategory) => {
    if (fromCategory === toCategory) {
      // Moving within the same category
      return;
    }
    setTasks((prevState) => {
      const fromList = prevState[fromCategory].filter((t) => t !== task);
      const toList = [...prevState[toCategory], task];
      return {
        ...prevState,
        [fromCategory]: fromList,
        [toCategory]: toList,
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="add-task-container">
          <form onSubmit={handleAddTask} className="add-task-form">
            <button type="submit" className="add-button">➕</button>
            <input
              type="text"
              placeholder="Add new task"
              value={newTask}
              onChange={handleChange}
            />
          </form>
        </div>
        <div className="kanban-container">
          {Object.keys(tasks).map((category) => (
            <KanbanColumn
              key={category}
              category={category}
              tasks={tasks[category]}
              moveTask={moveTask}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

function KanbanColumn({ category, tasks, moveTask, handleDeleteTask }) {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.task, item.category, category),
  });

  return (
    <div ref={drop} className="kanban-column">
      <div className="column-header">
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      </div>
      {tasks.map((task, index) => (
        <KanbanTask
          key={index}
          task={task}
          category={category}
          index={index}
          handleDeleteTask={handleDeleteTask}
        />
      ))}
    </div>
  );
}

function KanbanTask({ task, category, index, handleDeleteTask }) {
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { task, category, index },
  });

  return (
    <div ref={drag} className="kanban-task">
      {task}
      <button
        className="delete-button"
        onClick={() => handleDeleteTask(category, index)}
      >
        x
      </button>
    </div>
  );
}

export default KanbanBoard;

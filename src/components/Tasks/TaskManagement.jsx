import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Header } from "./Header";
import env from "react-dotenv";

const TaskManagement = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    inProgress: [],
    done: [],
  });
  const [newTask, setNewTask] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false); // For loading states
  const [error, setError] = useState(null); // For error handling

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      setLoading(true);
      const response = await axios.get(
        `${env.BASE_URL}/api/tasks`,
        config
      );
      const groupedTasks = response.data.reduce(
        (acc, task) => {
          acc[task.status].push(task);
          return acc;
        },
        { pending: [], inProgress: [], done: [] }
      );
      setTasks(groupedTasks);
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(
        `${env.BASE_URL}/api/task`,
        {
          name: newTask.name,
          description: newTask.description,
        },
        config
      );
      setTasks((prev) => ({
        ...prev,
        pending: [...prev.pending, response.data],
      }));
      setNewTask({ name: "", description: "" });
    } catch (err) {
      setError("Failed to add task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ task, sourceColumn })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const draggedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { task, sourceColumn } = draggedData;

    if (sourceColumn === targetColumn) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(
        `${env.BASE_URL}/api/task/status`,
        {
          taskId: task._id,
          status: targetColumn,
        },
        config
      );

      setTasks((prev) => {
        const updatedSourceColumn = prev[sourceColumn].filter(
          (t) => t._id !== task._id
        );
        const updatedTask = { ...task, status: targetColumn };

        return {
          ...prev,
          [sourceColumn]: updatedSourceColumn,
          [targetColumn]: [...prev[targetColumn], updatedTask],
        };
      });
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId, column) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        setLoading(true);
        await axios.delete(`${env.BASE_URL}/api/task/${taskId}`, config);
        setTasks((prev) => ({
          ...prev,
          [column]: prev[column].filter((task) => task._id !== taskId),
        }));
      } catch (err) {
        setError("Failed to delete task");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="task-management" style={{marginTop:'50px'}}>
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="task-columns">
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            Object.entries(tasks).map(([columnName, columnTasks]) => (
              <div
                key={columnName}
                className="task-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnName)}
              >
                <h2>
                  {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
                </h2>
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, columnName)}
                  >
                    <div className="task-header">
                      <h3>{task.name}</h3>
                      <div className="task-actions">
                        <button
                          onClick={() => handleDelete(task._id, columnName)}
                          className="delete-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p>{task.description}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default TaskManagement;

import React, { useState } from "react";
import { useTodoContext } from "../../context/TodoContext";
import "./TodoList.css";
import Modal from "../modal/Modal";

type Todo = {
  selectStatus: string;
  searchTodo: string;
};

const TodoList = ({ selectStatus, searchTodo }: Todo) => {
  //---------------------------------------------------------------------
  // States
  //---------------------------------------------------------------------
  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  //---------------------------------------------------------------------
  // Hooks
  //---------------------------------------------------------------------
  const { todos, deletedTodo, toggleTodo, editTodo } = useTodoContext();
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  //---------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------
  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const value = event.target.value;
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [id]: value,
    }));

    if (value === "deleted") {
      deletedTodo(Number(id));
    } else if (value == "completed") {
      toggleTodo(Number(id));
    } else if (value == "edit") {
      openModal();
      setSelectedId(Number(id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      editTodo(Number(selectedId), text);
      closeModal();
      setSelectedOptions({});
    }
  };

  //---------------------------------------------------------------------
  // Return
  //---------------------------------------------------------------------
  return (
    <ul>
      {todos.length <= 0 ? (
        <h1 style={{ textAlign: "center" }}>No todos</h1>
      ) : (
        todos
          .filter((todo) =>
            todo.text.toLowerCase().includes(searchTodo.toLowerCase())
          )
          .filter((todo) => {
            if (selectStatus === "all") {
              return true;
            } else if (selectStatus === "completed") {
              return todo.completed;
            } else {
              return !todo.completed;
            }
          })
          .map((todo) => (
            <li
              key={todo.id}
              className="listItem"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              <span>{todo.text}</span>
              <div>
                <select
                  value={selectedOptions[todo.id] || "todo"}
                  onChange={(event) => {
                    handleChange(event, todo.id.toString()),
                      event.target.value == "edit" && setText(todo.text);
                  }}
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="edit">Edit</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
            </li>
          ))
      )}
      <Modal
        isVisible={isModalVisible}
        onClose={() => {
          closeModal(), setSelectedOptions({});
        }}
        title="Edit Note"
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new todo"
          />
          <div className="modal-footer">
            <button
              type="button"
              className="channel"
              onClick={() => {
                setSelectedOptions({}), closeModal();
              }}
            >
              Chanel
            </button>
            <button className="apply" type="submit">
              Apply
            </button>
          </div>
        </form>
      </Modal>
    </ul>
  );
};

export default TodoList;

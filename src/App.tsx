import { useState } from "react";
import Modal from "./components/modal/Modal";
import { useTodoContext } from "./context/TodoContext";
import TodoList from "./components/todo/TodoList";
import { Icons } from "./icons/icons";

const App = () => {
  //---------------------------------------------------------------------
  // States
  //---------------------------------------------------------------------
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTodo, setSearchTodo] = useState<string>("");
  const [selectStatus, setSelctStatus] = useState<string>("all");
  const [text, setText] = useState("");
  //---------------------------------------------------------------------
  // Modal
  //---------------------------------------------------------------------
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  //---------------------------------------------------------------------
  // Hooks
  //---------------------------------------------------------------------
  const { addTodo } = useTodoContext();

  //---------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText("");
      closeModal();
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelctStatus(value);
  };

  //---------------------------------------------------------------------
  // Return
  //---------------------------------------------------------------------

  return (
    <div className="container">
      <h1 className="title">TODO LIST</h1>
      <div className="content">
        <input
          className="input"
          onChange={(e) => setSearchTodo(e.target.value)}
          placeholder="Search note..."
        />
        <div className="todo-buttons">
          <div className="select_div">
            <select className="select" onChange={handleChange}>
              <option value={"all"}>All</option>
              <option value={"completed"}>Completed</option>
            </select>
            <svg className="select_arrow">{Icons.arrowDown}</svg>
          </div>
          <div className="addtodo" onClick={openModal}>
            <span>Add +</span>
          </div>
        </div>
      </div>
      <div>
        {/* 
         //---------------------------------------------------------------------
        // List Todo
        //---------------------------------------------------------------------

        */}
        <TodoList searchTodo={searchTodo} selectStatus={selectStatus} />

        {/* 
         //---------------------------------------------------------------------
        // Add Todio Modal
        //---------------------------------------------------------------------
        */}
        <Modal isVisible={isModalVisible} onClose={closeModal} title="New Note">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="modal-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new todo"
            />
            <div className="modal-footer">
              <button type="button" className="channel" onClick={closeModal}>
                Chanel
              </button>
              <button className="apply" type="submit">
                Apply
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default App;

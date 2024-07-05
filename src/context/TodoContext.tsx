import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deletedTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

//---------------------------------------------------------------------
// ID for todo
//---------------------------------------------------------------------
let nextId = new Date().getTime();

const LOCAL_STORAGE_KEY = "todos";

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  //---------------------------------------------------------------------
  // States
  //---------------------------------------------------------------------
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  //---------------------------------------------------------------------
  // Effects
  //---------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  //---------------------------------------------------------------------
  // Functions
  //---------------------------------------------------------------------
  const addTodo = (text: string) => {
    setTodos([...todos, { id: nextId++, text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deletedTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, text: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
  };

  //---------------------------------------------------------------------
  // Rerturn
  //---------------------------------------------------------------------
  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, deletedTodo, editTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};

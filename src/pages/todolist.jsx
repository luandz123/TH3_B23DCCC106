import React, { useState, useEffect } from "react";

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");


    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem("todos"));
        if (savedTodos) {
            setTodos(savedTodos);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (input.trim() === "") return;
        setTodos([...todos, { text: input, completed: false }]);
        setInput("");
    };

    const toggleComplete = (index) => {
        const newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        setTodos(newTodos);
    };

    const deleteTodo = (index) => {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
    };

    return (
        <div className="container" style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>To-Do List</h2>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Thêm công việc..."
                />
                <button onClick={addTodo}>Thêm</button>
            </div>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                        {todo.text}
                        <button onClick={() => toggleComplete(index)}>
                            {todo.completed ? "Hoàn tác" : "Hoàn thành"}
                        </button>
                        <button onClick={() => deleteTodo(index)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;

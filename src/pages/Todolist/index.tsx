import { Button, Input, List, Checkbox, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import React, { useState } from 'react';
import styles from './index.less';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const intl = useIntl();

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(
        todos.map(todo =>
          todo.id === editingId ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className={styles.container}>
      <h1>Danh sách công việc</h1>
      
      <div className={styles.inputContainer}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập công việc mới"
          onPressEnter={addTodo}
        />
        <Button type="primary" onClick={addTodo}>
          Thêm
        </Button>
      </div>

      <List
        className={styles.list}
        dataSource={todos}
        renderItem={todo => (
          <List.Item
            actions={[
              <Button 
                type="link"
                icon={<EditOutlined />}
                onClick={() => startEdit(todo)}
              />,
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteTodo(todo.id)}
              />
            ]}
          >
            {editingId === todo.id ? (
              <div className={styles.editContainer}>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onPressEnter={saveEdit}
                />
                <Button type="primary" size="small" onClick={saveEdit}>
                  Lưu
                </Button>
                <Button size="small" onClick={cancelEdit}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              >
                <span style={{ 
                  textDecoration: todo.completed ? 'line-through' : 'none' 
                }}>
                  {todo.text}
                </span>
              </Checkbox>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoList;
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pin, X, Check, SquarePlus, Save } from 'lucide-react';
import { useTodoStore } from '../lib/store/useTodoStore';
import { TodoItem } from '../lib/types';

export default function CreateListPage() {
  const router = useRouter();
  const { addList } = useTodoStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<'Personal' | 'Work' | 'Finance' | 'Other'>('Personal');
  const [isPinned, setIsPinned] = useState(false);

  const labels = [
    { id: 'Personal', name: 'Personal' },
    { id: 'Work', name: 'Work' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Other', name: 'Other' },
  ];

  // Dynamic spacing based on todo count
  const getSpacingClass = () => {
    if (todos.length === 0) return 'space-y-44';
    if (todos.length === 1) return 'space-y-44';
    if (todos.length === 2) return 'space-y-32';
    if (todos.length === 3) return 'space-y-24';
    if (todos.length === 4) return 'space-y-16';
    return 'space-y-8';
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSaveList = () => {
    if (!title.trim()) {
      alert('Please enter a title for your list');
      return;
    }
    
    // Add the list with todos directly
    addList(title, selectedLabel, description, isPinned, todos);
    
    // Reset form
    setTitle('');
    setDescription('');
    setTodos([]);
    setNewTodoText('');
    setIsPinned(false);
    setSelectedLabel('Personal');
    
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => router.push('/home')}
          className="p-2"
        >
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>

        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isPinned
              ? 'bg-black text-white border-black'
              : 'border border-gray-300 text-gray-700'
          }`}
        >
          <Pin className="w-4 h-4" />
          {isPinned ? 'Pinned' : 'Pin'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 lg:px-80">
        {/* Title Input */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-xl font-bold text-black mb-1 outline-none bg-transparent placeholder:text-gray-400"
            autoFocus
          />
          <hr className="text-gray-300" />
        </div>

        {/* Todo List - Dynamic spacing */}
        <div className={`mb-8 ${getSpacingClass()}`}>
          {/* Existing Todos */}
          <div className="space-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 group">
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 ${
                    todo.completed
                      ? 'bg-black border-black'
                      : 'border-gray-400'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>

                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => {
                    const updatedTodos = todos.map(t =>
                      t.id === todo.id ? { ...t, text: e.target.value } : t
                    );
                    setTodos(updatedTodos);
                  }}
                  className={`flex-1 text-base bg-transparent outline-none ${
                    todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                  }`}
                />

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Todo */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add new todo item..."
              className="flex-1 text-base text-gray-600 outline-none bg-transparent py-1"
            />
            <button
              onClick={handleAddTodo}
              disabled={!newTodoText.trim()}
              className="p-2 disabled:opacity-30"
            >
              <SquarePlus className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Description Input */}
        <div className="mb-8">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-none focus:border-black resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="mb-8">
          <button
            onClick={handleSaveList}
            className="w-full bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save List
          </button>
        </div>
      </div>

      {/* Choose a label Section - Fixed at bottom */}
      <div className="px-5 py-6 border-gray-200 min-h-[30vh] lg:px-80 flex flex-col">
        <h2 className="lg:text-xl text-lg font-bold text-black mb-2">Choose a label</h2>

        <div className="flex-1 flex flex-col justify-end">
          <div className="grid grid-cols-4 gap-2">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => setSelectedLabel(label.id as 'Personal' | 'Work' | 'Finance' | 'Other')}
                className={`lg:py-3 px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                  selectedLabel === label.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
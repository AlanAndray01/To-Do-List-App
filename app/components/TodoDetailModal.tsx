'use client';

import { X, Check, Pin, Edit2, Save, SquarePlus } from 'lucide-react';
import { TodoList } from '../lib/types';
import { useTodoStore } from '../lib/store/useTodoStore';
import { useState, useEffect } from 'react';

interface ListDetailModalProps {
  list: TodoList | null;
  onClose: () => void;
}

interface EditableTodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function ListDetailModal({ list, onClose }: ListDetailModalProps) {
  const { lists, togglePin, toggleTodo, updateList } = useTodoStore();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Get the current list from store to show real-time updates
  const currentList = lists.find(l => l?.id === list?.id) || list;
  
  // Editable states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTodos, setEditTodos] = useState<EditableTodoItem[]>([]);
  const [editLabel, setEditLabel] = useState<'Personal' | 'Work' | 'Finance' | 'Other'>('Personal');
  const [newTodoText, setNewTodoText] = useState('');

  const labels = [
    { id: 'Personal', name: 'Personal' },
    { id: 'Work', name: 'Work' },
    { id: 'Finance', name: 'Finance' },
    { id: 'Other', name: 'Other' },
  ];

  useEffect(() => {
    if (currentList) {
      setEditTitle(currentList.title);
      setEditDescription(currentList.description || '');
      setEditTodos(currentList.todos);
      setEditLabel(currentList.label);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentList?.id]);

  // Update edit states when switching modes
  useEffect(() => {
    if (currentList && !isEditMode) {
      setEditTitle(currentList.title);
      setEditDescription(currentList.description || '');
      setEditTodos(currentList.todos);
      setEditLabel(currentList.label);
      setNewTodoText('');
    }
  }, [isEditMode, currentList]);

  if (!currentList) return null;

  const handlePinClick = () => {
    togglePin(currentList.id);
  };

  const handleTodoToggle = (todoId: string) => {
    if (isEditMode) {
      // In edit mode, update local state
      setEditTodos(editTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ));
    } else {
      // In view mode, update store directly (instant update)
      toggleTodo(currentList.id, todoId);
    }
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo: EditableTodoItem = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      createdAt: new Date(),
    };
    
    setEditTodos([...editTodos, newTodo]);
    setNewTodoText('');
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    // Update the list in store
    updateList(currentList.id, {
      title: editTitle,
      description: editDescription,
      label: editLabel,
      todos: editTodos,
    });

    setIsEditMode(false);
  };

  const handleCancel = () => {
    // Reset to original values from store
    setEditTitle(currentList.title);
    setEditDescription(currentList.description || '');
    setEditTodos(currentList.todos);
    setEditLabel(currentList.label);
    setNewTodoText('');
    setIsEditMode(false);
  };

  const displayTitle = isEditMode ? editTitle : currentList.title;
  const displayDescription = isEditMode ? editDescription : currentList.description;
  const displayTodos = isEditMode ? editTodos : currentList.todos;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md md:max-w-sm lg:max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header with Edit, Pin and Close buttons */}
          <div className="flex justify-end items-start p-6 pb-2 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {!isEditMode && (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handlePinClick}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      currentList.pinned
                        ? 'bg-black text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                    {currentList.pinned ? 'Pinned' : 'Pin'}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="px-6 mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-bold text-black outline-none border-b-2 border-gray-300 focus:border-black pb-1"
                placeholder="Title"
              />
            ) : (
              <h2 className="text-xl font-bold text-black">{displayTitle}</h2>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Todos - Above description */}
            {displayTodos.length === 0 && !isEditMode ? (
              <p className="text-center text-gray-600 py-4">No todos in this list</p>
            ) : (
              <div className="space-y-3">
                {displayTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleTodoToggle(todo.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          todo.completed
                            ? 'bg-black border-black'
                            : 'border-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {todo.completed && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </button>
                      <div className="flex-1">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={todo.text}
                            onChange={(e) => {
                              setEditTodos(editTodos.map(t =>
                                t.id === todo.id ? { ...t, text: e.target.value } : t
                              ));
                            }}
                            className={`w-full font-bold text-black bg-transparent border-b border-gray-300 focus:border-black outline-none ${
                              todo.completed ? 'line-through text-gray-500' : ''
                            }`}
                          />
                        ) : (
                          <p
                            className={`font-bold text-black ${
                              todo.completed ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {todo.text}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(todo.createdAt).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Todo (only in edit mode) */}
            {isEditMode && (
              <div className="flex items-center gap-2 py-2">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="Add new todo item..."
                  className="flex-1 text-base text-gray-600 outline-none bg-transparent py-1 border-b border-gray-300 focus:border-black"
                />
                <button
                  onClick={handleAddTodo}
                  disabled={!newTodoText.trim()}
                  className="p-2 disabled:opacity-30 hover:bg-gray-100 rounded transition-colors"
                >
                  <SquarePlus className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            )}

            {/* Description - Below todos */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              {isEditMode ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-black resize-y"
                />
              ) : (
                <div className="max-h-40 overflow-y-auto"> {/* Added scrollable container */}
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {displayDescription || 'No description'}
                  </p>
                </div>
              )}
            </div>

            {/* Label Selection (only in edit mode) */}
            {isEditMode && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Label</h3>
                <div className="grid grid-cols-4 gap-2">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => setEditLabel(label.id as 'Personal' | 'Work' | 'Finance' | 'Other')}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        editLabel === label.id
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons - Only in Edit Mode */}
          {isEditMode && (
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
'use client';

import { X, Check, Pin } from 'lucide-react';
import { TodoList } from '../lib/types';
import { useTodoStore } from '../lib/store/useTodoStore';
import { useState, useEffect } from 'react';

interface ListDetailModalProps {
  list: TodoList | null;
  onClose: () => void;
}

export default function ListDetailModal({ list, onClose }: ListDetailModalProps) {
  const { togglePin, toggleTodo, deleteTodo } = useTodoStore();
  const [currentList, setCurrentList] = useState(list);

  useEffect(() => {
    setCurrentList(list);
  }, [list]);

  if (!currentList) return null;

  const handlePinClick = () => {
    togglePin(currentList.id);
    setCurrentList({
      ...currentList,
      pinned: !currentList.pinned
    });
  };

  const handleTodoToggle = (todoId: string) => {
    toggleTodo(currentList.id, todoId);
    setCurrentList({
      ...currentList,
      todos: currentList.todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo(currentList.id, todoId);
    setCurrentList({
      ...currentList,
      todos: currentList.todos.filter(todo => todo.id !== todoId)
    });
  };

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
          {/* Header with Pin and Close buttons on top-right */}
          <div className="flex justify-end items-start p-6 pb-2 sticky top-0 bg-white">
            <div className="flex items-center gap-2">
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
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>

          {/* Title below buttons */}
          <div className="px-6">
            <h2 className="text-xl font-bold text-black">{currentList.title}</h2>
          </div>

          {/* Content */}
          <div className="p-6 pt-4 space-y-4">
            {/* Todos - Now ABOVE description */}
            {currentList.todos.length === 0 ? (
              <p className="text-center text-gray-600">No todos in this list</p>
            ) : (
              <div className="space-y-3">
                {currentList.todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group relative"
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
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p
                          className={`font-bold text-black ${
                            todo.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {todo.text}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(todo.createdAt).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {/* Delete button in top-right corner */}
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                        aria-label="Delete todo"
                      >
                        <X className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description - Now BELOW todos */}
            {currentList.description && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentList.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
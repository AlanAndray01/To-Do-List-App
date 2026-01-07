'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTodoStore } from '../lib/store/useTodoStore';
import ListDetailModal from '@/app/components/TodoDetailModal';
import { TodoList, TodoItem } from '../lib/types';

export default function SearchPage() {
  const router = useRouter();
  const { lists } = useTodoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);

  // Filter lists AND todos based on search query
  const searchResults = searchQuery.trim() 
    ? lists
        .map((list) => {
          // Check if list title matches
          const listMatches = list.title.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Check if any todo in this list matches
          const matchingTodos = list.todos.filter((todo) =>
            todo.text.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          // If list title matches OR has matching todos, include it
          if (listMatches || matchingTodos.length > 0) {
            return {
              ...list,
              matchingTodos, // Store which todos matched
              showMatchingTodos: matchingTodos.length > 0 // Flag to show todos
            };
          }
          return null;
        })
        .filter((list) => list !== null) as (TodoList & { 
          matchingTodos: TodoItem[]; 
          showMatchingTodos: boolean;
        })[]
    : [];

  // Label colors
  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Personal':
        return 'bg-amber-100 border-amber-200';
      case 'Work':
        return 'bg-green-100 border-green-200';
      case 'Finance':
        return 'bg-purple-100 border-purple-200';
      case 'Other':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const handleCancel = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 md:px-8 lg:px-12">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your list or todos"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-600"
            autoFocus
          />
        </div>
        <button
          onClick={handleCancel}
          className="text-gray-700 font-medium hover:text-black transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Search Results - Only show when there's a query */}
      {searchQuery.trim() && (
        <div className="px-4 py-4 md:px-8 lg:px-12">
          {searchResults.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No lists or todos found matching &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((list) => (
                <div key={list.id} className="space-y-2">
                  {/* List Card */}
                  <div
                    onClick={() => setSelectedList(list)}
                    className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${getLabelColor(
                      list.label
                    )}`}
                  >
                    <h3 className="text-lg font-bold text-black mb-2">{list.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-black text-white text-xs rounded-md font-medium">
                        {list.label}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                        </svg>
                        {formatDate(list.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Show matching todos if any */}
                  {list.showMatchingTodos && list.matchingTodos.length > 0 && (
                    <div className="ml-4 pl-4 border-l-2 border-gray-300 space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Matching todos:</p>
                      {list.matchingTodos.map((todo) => (
                        <div 
                          key={todo.id} 
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                        >
                          <div className={`w-3 h-3 border rounded ${todo.completed ? 'bg-gray-400 border-gray-400' : 'border-gray-400'}`}></div>
                          <span className={`text-sm ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {todo.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for displaying list details */}
      <ListDetailModal list={selectedList} onClose={() => setSelectedList(null)} />
    </div>
  );
}
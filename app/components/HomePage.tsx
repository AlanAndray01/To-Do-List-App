'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react'; // Added X icon
import { useTodoStore } from '@/app/lib/store/useTodoStore';
import { TodoList } from '@/app/lib/types';
import ListDetailModal from './TodoDetailModal';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pinned'>('all');
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);
  const router = useRouter();
  const { lists, deleteList } = useTodoStore(); // Added deleteList

  // Filter lists based on active tab
  const displayedLists = activeTab === 'pinned' 
    ? lists.filter(list => list.pinned)
    : lists;

  // Label colors
  const getLabelColor = (label: string) => {
    switch(label) {
      case 'Personal': return 'bg-amber-100 border-amber-200';
      case 'Work': return 'bg-green-100 border-green-200';
      case 'Finance': return 'bg-purple-100 border-purple-200';
      case 'Other': return 'bg-gray-100 border-gray-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Handle list deletion
  const handleDeleteList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between md:px-8 md:py-5 lg:px-12 lg:py-6">
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          <div className="w-7 h-7 ml-1 flex items-center justify-center md:w-9 md:h-9 lg:w-10 lg:h-10">
            <Image
              src="https://i.ibb.co/bgnTzV0Y/34.png"
              alt="Dooit Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-black md:text-2xl lg:text-3xl">
            Dooit
          </h1>
        </div>
        <button
          onClick={() => router.push('/search')}
          className="p-2 md:p-3 lg:p-4 cursor-pointer hover:bg-gray-100 rounded transition-colors"
        >
          <Search className="w-5 h-5 text-black md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3 flex justify-between gap-0 md:justify-center md:gap-3 md:px-6 lg:gap-4 lg:px-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-14 py-2 rounded-md text-sm font-medium md:px-20 md:py-3 md:text-base md:rounded-lg lg:px-28 lg:py-3 lg:text-lg cursor-pointer transition-colors ${activeTab === 'all' ? 'bg-black text-white hover:bg-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All List
        </button>
        
        <button
          onClick={() => setActiveTab('pinned')}
          className={`px-14 py-2 rounded-md text-sm font-medium md:px-20 md:py-3 md:text-base md:rounded-lg lg:px-28 lg:py-3 lg:text-lg cursor-pointer transition-colors ${activeTab === 'pinned' ? 'bg-black text-white hover:bg-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Pinned
        </button>
      </div>

      {/* Lists or Empty State */}
      {displayedLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 pt-20">
          <div className="w-80 mb-2 md:w-96 md:mb-8 lg:w-md lg:mb-10">
            <Image
              src={
                activeTab === 'pinned'
                  ? 'https://i.ibb.co/VpjZv99t/Group-42.png'
                  : 'https://i.ibb.co/7J7Yxgg8/todo-svg.png'
              }
              alt={activeTab === 'pinned' ? 'No pinned lists' : 'Woman working'}
              width={288}
              height={288}
              className="w-full h-full"
            />
          </div>

          <p className="text-black text-lg font-bold mt-12 mb-6 lg:mt-14 lg:text-2xl">
            {activeTab === 'pinned' ? 'Ooops! No pinned list yet...' : 'Create your first to-do list...'}
          </p>

          <button
            onClick={() => router.push('/new-list')}
            className="bg-black w-40 text-white lg:text-lg px-5 py-2.5 rounded-lg font-medium flex justify-center items-center gap-3 hover:bg-gray-800 transition-colors mb-14 lg:w-50"
          >
            <span className="text-lg font-bold lg:text-3xl">+</span>
            New List
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 py-4 space-y-3 md:px-8 lg:px-80 pb-20">
            {displayedLists.map((list) => (
              <div
                key={list.id}
                onClick={() => setSelectedList(list)}
                className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all relative group ${getLabelColor(list.label)}`}
              >
                {/* Delete Button - Top Right Corner */}
                <button
                  onClick={(e) => handleDeleteList(list.id, e)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-300 rounded z-10"
                  aria-label="Delete list"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                <h3 className="text-lg font-bold text-black mb-2 pr-6">{list.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-black text-white text-xs rounded-md font-medium">
                    {list.label}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                    </svg>
                    {formatDate(list.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Plus Button - Only shown when lists exist */}
          <button
            onClick={() => router.push('/new-list')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all hover:scale-110 z-50"
          >
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Modal for displaying list details */}
      <ListDetailModal
        list={selectedList}
        onClose={() => setSelectedList(null)}
      />
    </div>
  );
}
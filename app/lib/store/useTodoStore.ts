import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoList, LabelType, TodoItem } from '../types';

interface TodoStore {
  lists: TodoList[];
  addList: (title: string, label: LabelType, description?: string, pinned?: boolean, todos?: TodoItem[]) => void;
  deleteList: (id: string) => void;
  togglePin: (id: string) => void;
  addTodo: (listId: string, text: string) => void;
  toggleTodo: (listId: string, todoId: string) => void;
  deleteTodo: (listId: string, todoId: string) => void;
  updateListTitle: (id: string, title: string) => void;
  updateListLabel: (id: string, label: LabelType) => void;
  updateListDescription: (id: string, description: string) => void;
  updateList: (id: string, updates: Partial<TodoList>) => void;
  updateTodoText: (listId: string, todoId: string, text: string) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      lists: [],
      
      addList: (title, label, description = '', pinned = false, todos = []) => set((state) => ({
        lists: [...state.lists, {
          id: Date.now().toString(),
          title,
          label,
          description,
          todos: todos.map(todo => ({
            ...todo,
            createdAt: todo.createdAt || new Date(),
          })),
          pinned,
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),
      
      deleteList: (id) => set((state) => ({
        lists: state.lists.filter(list => list.id !== id)
      })),
      
      togglePin: (id) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, pinned: !list.pinned, updatedAt: new Date() } : list
        )
      })),
      
      addTodo: (listId, text) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                todos: [...list.todos, {
                  id: Date.now().toString(),
                  text,
                  completed: false,
                  createdAt: new Date(),
                }],
                updatedAt: new Date(),
              }
            : list
        )
      })),
      
      toggleTodo: (listId, todoId) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                todos: list.todos.map(todo => 
                  todo.id === todoId 
                    ? { ...todo, completed: !todo.completed }
                    : todo
                ),
                updatedAt: new Date(),
              }
            : list
        )
      })),
      
      deleteTodo: (listId, todoId) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                todos: list.todos.filter(todo => todo.id !== todoId),
                updatedAt: new Date(),
              }
            : list
        )
      })),
      
      updateListTitle: (id, title) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, title, updatedAt: new Date() } : list
        )
      })),
      
      updateListLabel: (id, label) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, label, updatedAt: new Date() } : list
        )
      })),
      
      updateListDescription: (id, description) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, description, updatedAt: new Date() } : list
        )
      })),
      
      updateList: (id, updates) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, ...updates, updatedAt: new Date() } : list
        )
      })),
      
      updateTodoText: (listId, todoId, text) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                todos: list.todos.map(todo => 
                  todo.id === todoId ? { ...todo, text } : todo
                ),
                updatedAt: new Date(),
              }
            : list
        )
      })),
    }),
    {
      name: 'dooit-storage',
    }
  )
);
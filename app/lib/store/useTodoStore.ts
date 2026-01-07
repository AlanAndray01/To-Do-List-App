import { create } from 'zustand';
import { TodoList, LabelType } from '../types';

interface TodoStore {
  lists: TodoList[];
  addList: (title: string, label: LabelType, description?: string, pinned?: boolean) => void;
  deleteList: (id: string) => void;
  togglePin: (id: string) => void;
  addTodo: (listId: string, text: string) => void;
  toggleTodo: (listId: string, todoId: string) => void;
  deleteTodo: (listId: string, todoId: string) => void;
  updateListTitle: (id: string, title: string) => void;
  updateListLabel: (id: string, label: LabelType) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  lists: [],
  addList: (title, label, description = '', pinned = false) => set((state) => ({
    lists: [...state.lists, {
      id: Date.now().toString(),
      title,
      label,
      description,
      todos: [],
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
      list.id === id ? { ...list, pinned: !list.pinned } : list
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
}));
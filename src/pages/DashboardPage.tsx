import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { todoAPI, Todo, PaginationInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const fetchTodos = async (page: number = 1, searchQuery: string = "") => {
    setLoading(true);
    try {
      const response = await todoAPI.getTodos(page, 10, searchQuery);
      setTodos(response.todos);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(1, searchTerm);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(search);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    try {
      await todoAPI.updateTodo(todo._id, {
        status: todo.status === "pending" ? "done" : "pending",
      });
      fetchTodos(pagination.page, searchTerm);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await todoAPI.deleteTodo(id);
        fetchTodos(pagination.page, searchTerm);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Todo App V2</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Hi, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search and Add Button */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Todos</h2>
              <p className="text-gray-600 mt-1">
                Manage your tasks efficiently
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search todos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
              {searchTerm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setSearchTerm("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Todos List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : todos.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <Check className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No todos yet</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "No todos found matching your search."
                    : "Get started by creating your first todo!"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Todo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4">
              {todos.map((todo) => (
                <Card
                  key={todo._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <button
                          onClick={() => handleToggleStatus(todo)}
                          className={`mt-1 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                            todo.status === "done"
                              ? "bg-primary border-primary"
                              : "border-gray-300 hover:border-primary"
                          }`}
                        >
                          {todo.status === "done" && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-semibold ${
                              todo.status === "done"
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className="text-gray-600 mt-1 text-sm">
                              {todo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-3">
                            <Badge
                              variant={
                                todo.status === "done" ? "secondary" : "default"
                              }
                            >
                              {todo.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(todo)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(todo._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchTodos(pagination.page - 1, searchTerm)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchTodos(pagination.page + 1, searchTerm)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Todo Modal */}
      <AddTodoModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchTodos(1, searchTerm);
        }}
      />

      {/* Edit Todo Modal */}
      {selectedTodo && (
        <EditTodoModal
          open={isEditModalOpen}
          todo={selectedTodo}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTodo(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedTodo(null);
            fetchTodos(pagination.page, searchTerm);
          }}
        />
      )}
    </div>
  );
};

// Add Todo Modal Component
const AddTodoModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      await todoAPI.createTodo({ title, description });
      setTitle("");
      setDescription("");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
          <DialogDescription>
            Create a new task to keep track of your work.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Todo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Todo Modal Component
const EditTodoModal: React.FC<{
  open: boolean;
  todo: Todo;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ open, todo, onClose, onSuccess }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [status, setStatus] = useState(todo.status);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      await todoAPI.updateTodo(todo._id, { title, description, status });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Update your task details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="edit-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="edit-title"
              type="text"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "done")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Todo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaCheck, FaTrash, FaClipboard, FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import "./Styling.css";

function TodoApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [activeAuth, setActiveAuth] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  // Initialize date and time
  useEffect(() => {
    const now = new Date();
    const defaultDate = now.toISOString().split("T")[0];
    const defaultTime = now.toTimeString().substring(0, 5);
    setTaskDate(defaultDate);
    setTaskTime(defaultTime);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("todoAppCurrentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        
        const storedTasks = localStorage.getItem(`todoAppTasks_${user.username}`);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoggedIn && currentUser && typeof window !== 'undefined') {
      localStorage.setItem(`todoAppTasks_${currentUser.username}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser, isLoggedIn]);

  const filteredTasks = tasks.filter(
    (task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("todoAppCurrentUser");
    }
  };

  const validateForm = () => {
    if (!newTask.trim()) {
      setFormError("Task title is required");
      return false;
    }
    if (taskDate && taskTime) {
      const taskDateTime = new Date(`${taskDate}T${taskTime}`);
      if (taskDateTime < new Date()) {
        setFormError("Cannot schedule tasks in the past");
        return false;
      }
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dateTime =
      taskDate && taskTime
        ? new Date(`${taskDate}T${taskTime}`).toISOString()
        : new Date().toISOString();

    const updatedTasks = [
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        description: taskDescription,
        date: taskDate,
        time: taskTime,
        dateTime: dateTime,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setTasks(updatedTasks);
    setNewTask("");
    setTaskDescription("");
    setFormError("");

    const now = new Date();
    setTaskDate(now.toISOString().split("T")[0]);
    setTaskTime(now.toTimeString().substring(0, 5));
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const toggleAuthMode = () => {
    setActiveAuth(!activeAuth);
    setAuthError('');
  };
  
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    
    const users = JSON.parse(localStorage.getItem('todoAppUsers') || '[]');
    const user = users.find(u => 
      u.username === authFormData.username && u.password === authFormData.password
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('todoAppCurrentUser', JSON.stringify(user));
      
      const storedTasks = localStorage.getItem(`todoAppTasks_${user.username}`) || '[]';
      setTasks(JSON.parse(storedTasks));
      
      setAuthError('');
    } else {
      setAuthError('Invalid username or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    
    const users = JSON.parse(localStorage.getItem('todoAppUsers') || '[]');
    
    const userExists = users.some(u => 
      u.username === authFormData.username || u.email === authFormData.email
    );

    if (userExists) {
      setAuthError('Username or email already exists');
      return;
    }

    const newUser = {
      username: authFormData.username,
      email: authFormData.email,
      password: authFormData.password
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('todoAppUsers', JSON.stringify(updatedUsers));
    
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('todoAppCurrentUser', JSON.stringify(newUser));
    localStorage.setItem(`todoAppTasks_${newUser.username}`, JSON.stringify([]));
    setTasks([]);
    setAuthError('');
  };

  if (!isLoggedIn) {
    return (
      <div className={`wrapper ${activeAuth ? "active" : ""}`}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            {authError && <div className="error-message">{authError}</div>}
            <div className="input-box">
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                required 
                value={authFormData.username}
                onChange={handleAuthChange}
              />
              <FaUserAlt className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                required 
                value={authFormData.password}
                onChange={handleAuthChange}
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
              <p>Don't have an account? <a href="#" onClick={toggleAuthMode}>Register</a></p>
            </div>
          </form>
        </div>

        {/* Registration Form */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
            {authError && <div className="error-message">{authError}</div>}
            <div className="input-box">
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                required 
                value={authFormData.username}
                onChange={handleAuthChange}
              />
              <FaUserAlt className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                required 
                value={authFormData.email}
                onChange={handleAuthChange}
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                required 
                value={authFormData.password}
                onChange={handleAuthChange}
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />I agree to terms & conditions
              </label>
            </div>
            <button type="submit">Register</button>
            <div className="register-link">
              <p>Already have an account? <a href="#" onClick={toggleAuthMode}>Login</a></p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="w-full max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My To-Do-List
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Welcome, {currentUser.username}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto text-sm bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 font-medium shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
            />
            <FaSearch className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {formError}
              </div>
            )}

            <input
              type="text"
              placeholder="Task title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
            />

            <textarea
              placeholder="Task description (optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200 resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-700 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!newTask.trim()}
              className="w-full p-3 sm:p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Add Task
            </button>
          </form>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto flex-grow">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 sm:p-5 transition-all duration-150 hover:bg-gray-50 ${
                  task.completed ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`flex-shrink-0 h-6 w-6 rounded-full border-2 ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-indigo-300"
                    } flex items-center justify-center transition-all duration-200`}
                  >
                    {task.completed && (
                      <FaCheck className="h-4 w-4 text-white" />
                    )}
                  </button>

                  <div className="flex-grow w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <span
                        className={`block text-base sm:text-lg font-medium ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {task.text}
                      </span>
                      {task.date && (
                        <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                          {new Date(task.dateTime).toLocaleDateString()} at{" "}
                          {task.time}
                        </div>
                      )}
                    </div>

                    {task.description && (
                      <p
                        className={`mt-2 text-sm sm:text-base text-gray-600 ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 self-start sm:self-center"
                  >
                    <FaTrash className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 sm:p-10 text-center flex flex-col items-center justify-center">
              <FaClipboard className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-700">
                {searchTerm ? "No tasks found" : "No tasks yet"}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "Add your first task above to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
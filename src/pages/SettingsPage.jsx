import { useState, useEffect } from 'react';
import { Sun, Moon, Lock, Mail, User, Bell, Shield, Eye, EyeOff, ChevronRight, Save, Smartphone } from 'lucide-react';
import Tab from '../components/Tab';
import ChangePassForm from '../components/ChangePassForm';
export default function SettingsPage() {
  // Get system preference for dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || prefersDarkMode
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: 'user@example.com',
    newEmail: '',
  });
  const [activeTab, setActiveTab] = useState('general');
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Apply dark mode to document when component mounts and when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving
    setTimeout(() => {
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    }, 600);
  };

  const notificationTypes = [
    { id: 'emailNotif', label: 'Email notifications', defaultChecked: true },
    { id: 'pushNotif', label: 'Push notifications', defaultChecked: true },
    { id: 'smsNotif', label: 'SMS notifications', defaultChecked: true },
    { id: 'activityNotif', label: 'Activity notifications', defaultChecked: false },
    { id: 'marketingNotif', label: 'Marketing emails', defaultChecked: false },
  ];

  return (
    <div className="py-6 bg-gray-100   transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white  rounded-lg ">
            <nav className="p-4 space-y-1">
              <button 
                onClick={() => setActiveTab('general')}
                className={`flex items-center px-3 py-2 w-full rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'general' 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <User size={18} className="mr-3" />
                <span>General</span>
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center px-3 py-2 w-full rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'security' 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Shield size={18} className="mr-3" />
                <span>Security</span>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-3 py-2 w-full rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'notifications' 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bell size={18} className="mr-3" />
                <span>Notifications</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Saved notification */}
            {showSavedMessage && (
              <div className="fixed top-20 right-4 bg-green-100 border border-green-200 text-green-800 dark:bg-green-800 dark:border-green-700 dark:text-green-100 px-4 py-3 rounded-md shadow-md flex items-center z-50">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Settings saved successfully!
              </div>
            )}

            {activeTab === 'general' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Account Settings</h2>
                <form onSubmit={handleSubmit}>
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      {darkMode ? <Moon size={20} className="mr-3 text-indigo-400" /> : <Sun size={20} className="mr-3 text-indigo-600" />}
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Dark Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  {/* Personal Info
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Personal Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name} 
                          onChange={handleInputChange} 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number
                        </label>
                        <div className="flex items-center">
                          <Smartphone size={18} className="text-gray-400 dark:text-gray-500 mr-2" />
                          <input 
                            type="text" 
                            name="phone"
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  
                  {/* Email settings */}
                  <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Email Settings</h3>
                    
                    <div className="mb-4 p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail size={18} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-200">{formData.email}</span>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Primary</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Email Address
                      </label>
                      <input 
                        type="email" 
                        name="newEmail"
                        value={formData.newEmail} 
                        onChange={handleInputChange} 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
                        placeholder="Enter new email address" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      type="submit" 
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <Tab tapName={"security"} >
                <ChangePassForm  />
              </Tab>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notification Settings</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Control how and when you receive notifications from SocialApp.
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    {notificationTypes.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center justify-between py-3 ${
                          index < notificationTypes.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                        }`}
                      >
                        <div>
                          <label htmlFor={item.id} className="text-gray-700 dark:text-gray-200 font-medium cursor-pointer">
                            {item.label}
                          </label>
                          {item.id === 'marketingNotif' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Receive updates about new features and promotions
                            </p>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            id={item.id}
                            type="checkbox" 
                            className="sr-only peer" 
                            defaultChecked={item.defaultChecked} 
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Notification Schedule</h3>
                    
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quiet Hours
                      </label>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                          <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
                            <option>10:00 PM</option>
                            <option>11:00 PM</option>
                            <option>12:00 AM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                          <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
                            <option>6:00 AM</option>
                            <option>7:00 AM</option>
                            <option>8:00 AM</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        During quiet hours, you'll only receive notifications from people you've marked as priority
                      </p>
                    </div>
                  </div>
                   */}
                  <div className="mt-6">
                    <button 
                      type="submit" 
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
                    >
                      <Save size={16} className="mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
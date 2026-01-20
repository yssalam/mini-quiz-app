import { User, Settings, History, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Dropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // Get logout function dari Zustand store
    const logout = useAuthStore(state => state.logout);

    const handleLogout = async () => {
        try {
            await logout(); // Hapus token dan clear state
            navigate('/login'); // Redirect ke login
            setShowDropdown(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfile = () => {
        navigate('/profile');
        setShowDropdown(false);
    };

    const handleHistory = () => {
        navigate('/quiz/history');
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
            >
                <User className="w-6 h-6 text-gray-700" />
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Profile  */}
                    <button
                        onClick={handleProfile}
                        className="w-full px-4 py-3 flex gap-3 items-center text-gray-700
                                                        bg-transparent border-0  
                                                        hover:bg-gray-50"
                    >
                        <Settings className="w-4 h-4" />
                        <span>Profile</span>
                    </button>

                    <button
                        onClick={handleHistory}
                        className="w-full px-4 py-3 flex gap-3 items-center text-gray-700
                                                        bg-transparent border-0  
                                                        hover:bg-gray-50"
                    >
                        <History className="w-4 h-4" />
                        <span>History</span>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gray-200" />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 flex gap-3 items-center text-gray-700
                                                        bg-transparent border-0  
                                                        hover:bg-red-50"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
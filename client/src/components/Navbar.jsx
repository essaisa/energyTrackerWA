import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-green-600">
                        Energy Tracker
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium">
                            Dashboard
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-green-600 font-medium">
                            Profile
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="md:hidden text-gray-700 focus:outline-none">
                        {isOpen ? "✖" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-gray-100 p-4">
                    <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-green-600">
                        Dashboard
                    </Link>
                    <Link to="/profile" className="block py-2 text-gray-700 hover:text-green-600">
                        Profile
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="w-full bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

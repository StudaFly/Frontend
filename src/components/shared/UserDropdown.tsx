import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserDropdownProps {
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    onLogout: () => void;
}

export function UserDropdown({ isDropdownOpen, setIsDropdownOpen, onLogout }: UserDropdownProps) {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition-colors hover:bg-slate-50 hover:border-secondary"
            >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                    {user.avatarType === "image" && user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : user.avatarType === "emoji" && user.avatar ? (
                        <span className="text-base leading-none">{user.avatar}</span>
                    ) : (
                        <User className="h-4 w-4 text-gray-500" />
                    )}
                </div>
                <span className="text-sm font-semibold text-gray-700">Options</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="border-b border-gray-100 px-4 py-3 text-sm">
                        <p className="truncate font-heading font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="truncate text-gray-500">{user.email}</p>
                    </div>
                    <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <User className="mr-2 h-4 w-4" />
                        Mon profil
                    </Link>
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                    </button>
                </div>
            )}
        </>
    );
}

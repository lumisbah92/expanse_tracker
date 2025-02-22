import React from 'react';

interface HeaderProps {
  dropdownOpen: boolean;
  setDropdownOpen: (dropdownOpen: boolean) => void;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ dropdownOpen, setDropdownOpen, logout }) => {
  return (
    <div className="sticky top-0 bg-white z-10 w-full h-[72px] border-b border-gray-300 flex items-center justify-between px-2">
      <div className="h-20 flex items-center">
        {/* Visible only on small screens */}
        <div className="flex md:hidden">
          <div className="text-[26px] font-semibold leading-[31.47px] tracking-wide text-[#243642]">
            Expense<span className='text-primaryColor'>Tracker</span>
          </div>
        </div>
      </div>
      <div className="relative flex items-center gap-3">
        {/* Mobile navigation links, visible only on small screens */}
        <div className="flex md:hidden gap-2">
          <button
            onClick={() => (window.location.href = '/')}
            className="text-gray-600 hover:text-gray-800"
          >
            Dashboard
          </button>
          <button
            onClick={() => (window.location.href = '/transactions')}
            className="text-gray-600 hover:text-gray-800"
          >
            Transactions
          </button>
        </div>
        <img
          src="/assets/images/profile.png"
          alt="profile"
          className="w-10 h-10 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-1 p-1 bg-white shadow-lg rounded z-10">
            <button onClick={logout} className="w-full text-left hover:bg-gray-100 p-2">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

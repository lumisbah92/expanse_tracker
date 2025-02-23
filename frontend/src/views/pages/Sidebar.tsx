import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface SideBarProps {
  navItems: NavItem[];
}

const SideBar: React.FC<SideBarProps> = ({ navItems }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex flex-col w-full h-full border-r border-gray-200 p-2 max-w-[180px] lg:max-w-[280px]">
      <div className="sticky top-0 z-10">
        <div className="h-16 flex items-center pl-2">
          <div className="text-[24px] font-semibold leading-[31.47px] tracking-wide text-[#243642]">Expense<span className='text-primaryColor'>Tracker</span></div>
        </div>
        <ul>
          <p className="text-gray-500 p-2 pt-7 text-sm font-medium">Overview</p>
          {navItems.map(({ label, path, icon }) => (
            <li key={label} className="m-0 p-0">
              <button className="flex items-center p-2 hover:bg-gray-200 hover:rounded-[8px] w-full text-left" onClick={() => navigate(path)}>
                <div dangerouslySetInnerHTML={{ __html: icon }} />
                <span className="text-sm font-medium text-gray-600 ml-2">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;

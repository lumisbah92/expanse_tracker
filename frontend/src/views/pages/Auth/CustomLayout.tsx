import React, { ReactNode } from 'react';

interface CustomLayoutProps {
  children: ReactNode; // Define the type of children
}

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row-2 items-center justify-center h-screen w-full font-inter">
      <div className="absolute top-10 left-10 xl:left-36 text-[26px] font-semibold leading-[31.47px] tracking-wide text-[#243642]">
        Expense<span className='text-primaryColor'>Tracker</span>
      </div>
      {/* Left Panel */}
      <div className="w-full flex items-center justify-center px-10 box-border xl:justify-start xl:pl-56 md:w-1/2">
        <div className="w-full sm:w-[329px]">
          {children}
        </div>
      </div>
      {/* Right Panel */}
      <img className={"w-1/2 h-full hidden sm:block"} src={"/assets/images/image4.webp"} />
    </div>
  );
};

export default CustomLayout;

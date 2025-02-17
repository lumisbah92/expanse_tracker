import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import svgIcons from '../services/svgService';
import cn from '../utils/cn';
import RNavItemRC from './sidebar/NavItemRC';
import Button from './buttons/ButtonRC';
import RippleDivRC from './effect/ripple/div/RippleDivRC';
// import { Signal, useSignal } from '@preact/signals-react';

interface Props {
    bgLeftWhite?: boolean
    bgFullWhite?: boolean
    isPaid?: boolean
}

const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact Us', href: '/contact-us' },
    // { name: 'Sign In', href: '/sign-in' },
    // { name: 'Sign Up', href: '/sign-up' },
];
const profileRoutes = [
    { path: "/profile/personal-info", label: "Personal Information", icon: svgIcons.small_user },
    { path: "/profile/saved-file", label: "Saved File", icon: svgIcons.small_folder },
    { path: "/profile/payment", label: "Payment", icon: svgIcons.small_creditCard },
    { path: "/profile/notification", label: "Notification", icon: svgIcons.small_bell },
    { path: "/profile/logout", label: "Log Out", icon: svgIcons.small_logout },
];
const navWidth: any = {
    true: 'block w-48',
    false: 'w-0',
};

const Sidebar = ({ isExpanded }: { isExpanded: boolean }) => (
    <div
        className={cn(
            'lg:hidden fixed inset-y-0 right-[-1px] h-screen z-40 flex flex-col bg-gray-500 duration-500 ease-in-out',
            navWidth[String(isExpanded)]
        )}
    >
        <div className={`text-primaryColor flex h-[10%] items-center justify-between px-4 py-8 text-[26px] font-semibold leading-[31.47px] tracking-wide`}>
            LeaseDrop
        </div>

        {/* Add this wrapper for scrollable nav */}
        <nav className=" h-[74%] space-y-1 p-2">
            {navItems.map((item) => (
                <RNavItemRC
                    key={item.name}
                    name={item.name}
                    route={item.href ?? ''}
                    isExpanded={isExpanded}
                    isActive={window.location.pathname === item.href}
                />
            ))}
        </nav>
        <div
            className={cn('border-t ml-2 p-4 h-[8%] text-textColor cursor-pointer items-center gap-2 flex', {
                'justify-center ml-0': !isExpanded,
            })}
        >
            <RNavItemRC
                key={"Sign In"}
                name={"Sign In"}
                route={"/sign-in"}
                isExpanded={isExpanded}
                isActive={window.location.pathname === "/sign-in"}
            />
        </div>
        <div
            className={cn('border-t ml-2 p-4 h-[8%] text-textColor cursor-pointer items-center gap-2 flex', {
                'justify-center ml-0': !isExpanded,
            })}
        >
            <RNavItemRC
                key={"Sign Up"}
                name={"Sign Up"}
                route={"/sign-up"}
                isExpanded={isExpanded}
                isActive={window.location.pathname === "/sign-up"}
            />
        </div>
    </div>
);

const ToggleButton = ({ onClickHandler }: { onClickHandler: React.MouseEventHandler<HTMLButtonElement> }) => (
    <Button type="button" onClick={onClickHandler} size="sm" className="pl-0 lg:hidden">
        <RippleDivRC className="flex items-center w-10 h-10 bg-textColor  justify-center rounded-md text-gray-700">
            <span dangerouslySetInnerHTML={{ __html: svgIcons.toggleBlack }} />
        </RippleDivRC>
    </Button>
);

const Header: React.FC<Props> = ({ bgFullWhite = false, isPaid = false }) => {
    const location = useLocation();
    const path = location.pathname.split('/').pop();
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState("");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {
        if (path === "/") setSelectedType("LandingPage");
        else if (path === "sign-in") setSelectedType("Sign In");
        else if (path === "sign-up") setSelectedType("Sign U");
        else if (path === "home") setSelectedType("Home");
        else if (path === "pricing") setSelectedType("Pricing");
        else if (path === "contact-us") setSelectedType("Contact US");
        else if (path === "profile") setSelectedType("Profile");
    }, [path])

    const OnHandleButtonClick = (type: string) => {
        setSelectedType(type);
        if (type === "LandingPage") navigate('/');
        else if (type === "Sign In") navigate('/sign-in');
        else if (type === "Sign Up") navigate('/sign-up');
        else if (type === "Home") navigate('/home');
        else if (type === "Pricing") navigate('/pricing');
        else if (type === "Contact US") navigate('/contact-us');
        else if (type === "Profile") navigate('/profile');
    }

    return (
        <>
            <div className={`flex fixed z-50 top-0 justify-between items-center w-full min-h-[100px] sm:w-full box-border ${(bgFullWhite) ? "bg-[#FBFBFB]" : `sm:bg-sky-500`} shadow-custom`}>
                <div className={`w-full sm:w-1/2 min-h-[100px] flex justify-start items-center pl-5 box-border`}>
                    <div onClick={() => OnHandleButtonClick("LandingPage")} className={`w-[auto] xl:pl-[100px] cursor-pointer text-[26px] font-semibold leading-[31.47px] tracking-wide ${bgFullWhite ? "text-primaryColor" : "text-white"}`}>
                        LeaseDrop
                    </div>
                </div>
                <div className={`hidden lg:flex w-full sm:w-1/2 min-h-[100px] justify-between items-center`}>
                    <div className={`w-full flex justify-between items-center xl:pr-[100px] px-5 box-border`}>
                        <div className="flex space-x-10 justify-center items-center w-[auto] h-full md:w-full">
                            <Button
                                className={`${bgFullWhite ? "text-textColor" : "text-white"} rounded-[0px] p-0 ${selectedType === "Home" ? "border-b-2 font-medium border-textColor" : ""}`}
                                onClick={() => OnHandleButtonClick("Home")}
                            >Home</Button>
                            <Button
                                className={`${bgFullWhite ? "text-textColor" : "text-white"} rounded-[0px] p-0 ${selectedType === "Pricing" ? "border-b-2" : ""}`}
                                onClick={() => OnHandleButtonClick("Pricing")}
                            >Pricing</Button>
                            <Button
                                className={`${bgFullWhite ? "text-textColor" : "text-white"} rounded-[0px] p-0 ${selectedType === "Contact US" ? "border-b-2" : ""}`}
                                onClick={() => OnHandleButtonClick("Contact US")}
                            >Contact US</Button>
                        </div>
                        {!isPaid ? (<div className="flex justify-end items-center w-full md:w-full">
                            <Button
                                className={`w-[96px] h-[40px] rounded-[10px] ${bgFullWhite && selectedType !== "Sign Up" ? "text-textColor" : "text-white"}`}
                                bgColor={selectedType === "Sign Up" ? "bg-[#0586D3]" : ""}
                                onClick={() => OnHandleButtonClick("Sign Up")}
                            >Sign Up</Button>
                            <Button
                                className={`w-[96px] h-[40px] rounded-[10px] ${bgFullWhite && selectedType !== "Sign In" ? "text-textColor" : "text-white"}`}
                                bgColor={selectedType === "Sign In" ? "bg-[#0586D3]" : ""}
                                onClick={() => OnHandleButtonClick("Sign In")}
                            >Sign In</Button>
                        </div>) : null}
                    </div>
                </div>
                {isPaid ?
                    <div className="flex justify-end items-center space-x-2 md:space-x-5 mr-2 xl:mr-[100px]">
                        <span className="min-w-[120px] text-right text-[18px] font-medium leading-[20px] tracking-wide text-textColor overflow-hidden text-ellipsis whitespace-nowrap">Stebin Ben</span>
                        <div className="flex flex-col items-center ">

                            <div className="flex flex-col ">
                                <div className='flex p-3 mr-[100px] items-center gap-2 pb-5'>
                                    <img
                                        onClick={() => OnHandleButtonClick("Profile")}
                                        className="w-[40px] h-[40px] max-w-[40px] rounded-full border border-gray-300 cursor-pointer object-cover"
                                        src="/assets/images/Home/user.png"
                                        alt="User"
                                    />
                                    <div className="w-full flex  flex-col items-start ">
                                        <span className="text-[12px] font-normal leading-[18px] tracking-wide text-textColor">Stebin Ben</span>
                                        <span className="text-[12px] font-normal leading-[16px] tracking-wide text-textColor-50">stebin.ben@gmail.com</span>
                                    </div>

                                </div>
                                <div className='h-[1px] mb-3 bg-[#E9EAEC]' />

                                {profileRoutes.map((route) => (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className=" mx-3 my-2 py-2 hover:bg-gray-200 flex rounded-md transition-all"
                                    >
                                        <div className='flex space-x-3'>
                                            <span dangerouslySetInnerHTML={{ __html: route.icon }} className="w-[10px]  h-[10px] px-5 " />
                                            <span className='text-[12px] text-[#656D7D]'>{route.label}</span>
                                        </div>

                                    </Link>
                                ))}
                            </div>
                            {/* Profile Image - TRIGGER */}
                            <img
                                onClick={() => OnHandleButtonClick("Profile")}
                                className="w-[40px] h-[40px] max-w-[40px] rounded-full border border-gray-300 cursor-pointer object-cover"
                                src="/assets/images/Home/user.png"
                                alt="User"
                            />
                        </div>
                    </div> : null}
                {/* Mobile Menu */}
                <ToggleButton onClickHandler={() => setIsExpanded(!isExpanded)} />
                <Sidebar isExpanded={isExpanded} />
            </div>

            {/* Mobile Menu overlay*/}
            <div
                role="button"
                className={cn('fixed z-30 bg-black/20 w-full h-screen lg:hidden', isExpanded ? 'block mr-48' : 'hidden')}
                onClick={() => setIsExpanded(!isExpanded)}
            />
        </>
    );
};

export default Header;

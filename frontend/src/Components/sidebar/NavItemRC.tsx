import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import RippleDivRC from '../effect/ripple/div/RippleDivRC';
import { ArrowUp2 } from 'iconsax-react';
import { Signal, useSignal } from '@preact/signals-react';
import cn from '../../utils/cn';
import { Tooltip } from '../customTool/Tooltip/Tooltip';
// import { Tooltip } from 'react-tooltip';

const navCss = `relative flex flex-row items-center font-medium focus:outline-none hover:no-underline rounded-md`;

const navLinkClasses = ({ isActive }: any) =>
  cn(isActive ? 'bg-indigo-50 text-[#4680FF]' : 'text-[#5B6B69] hover:bg-gray-200 hover:text-[#5B6B69]', navCss);

const NavLinkItem = ({
  name,
  icon,
  route,
  isExpanded,
  isChildren,
}: {
  name: string;
  icon?: any;
  route: string;
  isExpanded: boolean | undefined;
  isChildren?: boolean;
}) => {
  const handleClick = () => {
    document.title = name;
  };
  return (
    <NavLink
      className={({ isActive }) => cn(navLinkClasses({ isActive }), isChildren && 'ml-[.9rem]  bg-[#f8f9fa]')}
      to={route}
      onClick={handleClick}
    >
      <RippleDivRC
        className={cn('w-full h-10 flex items-center rounded-md', isExpanded ? '' : 'justify-center')}
      >
        <span className={cn('inline-flex justify-center items-center', isExpanded && 'ml-4')}>{icon}</span>
        {isChildren && <span className="text-lg leading-none">•</span>}
        {isExpanded && <span className="ml-2 text-sm tracking-wide truncate">{name}</span>}
      </RippleDivRC>
    </NavLink>
  );
};

const DropdownButton = ({
  name,
  icon,
  toggleDropdown,
  isExpanded,
  children,
  route,
}: {
  name: string;
  icon: React.ReactNode;
  toggleDropdown: (state: boolean) => void;
  route: string;
  isExpanded: boolean | undefined;
  children: React.ReactNode;
}) => {
  const isDropdownOpen = useSignal<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAnyChildActive = React.Children.toArray(children).some((child: any) => {
    return child.props.route === location.pathname;
  });

  const handleClick = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  useEffect(() => {
    toggleDropdown(isDropdownOpen.value);
  }, [isDropdownOpen.value, toggleDropdown]);
  // console.log('route check ', route);
  const Content = (
    <button
      type="button"
      className={cn('w-full flex items-center h-10', navLinkClasses({ isActive: isAnyChildActive }))}
    >
      <RippleDivRC
        className={cn(
          'w-full h-10 flex items-center rounded-md',
          isExpanded ? 'justify-between' : 'justify-center'
        )}
      >
        <div className="flex">
          <span className={cn('inline-flex justify-center items-center ', isExpanded && 'ml-4')}>
            {icon || null}
          </span>
          {isExpanded && <span className="ml-2 text-sm tracking-wide truncate">{name}</span>}
        </div>
        {isExpanded && (
          <ArrowUp2
            className={cn('transition-transform transform w-4 m-4', isDropdownOpen.value ? 'rotate-0' : 'rotate-180')}
          />
        )}
      </RippleDivRC>
    </button>
  );

  return (
    <div onClick={handleClick}>
      <>
        {!isExpanded && (
          <Tooltip content={Content} variant="light" size="sm" borderRadius="md" placement="right">
            {React.Children.map(children, (child: any, index) => {
              const isActive = location.pathname === child.props.route;
              return (
                <li className="p-3 pb-1" key={index}>
                  <span
                    onClick={() => navigate(child.props.route)}
                    className={cn(
                      `cursor-pointer transition-all duration-200 ${isActive ? 'text-blue-700' : 'text-gray-500'}`
                    )}
                  >
                    {child.props.name}
                  </span>
                </li>
              );
            })}
          </Tooltip>
        )}

        {/* when expand */}
        {isExpanded && (
          <button
            type="button"
            className={cn('w-full flex items-center h-10 ', navLinkClasses({ isActive: isAnyChildActive }))}
          >
            <RippleDivRC
              className={cn(
                'w-full h-10 flex items-center rounded-md',
                isExpanded ? 'justify-between' : 'justify-center'
              )}
            >
              <div className="flex">
                <span className={cn('inline-flex justify-center items-center', isExpanded && 'ml-4')}>
                  {icon || null}
                </span>
                {isExpanded && <span className="ml-2 text-sm tracking-wide truncate">{name}</span>}
              </div>
              {isExpanded && (
                <ArrowUp2
                  className={cn(
                    'transition-transform transform w-4 m-4',
                    isDropdownOpen.value ? 'rotate-0' : 'rotate-180'
                  )}
                />
              )}
            </RippleDivRC>
          </button>
        )}
      </>
    </div>
  );
};

const RNavItemRC = ({
  name,
  icon,
  route,
  isChildren = false,
  children,
  isExpanded,
}: {
  name: string;
  icon?: React.ReactNode;
  route: string;
  isChildren?: boolean;
  children?: React.ReactNode;
  isExpanded?: boolean;
  isActive: boolean;
}) => {
  const isDropdownOpen = useSignal<boolean>(false);

  return (
    <ul className="mx-1 py-1">
      {isChildren ? (
        <DropdownButton
          name={name}
          icon={icon}
          toggleDropdown={(state) => (isDropdownOpen.value = state)}
          route={route}
          isExpanded={isExpanded}
          children={children}
        />
      ) : (
        <li>
          <NavLinkItem name={name} icon={icon} route={route} isExpanded={isExpanded} isChildren={isChildren} />
        </li>
      )}
      {isExpanded &&
        isDropdownOpen.value &&
        React.Children.map(children, (child: any) => (
          <NavLinkItem
            key={child.props.name}
            name={child.props.name}
            icon={child.props.icon}
            route={child.props.route}
            isExpanded={isExpanded}
            isChildren={isChildren}
          />
        ))}
    </ul>
  );
};

export default RNavItemRC;

import Link from "next/link";
import React, { useState } from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
  label: string;
  active: boolean;
  icon: IconType;
  activeIcon: IconType;
  href: string;
  isLibraryOpened: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  active,
  activeIcon: ActiveIcon,
  href,
  isLibraryOpened,
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link href={href}>
      <div
        className="flex gap-4 items-center"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {active ? (
          <ActiveIcon
            size={30}
            color={active ? `#ffff` : isHover ? `#ffff` : "#B3B3B3"}
          />
        ) : (
          <Icon size={30} color={active ? `#ffff` : isHover ? `#ffff` : "#B3B3B3"} />
        )}
        {isLibraryOpened && (
          <h3
            className={`font-bold ${!active && !isHover && "text-lightGray"} `}
          >
            {label}
          </h3>
        )}
      </div>
    </Link>
  );
};

export default SidebarItem;

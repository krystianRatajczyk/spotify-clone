import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
  label: string;
  active: boolean;
  icon: IconType;
  activeIcon: IconType;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  active,
  activeIcon: ActiveIcon,
  href,
}) => {
  return (
    <Link href={href}>
      <div className="flex gap-4 items-center">
        {active ? (
          <ActiveIcon size={30} color="#ffff" />
        ) : (
          <Icon size={30} color="#B3B3B3" />
        )}
        <h3 className={`font-bold ${!active && "text-lightGray"}`}>{label}</h3>
      </div>
    </Link>
  );
};

export default SidebarItem;

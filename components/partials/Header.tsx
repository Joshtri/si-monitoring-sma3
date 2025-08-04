"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { headerConfigMap } from "@/config/headerConfig";
import { logout } from "@/services/authService";

interface HeaderProps {
  userRole: string;
  userName?: string;
  userAvatar?: string;
  onToggleSidebar?: () => void;
}

export default function Header({
  userRole,
  userName = "User",
  userAvatar,
  onToggleSidebar,
}: HeaderProps) {
  const router = useRouter();
  const config = headerConfigMap[userRole.toLowerCase()];
  if (!config) return null;

  const { portalTitle, roleColor } = config;

  // Allowed color types for Chip
  type ChipColor =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default"
    | undefined;
  const chipColor: ChipColor = roleColor as ChipColor;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <Navbar
      isBordered
      className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm border-b border-default-200"
      maxWidth="full"
    >
      {/* BRAND + MOBILE TOGGLE */}
      <NavbarBrand className="flex-grow-0">
        <Button
          isIconOnly
          className="lg:hidden mr-3 text-default-700"
          variant="light"
          onPress={onToggleSidebar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </Button>
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold shadow-sm">
            <Image
              alt="Logo SMA N 3 Kupang"
              src="/img/logoSMA3.png"
              width={40}
              height={40}
              className="rounded-full object-cover shadow-sm"
            />
          </div>
          <div className="flex flex-col leading-snug">
            <span className="text-xs text-default-500">{portalTitle}</span>
          </div>
        </div>
      </NavbarBrand>

      {/* NAV MENU */}
      {/* <NavbarContent className="hidden md:flex gap-6" justify="center">
        {navItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              color="foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent> */}

      {/* USER DROPDOWN */}
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-0 h-auto min-w-0"
              variant="light"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  className={`border-2 border-${roleColor}`}
                  name={userName}
                  size="sm"
                  src={userAvatar}
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{userName}</span>
                  <Chip
                    size="sm"
                    color={chipColor}
                    variant="flat"
                    className="capitalize mt-[-2px]"
                  >
                    {userRole.toLowerCase().replace("-", " ")}
                  </Chip>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-default-500" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu">
            <DropdownItem key="profile" className="gap-2">
              <div className="flex flex-col">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-default-500 capitalize">
                  {userRole.toLowerCase()}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="settings"
              href={`/${userRole.toLowerCase()}/profile`}
            >
              Profil
            </DropdownItem>
            <DropdownItem
              onClick={handleLogout}
              key="logout"
              className="text-danger"
              color="danger"
            >
              Keluar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}

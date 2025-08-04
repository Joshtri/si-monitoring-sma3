// lib/config/headerConfig.ts
export interface NavItem {
    label: string
    href: string
    icon?: React.ReactNode
}

export interface HeaderConfig {
    portalTitle: string
    roleColor: string
    navItems: NavItem[]
}

export const headerConfigMap: Record<string, HeaderConfig> = {
    admin: {
        portalTitle: "Portal Admin",
        roleColor: "danger",
        navItems: [
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Pengguna", href: "/admin/users" },
        ],
    },
    guru: {
        portalTitle: "Portal Guru",
        roleColor: "success",
        navItems: [
            { label: "Dashboard", href: "/guru/dashboard" },
            { label: "Absensi", href: "/guru/absensi" },
        ],
    },
    "wali-kelas": {
        portalTitle: "Portal Wali Kelas",
        roleColor: "secondary",
        navItems: [
            { label: "Dashboard", href: "/wali-kelas/dashboard" },
            { label: "Presensi", href: "/wali-kelas/presensi" },
        ],
    },
    "orang-tua": {
        portalTitle: "Portal Orang Tua",
        roleColor: "warning",
        navItems: [
            { label: "Dashboard", href: "/orang-tua/dashboard" },
            { label: "Laporan Anak", href: "/orang-tua/laporan" },
        ],
    },
}

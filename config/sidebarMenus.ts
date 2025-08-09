import { AcademicCapIcon, BookOpenIcon, BuildingLibraryIcon, BuildingOffice2Icon, CalendarDaysIcon, CalendarIcon, ChartBarIcon, ChartBarSquareIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, DocumentChartBarIcon, ExclamationCircleIcon, ExclamationTriangleIcon, HomeModernIcon, IdentificationIcon, SparklesIcon, StarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { HomeIcon, RectangleGroupIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export interface MenuItem {
    title: string;
    href: string;
    icon: React.ElementType;
    iconSolid: React.ElementType;
    badge?: string | number;
    submenu?: {
        title: string;
        href: string;
        icon?: React.ElementType;
    }[];
}

export const sidebarMenus: Record<string, MenuItem[]> = {
    ADMIN: [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: HomeIcon,
            iconSolid: HomeModernIcon,
        },
        {
            title: "Manajemen Akun",
            href: "/admin/users",
            icon: UserCircleIcon,
            iconSolid: UserCircleIcon,
        },
        {
            title: "Manajemen Guru",
            href: "/admin/guru",
            icon: AcademicCapIcon,
            iconSolid: AcademicCapIcon,
        },
        {
            title: "Manajemen Orang Tua",
            href: "/admin/orang-tua",
            icon: UsersIcon,
            iconSolid: UsersIcon,
        },
        {
            title: "Manajemen Siswa",
            href: "/admin/siswa",
            icon: IdentificationIcon,
            iconSolid: IdentificationIcon,
        },
        {
            title: "Tahun Ajaran",
            href: "/admin/tahun-ajaran",
            icon: CalendarDaysIcon,
            iconSolid: CalendarDaysIcon,
        },
        {
            title: "Kelas",
            href: "/admin/kelas",
            icon: RectangleGroupIcon,
            iconSolid: RectangleGroupIcon,
        },
        {
            title: "Jadwal Pelajaran",
            href: "/admin/jadwal-pelajaran",
            icon: BookOpenIcon,
            iconSolid: BookOpenIcon,
        },
        {
            title: "Presensi Siswa",
            href: "/admin/presensi-siswa",
            icon: ClipboardDocumentCheckIcon,
            iconSolid: ClipboardDocumentCheckIcon,
        },
        {
            title: "Nilai Siswa",
            href: "/admin/nilai-siswa",
            icon: ChartBarIcon,
            iconSolid: ChartBarIcon,
        },
        {
            title: "Pelanggaran Siswa",
            href: "/admin/pelanggaran-siswa",
            icon: ExclamationTriangleIcon,
            iconSolid: ExclamationTriangleIcon,
        },
        {
            title: "Aktivitas Siswa",
            href: "/admin/aktivitas-siswa",
            icon: SparklesIcon,
            iconSolid: SparklesIcon,
        },
        // {
        //     title: "Kelas & Jadwal",
        //     href: "/admin/kelas-jadwal",
        //     icon: RectangleGroupIcon,
        //     iconSolid: RectangleGroupIcon,
        // },
        {
            title: "Mata Pelajaran",
            href: "/admin/mata-pelajaran",
            icon: BookOpenIcon,
            iconSolid: BookOpenIcon,
        },

        {
            title: "Laporan",
            href: "/admin/laporan",
            icon: DocumentChartBarIcon,
            iconSolid: DocumentChartBarIcon,
        }
    ],
    GURU: [
        {
            title: "Dashboard",
            href: "/guru/dashboard",
            icon: HomeIcon,
            iconSolid: HomeModernIcon,
        },
        {
            title: "Jadwal Mengajar",
            href: "/guru/jadwal-mengajar",
            icon: CalendarIcon,
            iconSolid: CalendarDaysIcon,
        },
        {
            title: "Mata Pelajaran",
            href: "/guru/mata-pelajaran",
            icon: BookOpenIcon,
            iconSolid: BookOpenIcon,
        },
        {
            title: "Absensi",
            href: "/guru/absensi",
            icon: ClipboardDocumentCheckIcon,
            iconSolid: ClipboardDocumentListIcon,
        },

        {
            title: "Riwayat Absensi",
            href: "/guru/riwayat-absensi",
            icon: ClipboardDocumentListIcon,
            iconSolid: ClipboardDocumentListIcon,
        },
        {
            title: "Nilai Siswa",
            href: "/guru/nilai-siswa",
            icon: ChartBarIcon,
            iconSolid: ChartBarIcon,
        },
        {
            title: "Pelanggaran Siswa",
            href: "/guru/pelanggaran-siswa",
            icon: ExclamationTriangleIcon,
            iconSolid: ExclamationTriangleIcon,
        },
        {
            title: "Aktivitas Siswa",
            href: "/guru/aktivitas-siswa",
            icon: SparklesIcon,
            iconSolid: SparklesIcon,
        }

    ],
    WALI_KELAS: [
        {
            title: "Dashboard",
            href: "/wali-kelas/dashboard",
            icon: HomeIcon,
            iconSolid: HomeModernIcon,
        }
    ],
    ORANG_TUA: [
        {
            title: "Beranda",
            href: "/orang-tua/dashboard",
            icon: HomeIcon,
            iconSolid: HomeModernIcon,
        },
        {
            title: "Riwayat Absensi",
            href: "/orang-tua/absensi",
            icon: CalendarIcon,
            iconSolid: CalendarDaysIcon,
        },
        {
            title: "Riwayat Nilai",
            href: "/orang-tua/nilai",
            icon: ChartBarIcon,
            iconSolid: ChartBarSquareIcon,
        },
        {
            title: "Riwayat Pelanggaran",
            href: "/orang-tua/pelanggaran",
            icon: ExclamationCircleIcon,
            iconSolid: ExclamationTriangleIcon,
        },
        {
            title: "Kegiatan Anak",
            href: "/orang-tua/aktivitas",
            icon: SparklesIcon,
            iconSolid: StarIcon,
        },
        {
            title: "Informasi Kelas",
            href: "/orang-tua/kelas",
            icon: BuildingLibraryIcon,
            iconSolid: BuildingOffice2Icon,
        },
    ]

};
    // File: app/guru/mata-pelajaran/page.tsx
    "use client";

    import { useQuery } from "@tanstack/react-query";
    import { useMemo } from "react";
    import { getGuruMataPelajaran } from "@/services/guruService";
    import { ListGrid } from "@/components/ui/ListGrid";
    import { useRouter } from "next/navigation";

    interface MataPelajaranItem {
    guruMapelId: string;
    mataPelajaran: string;
    kelas: {
        kelasId: string;
        kelas: string;
        hari: string;
        jamKe: number;
    }[];
    }

    export default function GuruMataPelajaranPage() {
    const router = useRouter();

    const { data: dataMapel = [], isLoading } = useQuery<MataPelajaranItem[]>({
        queryKey: ["guru-mata-pelajaran"],
        queryFn: getGuruMataPelajaran,
    });

    const { columns, rows } = useMemo(() => {
        const columns = [
        { key: "mataPelajaran", label: "Mata Pelajaran" },
        { key: "kelas", label: "Kelas" },
        ];

        const rows = dataMapel.map((mapel) => ({
        key: mapel.guruMapelId,
        mataPelajaran: mapel.mataPelajaran,
        kelas: mapel.kelas.map(
            (k) => `${k.kelas} - ${k.hari}, Jam ke-${k.jamKe}`
        ).join(", "),
        }));

        return { columns, rows };
    }, [dataMapel]);

    return (
        <ListGrid
        title="Jadwal Mengajar"
        description="Daftar jadwal mengajar beserta kelas dan mata pelajarannya."
        breadcrumbs={[
            { label: "Dashboard", href: "/guru/dashboard" },
            { label: "Jadwal Mengajar" },
        ]}
        columns={columns}
        rows={rows}
        loading={isLoading}
        searchPlaceholder="Cari mata pelajaran..."
        showPagination={false}
        />
    );
    }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Tabs, Tab, Button, Input, Select, SelectItem,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Spinner, Chip, Divider
} from "@heroui/react";
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/outline";

// ================== Types ==================
type KelasItem = { id: string; kelas: string };

type AttRow = {
  tanggal: string;
  kelas: string;
  mapel: string;
  guru: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  total: number;
};
type GradeRow = {
  siswa: string;
  kelas: string;
  mapel: string;
  jenis: "TUGAS" | "ULANGAN" | "UTS" | "UAS";
  nilai: number;
  semester: string;
};
type ViolRow = {
  tanggal: string;
  siswa: string;
  kelas: string;
  jenisPelanggaran: string;
  poin: number;
  tindakan: string;
};
type ActRow = {
  tanggal: string;
  siswa: string;
  kelas: string;
  kegiatan: string;
  jenis: "EKSTRAKURIKULER" | "ORGANISASI" | "LOMBA";
};

// ================== Services (ganti endpoint sesuai backend) ==================
async function fetchKelas(): Promise<KelasItem[]> {
  // ambil semua kelas aktif untuk filter
  const res = await axios.get<{ success: boolean; data: KelasItem[] }>("/api/admin/presensi/kelas");
  return (res.data.data ?? []).map(k => ({ id: k.id, kelas: k.kelas }));
}

async function fetchAttendanceSummary(params: { kelasId?: string; from?: string; to?: string }): Promise<AttRow[]> {
  const res = await axios.get<{ success: boolean; data: AttRow[] }>("/api/admin/laporan/attendance/summary", { params });
  return res.data.data ?? [];
}
async function fetchGradesOverview(params: { kelasId?: string; semester?: string }): Promise<GradeRow[]> {
  const res = await axios.get<{ success: boolean; data: GradeRow[] }>("/api/admin/laporan/grades/overview", { params });
  return res.data.data ?? [];
}
async function fetchViolationsSummary(params: { kelasId?: string; from?: string; to?: string }): Promise<ViolRow[]> {
  const res = await axios.get<{ success: boolean; data: ViolRow[] }>("/api/admin/laporan/violations/summary", { params });
  return res.data.data ?? [];
}
async function fetchActivitiesSummary(params: { kelasId?: string; from?: string; to?: string }): Promise<ActRow[]> {
  const res = await axios.get<{ success: boolean; data: ActRow[] }>("/api/admin/laporan/activities/summary", { params });
  return res.data.data ?? [];
}

// ================== Utils ==================
function fmtDate(d?: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "2-digit" });
}
function toCSV(rows: Record<string, any>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(",")),
  ];
  return lines.join("\n");
}
function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ================== Page ==================
export default function AdminLaporanPage() {
  // global filters
  const [kelasId, setKelasId] = useState<string | null>(null);
  const [from, setFrom] = useState<string>("");     // YYYY-MM-DD
  const [to, setTo] = useState<string>("");         // YYYY-MM-DD
  const [semester, setSemester] = useState<string>("Ganjil"); // contoh

  // active tab
  const [tab, setTab] = useState<"presensi" | "nilai" | "pelanggaran" | "aktivitas">("presensi");

  // kelas options
  const kelasQ = useQuery({ queryKey: ["lap-kelas"], queryFn: fetchKelas });

  // data queries (per tab)
  const attQ = useQuery({
    queryKey: ["lap-att", kelasId, from, to],
    queryFn: () => fetchAttendanceSummary({ kelasId: kelasId ?? undefined, from: from || undefined, to: to || undefined }),
    enabled: tab === "presensi",
  });
  const gradesQ = useQuery({
    queryKey: ["lap-grades", kelasId, semester],
    queryFn: () => fetchGradesOverview({ kelasId: kelasId ?? undefined, semester }),
    enabled: tab === "nilai",
  });
  const violQ = useQuery({
    queryKey: ["lap-viol", kelasId, from, to],
    queryFn: () => fetchViolationsSummary({ kelasId: kelasId ?? undefined, from: from || undefined, to: to || undefined }),
    enabled: tab === "pelanggaran",
  });
  const actQ = useQuery({
    queryKey: ["lap-act", kelasId, from, to],
    queryFn: () => fetchActivitiesSummary({ kelasId: kelasId ?? undefined, from: from || undefined, to: to || undefined }),
    enabled: tab === "aktivitas",
  });

  // export handlers
  const onExportCSV = () => {
    let rows: any[] = [];
    let name = "report.csv";
    if (tab === "presensi") { rows = attQ.data ?? []; name = "attendance.csv"; }
    if (tab === "nilai")    { rows = gradesQ.data ?? []; name = "grades.csv"; }
    if (tab === "pelanggaran") { rows = violQ.data ?? []; name = "violations.csv"; }
    if (tab === "aktivitas") { rows = actQ.data ?? []; name = "activities.csv"; }
    const csv = toCSV(rows);
    downloadText(name, csv);
  };
  const onExportPDF = () => {
    // Placeholder: kamu bisa hit endpoint server-side yang pakai Puppeteer utk render PDF
    // contoh: await axios.post("/api/admin/laporan/export-pdf", { tab, kelasId, from, to, semester })
    alert("Export PDF belum dihubungkan. Siapkan endpoint export-pdf sesuai kebutuhan.");
  };

  // auto-set default kelas
  useEffect(() => {
    if (!kelasId && kelasQ.data?.length) setKelasId(kelasQ.data[0].id);
  }, [kelasQ.data, kelasId]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl md:text-2xl font-semibold">Laporan</div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            onPress={() => {
              if (tab === "presensi") attQ.refetch();
              if (tab === "nilai") gradesQ.refetch();
              if (tab === "pelanggaran") violQ.refetch();
              if (tab === "aktivitas") actQ.refetch();
            }}
          >
            {(attQ.isRefetching || gradesQ.isRefetching || violQ.isRefetching || actQ.isRefetching)
              ? <Spinner size="sm" />
              : <ArrowPathIcon className="w-4 h-4" />
            }
          </Button>
          <Button startContent={<ArrowDownTrayIcon className="w-4 h-4" />} onPress={onExportCSV}>
            Export CSV
          </Button>
          <Button startContent={<DocumentArrowDownIcon className="w-4 h-4" />} variant="flat" onPress={onExportPDF}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="font-semibold">Filter</CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select
            label="Kelas"
            selectedKeys={kelasId ? [kelasId] : []}
            onSelectionChange={(keys) => {
              const k = Array.from(keys)[0] as string | undefined;
              setKelasId(k ?? null);
            }}
            isLoading={kelasQ.isLoading}
            placeholder="Pilih kelas"
          >
            {(kelasQ.data ?? []).map(k => (
              <SelectItem key={k.id}>{k.kelas}</SelectItem>
            ))}
          </Select>

          {tab !== "nilai" ? (
            <>
              <Input label="Dari (YYYY-MM-DD)" value={from} onValueChange={setFrom} />
              <Input label="Sampai (YYYY-MM-DD)" value={to} onValueChange={setTo} />
            </>
          ) : (
            <Select
              label="Semester"
              selectedKeys={[semester]}
              onSelectionChange={(keys) => setSemester(Array.from(keys)[0] as string)}
            >
              <SelectItem key="Ganjil">Ganjil</SelectItem>
              <SelectItem key="Genap">Genap</SelectItem>
            </Select>
          )}
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={tab}
        onSelectionChange={(k) => setTab(k as any)}
        aria-label="Jenis Laporan"
      >
        <Tab key="presensi" title="Presensi">
          <Card>
            <CardBody>
              {attQ.isLoading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : (
                <Table aria-label="Laporan Presensi" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Tanggal</TableColumn>
                    <TableColumn>Kelas</TableColumn>
                    <TableColumn>Mapel</TableColumn>
                    <TableColumn>Guru</TableColumn>
                    <TableColumn>Hadir</TableColumn>
                    <TableColumn>Sakit</TableColumn>
                    <TableColumn>Izin</TableColumn>
                    <TableColumn>Alpha</TableColumn>
                    <TableColumn>Total</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Tidak ada data" items={attQ.data ?? []}>
                    {(r: AttRow) => (
                      <TableRow key={`${r.tanggal}-${r.kelas}-${r.mapel}`}>
                        <TableCell>{fmtDate(r.tanggal)}</TableCell>
                        <TableCell>{r.kelas}</TableCell>
                        <TableCell>{r.mapel}</TableCell>
                        <TableCell>{r.guru}</TableCell>
                        <TableCell><Chip size="sm" color="success" variant="flat">{r.hadir}</Chip></TableCell>
                        <TableCell><Chip size="sm" color="warning" variant="flat">{r.sakit}</Chip></TableCell>
                        <TableCell><Chip size="sm" color="primary" variant="flat">{r.izin}</Chip></TableCell>
                        <TableCell><Chip size="sm" color="danger" variant="flat">{r.alpha}</Chip></TableCell>
                        <TableCell>{r.total}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="nilai" title="Nilai">
          <Card>
            <CardBody>
              {gradesQ.isLoading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : (
                <Table aria-label="Laporan Nilai" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Siswa</TableColumn>
                    <TableColumn>Kelas</TableColumn>
                    <TableColumn>Mapel</TableColumn>
                    <TableColumn>Jenis</TableColumn>
                    <TableColumn>Nilai</TableColumn>
                    <TableColumn>Semester</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Tidak ada data" items={gradesQ.data ?? []}>
                    {(r: GradeRow) => (
                      <TableRow key={`${r.siswa}-${r.mapel}-${r.jenis}-${r.semester}`}>
                        <TableCell>{r.siswa}</TableCell>
                        <TableCell>{r.kelas}</TableCell>
                        <TableCell>{r.mapel}</TableCell>
                        <TableCell>{r.jenis}</TableCell>
                        <TableCell><Chip size="sm" color="primary" variant="flat">{r.nilai}</Chip></TableCell>
                        <TableCell>{r.semester}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="pelanggaran" title="Pelanggaran">
          <Card>
            <CardBody>
              {violQ.isLoading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : (
                <Table aria-label="Laporan Pelanggaran" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Tanggal</TableColumn>
                    <TableColumn>Siswa</TableColumn>
                    <TableColumn>Kelas</TableColumn>
                    <TableColumn>Jenis</TableColumn>
                    <TableColumn>Poin</TableColumn>
                    <TableColumn>Tindakan</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Tidak ada data" items={violQ.data ?? []}>
                    {(r: ViolRow) => (
                      <TableRow key={`${r.tanggal}-${r.siswa}-${r.jenisPelanggaran}`}>
                        <TableCell>{fmtDate(r.tanggal)}</TableCell>
                        <TableCell>{r.siswa}</TableCell>
                        <TableCell>{r.kelas}</TableCell>
                        <TableCell>{r.jenisPelanggaran}</TableCell>
                        <TableCell><Chip size="sm" color="danger" variant="flat">{r.poin}</Chip></TableCell>
                        <TableCell>{r.tindakan}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="aktivitas" title="Aktivitas">
          <Card>
            <CardBody>
              {actQ.isLoading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : (
                <Table aria-label="Laporan Aktivitas" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Tanggal</TableColumn>
                    <TableColumn>Siswa</TableColumn>
                    <TableColumn>Kelas</TableColumn>
                    <TableColumn>Kegiatan</TableColumn>
                    <TableColumn>Jenis</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Tidak ada data" items={actQ.data ?? []}>
                    {(r: ActRow) => (
                      <TableRow key={`${r.tanggal}-${r.siswa}-${r.kegiatan}`}>
                        <TableCell>{fmtDate(r.tanggal)}</TableCell>
                        <TableCell>{r.siswa}</TableCell>
                        <TableCell>{r.kelas}</TableCell>
                        <TableCell>{r.kegiatan}</TableCell>
                        <TableCell>{r.jenis}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <Divider className="my-2" />
      <div className="text-xs text-default-500">
        *Endpoint contoh:  
        `/api/admin/laporan/attendance/summary`,  
        `/api/admin/laporan/grades/overview`,  
        `/api/admin/laporan/violations/summary`,  
        `/api/admin/laporan/activities/summary`.  
        Silakan sesuaikan/point ke API yang sudah kamu punya.
      </div>
    </div>
  );
}

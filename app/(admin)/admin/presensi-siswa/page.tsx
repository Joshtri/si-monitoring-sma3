"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Spinner, Badge, Tooltip, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider, User as UserCell, Select, SelectItem
} from "@heroui/react";
import { EyeIcon, ArrowPathIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

// --- Types ---
type KelasItem = { id: string; kelas: string; waliKelas?: { id: string; nama: string } | null; totalSiswa: number; totalMapelTerjadwal: number; };
type KelasResp = { success: boolean; data: KelasItem[] };

type MapelItem = {
  jadwalId: string; hari: string; jamKe: number;
  guruMapelId: string; mapel: string;
  guruPengampu: { id: string; nama: string };
  totalPertemuan: number;
};
type KelasDetail = {
  kelas: { id: string; kelas: string; tahunAjaran: { tahun: string }; waliKelas?: { nama: string } | null; };
  mapel: MapelItem[];
};
type KelasDetailResp = { success: boolean; data: KelasDetail };

type PertemuanItem = { tanggal: string; total: number; summary: Record<string, number> };
type MapelPertemuanResp = {
  success: boolean;
  data: { mapel: { id: string; nama: string; guru: { id: string; nama: string } }; pertemuan: PertemuanItem[] };
};
type PresensiDetailResp = {
  success: boolean;
  data: { tanggal: string; mapel: string; guru: { id: string; nama: string }; presensi: Array<{ siswaId: string; nama: string; nis?: string | null; nisn?: string | null; status: string; keterangan: string | null }> };
};

// --- Services ---
const getKelas = async (): Promise<KelasItem[]> => (await axios.get<KelasResp>("/api/admin/presensi/kelas")).data.data ?? [];
const getKelasDetail = async (kelasId: string): Promise<KelasDetail> => (await axios.get<KelasDetailResp>(`/api/admin/presensi/kelas/${kelasId}`)).data.data;
const getPertemuan = async (kelasId: string, guruMapelId: string): Promise<MapelPertemuanResp["data"]> =>
  (await axios.get<MapelPertemuanResp>(`/api/admin/presensi/kelas/${kelasId}/mapel/${guruMapelId}`)).data.data;
const getPresensi = async (kelasId: string, guruMapelId: string, tanggal: string): Promise<PresensiDetailResp["data"]> =>
  (await axios.get<PresensiDetailResp>(`/api/admin/presensi/kelas/${kelasId}/mapel/${guruMapelId}/pertemuan/${tanggal}`)).data.data;

function fmtDate(d?: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "2-digit" });
}

export default function PresensiSiswaPage() {
  const [kelasId, setKelasId] = useState<string | null>(null);
  const [searchKelas, setSearchKelas] = useState("");
  const [searchMapel, setSearchMapel] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [showDetail, setShowDetail] = useState(false);
  const [guruMapelId, setGuruMapelId] = useState<string | null>(null);
  const [selectedTanggal, setSelectedTanggal] = useState<string | null>(null);

  // queries
  const kelasQ = useQuery({ queryKey: ["prs-kelas"], queryFn: getKelas });
  const kelasDetailQ = useQuery({
    queryKey: ["prs-kelas-detail", kelasId],
    queryFn: () => getKelasDetail(kelasId!),
    enabled: !!kelasId,
  });
  const pertemuanQ = useQuery({
    queryKey: ["prs-pertemuan", kelasId, guruMapelId],
    queryFn: () => getPertemuan(kelasId!, guruMapelId!),
    enabled: !!kelasId && !!guruMapelId && showDetail,
  });
  const presensiQ = useQuery({
    queryKey: ["prs-presensi", kelasId, guruMapelId, selectedTanggal],
    queryFn: () => getPresensi(kelasId!, guruMapelId!, selectedTanggal!),
    enabled: !!kelasId && !!guruMapelId && !!selectedTanggal && showDetail,
  });

  // computed
  const kelasFiltered = useMemo(() => {
    const q = searchKelas.toLowerCase().trim();
    return (kelasQ.data ?? []).filter(k =>
      k.kelas.toLowerCase().includes(q) || (k.waliKelas?.nama?.toLowerCase().includes(q) ?? false)
    );
  }, [kelasQ.data, searchKelas]);

  const mapelFiltered = useMemo(() => {
    const arr = kelasDetailQ.data?.mapel ?? [];
    const q = searchMapel.toLowerCase().trim();
    return q ? arr.filter(m => m.mapel.toLowerCase().includes(q) || m.guruPengampu.nama.toLowerCase().includes(q) || m.hari.toLowerCase().includes(q)) : arr;
  }, [kelasDetailQ.data, searchMapel]);

  const mapelPaged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return mapelFiltered.slice(start, start + rowsPerPage);
  }, [mapelFiltered, page]);

  const totalMapelFiltered = mapelFiltered.length;

  const openDetail = (gmId: string) => {
    setGuruMapelId(gmId);
    setSelectedTanggal(null);
    setShowDetail(true);
  };
  const closeDetail = () => {
    setShowDetail(false);
    setGuruMapelId(null);
    setSelectedTanggal(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xl md:text-2xl font-semibold">Presensi Siswa</div>
        <Button
          isIconOnly
          variant="flat"
          onPress={() => {
            kelasQ.refetch();
            if (kelasId) kelasDetailQ.refetch();
            if (showDetail && kelasId && guruMapelId) pertemuanQ.refetch();
            if (showDetail && kelasId && guruMapelId && selectedTanggal) presensiQ.refetch();
          }}
        >
          {kelasQ.isRefetching || kelasDetailQ.isRefetching || pertemuanQ.isRefetching || presensiQ.isRefetching
            ? <Spinner size="sm" />
            : <ArrowPathIcon className="w-4 h-4" />
          }
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel Kiri: Kelas */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-col items-start gap-2">
            <div className="font-semibold">Kelas Aktif</div>
            <Input size="sm" placeholder="Cari kelas / wali kelas…" value={searchKelas} onValueChange={setSearchKelas} />
          </CardHeader>
          <CardBody className="space-y-2 max-h-[70vh] overflow-auto">
            {kelasQ.isLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : kelasFiltered.length === 0 ? (
              <div className="text-sm text-default-500">Tidak ada kelas.</div>
            ) : (
              kelasFiltered.map(k => {
                const active = kelasId === k.id;
                return (
                  <button
                    key={k.id}
                    onClick={() => { setKelasId(k.id); setPage(1); }}
                    className={`w-full text-left rounded-xl border px-3 py-2 transition ${active ? "border-primary-500 bg-primary-50" : "border-default-200 hover:bg-default-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{k.kelas}</div>
                      <Badge>{k.totalMapelTerjadwal}</Badge>
                    </div>
                    <div className="text-xs text-default-500">Wali: {k.waliKelas?.nama ?? "-"}</div>
                    <div className="text-xs text-default-500">Total siswa: {k.totalSiswa}</div>
                  </button>
                );
              })
            )}
          </CardBody>
        </Card>

        {/* Panel Tengah: Mapel/Jadwal di kelas */}
        <Card className="lg:col-span-9">
          <CardHeader className="flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold">
                {kelasId ? `Jadwal Kelas ${kelasDetailQ.data?.kelas.kelas} · TA ${kelasDetailQ.data?.kelas.tahunAjaran.tahun}` : "Pilih kelas untuk melihat jadwal"}
              </div>
              {kelasDetailQ.isLoading && kelasId ? <Spinner size="sm" /> : null}
            </div>
            <div className="w-full flex items-center gap-2">
              <Input
                size="sm" className="max-w-xs"
                placeholder="Cari mapel / guru / hari…"
                value={searchMapel}
                onValueChange={(v) => { setSearchMapel(v); setPage(1); }}
                isDisabled={!kelasId}
              />
              {kelasId && <Chip variant="flat" color="primary">Total: {totalMapelFiltered}</Chip>}
            </div>
            {kelasId && (
              <div className="text-xs text-default-500">
                Wali Kelas: <b>{kelasDetailQ.data?.kelas.waliKelas?.nama ?? "-"}</b>
              </div>
            )}
          </CardHeader>

          <CardBody>
            {!kelasId ? (
              <div className="text-sm text-default-500">Silakan pilih kelas di panel kiri.</div>
            ) : kelasDetailQ.isLoading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : (
              <>
                <Table aria-label="Daftar mapel" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Hari</TableColumn>
                    <TableColumn>Jam ke</TableColumn>
                    <TableColumn>Mata Pelajaran</TableColumn>
                    <TableColumn>Guru Pengampu</TableColumn>
                    <TableColumn>Pertemuan</TableColumn>
                    <TableColumn className="text-right">Aksi</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Tidak ada jadwal" items={mapelPaged}>
                    {(m) => (
                      <TableRow key={m.jadwalId}>
                        <TableCell>{m.hari}</TableCell>
                        <TableCell>{m.jamKe}</TableCell>
                        <TableCell>{m.mapel}</TableCell>
                        <TableCell>{m.guruPengampu.nama}</TableCell>
                        <TableCell><Chip size="sm" variant="flat">{m.totalPertemuan}</Chip></TableCell>
                        <TableCell className="text-right">
                          <Tooltip content="Lihat pertemuan & presensi">
                            <Button size="sm" variant="flat" startContent={<EyeIcon className="w-4 h-4" />} onPress={() => openDetail(m.guruMapelId)}>
                              Lihat
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <Pagination
                    showShadow size="sm"
                    page={page}
                    total={Math.max(1, Math.ceil(totalMapelFiltered / rowsPerPage))}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal kanan: daftar pertemuan & presensi per pertemuan */}
      <Modal
        isOpen={showDetail}
        size="3xl"
        onOpenChange={(open) => { if (!open) closeDetail(); }}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Detail Presensi Mapel</ModalHeader>
          <ModalBody>
            {!kelasId || !guruMapelId ? (
              <div className="text-sm text-default-500">Tidak ada mapel dipilih.</div>
            ) : pertemuanQ.isLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : !pertemuanQ.data ? (
              <div className="text-sm text-default-500">Data tidak ditemukan.</div>
            ) : (
              <>
                <Card>
                  <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-default-500">Mata Pelajaran</div>
                      <div className="font-medium">{pertemuanQ.data.mapel.nama}</div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">Guru Pengampu</div>
                      <div className="font-medium">{pertemuanQ.data.mapel.guru.nama}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-default-500">Pilih Pertemuan (Tanggal)</div>
                      <Select
                        size="sm"
                        selectedKeys={selectedTanggal ? [selectedTanggal] : []}
                        onSelectionChange={(keys) => {
                          const k = Array.from(keys)[0] as string | undefined;
                          setSelectedTanggal(k ?? null);
                        }}
                        placeholder="Pilih tanggal pertemuan"
                      >
                        {(pertemuanQ.data.pertemuan ?? []).map((p) => (
                          <SelectItem key={p.tanggal} textValue={fmtDate(p.tanggal)}>
                            {fmtDate(p.tanggal)} · Hadir: {p.summary.HADIR ?? 0} · Sakit: {p.summary.SAKIT ?? 0} · Izin: {p.summary.IZIN ?? 0} · Alpha: {p.summary.ALPHA ?? 0}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </CardBody>
                </Card>

                <Divider className="my-3" />
                <div className="font-semibold flex items-center gap-2">
                  <InformationCircleIcon className="w-4 h-4" /> Presensi Siswa
                </div>

                {selectedTanggal ? (
                  presensiQ.isLoading ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                  ) : !presensiQ.data ? (
                    <div className="text-sm text-default-500">Data tidak ditemukan.</div>
                  ) : (
                    <Table aria-label="Presensi per pertemuan" isStriped removeWrapper fullWidth>
                      <TableHeader>
                        <TableColumn>Nama</TableColumn>
                        <TableColumn>NIS / NISN</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Keterangan</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent="Belum ada data" items={presensiQ.data.presensi}>
                        {(r) => (
                          <TableRow key={r.siswaId}>
                            <TableCell><UserCell name={r.nama} /></TableCell>
                            <TableCell>
                              <div className="text-sm">{r.nis ?? "-"} <span className="text-default-400">/</span> {r.nisn ?? "-"}</div>
                            </TableCell>
                            <TableCell>
                              <Chip size="sm" color={
                                r.status === "HADIR" ? "success" :
                                r.status === "SAKIT" ? "warning" :
                                r.status === "IZIN" ? "primary" :
                                r.status === "ALPHA" ? "danger" : "default"
                              } variant="flat">
                                {r.status}
                              </Chip>
                            </TableCell>
                            <TableCell>{r.keterangan ?? "-"}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )
                ) : (
                  <div className="text-sm text-default-500">Pilih tanggal pertemuan untuk melihat daftar presensi.</div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={closeDetail}>Tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

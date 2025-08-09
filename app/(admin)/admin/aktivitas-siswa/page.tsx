"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Chip, Spinner, Badge, Tooltip, Pagination, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Divider, User as UserCell
} from "@heroui/react";
import { EyeIcon, ArrowPathIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

// -------- Types (sesuaikan dgn API yang sudah dibuat) --------
type KelasItem = {
  id: string;
  kelas: string;
  waliKelas?: { id: string; nama: string } | null;
  totalSiswa: number;
  siswaDenganAktivitas: number;
};
type KelasResp = { success: boolean; data: KelasItem[] };

type KelasDetail = {
  kelas: {
    id: string; kelas: string;
    waliKelas?: { id: string; nama: string } | null;
    tahunAjaran: { id: string; tahun: string; aktif: boolean };
  };
  students: Array<{
    id: string;
    nama: string;
    nis?: string | null;
    nisn?: string | null;
    totalAktivitas: number;
    perJenis: {
      EKSTRAKURIKULER: number;
      ORGANISASI: number;
      LOMBA: number;
    };
    lastActivityAt: string | null;
    hasAktivitas: boolean;
  }>;
};
type KelasDetailResp = { success: boolean; data: KelasDetail };

type SiswaDetail = {
  siswa: { id: string; nama: string; nis?: string | null; nisn?: string | null };
  ringkasan: {
    totalAktivitas: number;
    perJenis: Record<string, number>;
    lastActivityAt: string | null;
  };
  aktivitas: Array<{
    id: string;
    namaKegiatan: string;
    jenis: "EKSTRAKURIKULER" | "ORGANISASI" | "LOMBA";
    tanggal: string;
    catatan: string | null;
  }>;
};
type SiswaDetailResp = { success: boolean; data: SiswaDetail };

// -------- Services --------
async function fetchKelas(): Promise<KelasItem[]> {
  const res = await axios.get<KelasResp>("/api/admin/aktivitas/kelas");
  return res.data.data ?? [];
}
async function fetchKelasDetail(kelasId: string): Promise<KelasDetail> {
  const res = await axios.get<KelasDetailResp>(`/api/admin/aktivitas/kelas/${kelasId}`);
  return res.data.data;
}
async function fetchSiswaDetail(kelasId: string, siswaId: string): Promise<SiswaDetail> {
  const res = await axios.get<SiswaDetailResp>(`/api/admin/aktivitas/kelas/${kelasId}/siswa/${siswaId}`);
  return res.data.data;
}

function fmtDate(d?: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "2-digit" });
}

export default function AktivitasSiswaPage() {
  // state
  const [selectedKelasId, setSelectedKelasId] = useState<string | null>(null);
  const [searchKelas, setSearchKelas] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [showDetail, setShowDetail] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);

  // queries
  const { data: kelasList, isLoading: kelasLoading, refetch: refetchKelas, isRefetching: kelasRefetching } = useQuery({
    queryKey: ["aktivitas-kelas"], queryFn: fetchKelas,
  });

  const { data: kelasDetail, isLoading: siswaLoading, refetch: refetchKelasDetail, isRefetching: siswaRefetching } = useQuery({
    queryKey: ["aktivitas-by-kelas", selectedKelasId],
    queryFn: () => fetchKelasDetail(selectedKelasId!),
    enabled: !!selectedKelasId,
  });

  const { data: siswaDetail, isLoading: siswaDetailLoading, refetch: refetchSiswaDetail, isRefetching: siswaDetailRefetching } = useQuery({
    queryKey: ["aktivitas-detail-siswa", selectedKelasId, selectedSiswaId],
    queryFn: () => fetchSiswaDetail(selectedKelasId!, selectedSiswaId!),
    enabled: !!selectedKelasId && !!selectedSiswaId && showDetail,
  });

  // computed
  const filteredKelas = useMemo(() => {
    const q = searchKelas.toLowerCase().trim();
    return (kelasList ?? []).filter(k =>
      k.kelas.toLowerCase().includes(q) || (k.waliKelas?.nama?.toLowerCase().includes(q) ?? false)
    );
  }, [kelasList, searchKelas]);

  const siswaRows = useMemo(() => {
    const arr = kelasDetail?.students ?? [];
    const q = searchSiswa.toLowerCase().trim();
    const filtered = q
      ? arr.filter(s =>
          s.nama.toLowerCase().includes(q) ||
          (s.nis?.toLowerCase().includes(q) ?? false) ||
          (s.nisn?.toLowerCase().includes(q) ?? false)
        )
      : arr;
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [kelasDetail, searchSiswa, page]);

  const totalSiswaFiltered = useMemo(() => {
    const arr = kelasDetail?.students ?? [];
    const q = searchSiswa.toLowerCase().trim();
    return q
      ? arr.filter(s =>
          s.nama.toLowerCase().includes(q) ||
          (s.nis?.toLowerCase().includes(q) ?? false) ||
          (s.nisn?.toLowerCase().includes(q) ?? false)
        ).length
      : arr.length;
  }, [kelasDetail, searchSiswa]);

  const openDetail = (siswaId: string) => {
    setSelectedSiswaId(siswaId);
    setShowDetail(true);
  };
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedSiswaId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xl md:text-2xl font-semibold">Aktivitas Siswa</div>
        <Button
          isIconOnly
          variant="flat"
          onPress={() => {
            refetchKelas();
            if (selectedKelasId) refetchKelasDetail();
            if (showDetail && selectedKelasId && selectedSiswaId) refetchSiswaDetail();
          }}
        >
          {kelasRefetching || siswaRefetching || siswaDetailRefetching ? (
            <Spinner size="sm" />
          ) : (
            <ArrowPathIcon className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* KIRI: Kelas */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-col items-start gap-2">
            <div className="font-semibold">Kelas Aktif</div>
            <Input size="sm" placeholder="Cari kelas / wali kelas…" value={searchKelas} onValueChange={setSearchKelas} />
          </CardHeader>
          <CardBody className="space-y-2 max-h-[70vh] overflow-auto">
            {kelasLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : filteredKelas.length === 0 ? (
              <div className="text-sm text-default-500">Tidak ada kelas.</div>
            ) : (
              filteredKelas.map(k => {
                const active = selectedKelasId === k.id;
                return (
                  <button
                    key={k.id}
                    onClick={() => { setSelectedKelasId(k.id); setPage(1); }}
                    className={`w-full text-left rounded-xl border px-3 py-2 transition ${active ? "border-primary-500 bg-primary-50" : "border-default-200 hover:bg-default-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{k.kelas}</div>
                      <Badge color={k.siswaDenganAktivitas > 0 ? "success" : "default"}>
                        {k.siswaDenganAktivitas}
                      </Badge>
                    </div>
                    <div className="text-xs text-default-500">Wali: {k.waliKelas?.nama ?? "-"}</div>
                    <div className="text-xs text-default-500">Total siswa: {k.totalSiswa}</div>
                  </button>
                );
              })
            )}
          </CardBody>
        </Card>

        {/* TENGAH: Siswa & Ringkasan Aktivitas */}
        <Card className="lg:col-span-9">
          <CardHeader className="flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold">
                {selectedKelasId
                  ? `Siswa di Kelas ${kelasDetail?.kelas.kelas ?? ""} · TA ${kelasDetail?.kelas.tahunAjaran.tahun ?? ""}`
                  : "Pilih kelas untuk melihat data siswa"}
              </div>
              {siswaLoading && selectedKelasId ? <Spinner size="sm" /> : null}
            </div>
            <div className="w-full flex items-center gap-2">
              <Input
                size="sm"
                className="max-w-xs"
                placeholder="Cari siswa / NIS / NISN…"
                value={searchSiswa}
                onValueChange={(v) => { setSearchSiswa(v); setPage(1); }}
                isDisabled={!selectedKelasId}
              />
              {selectedKelasId && <Chip variant="flat" color="primary">Total: {totalSiswaFiltered}</Chip>}
            </div>
          </CardHeader>
          <CardBody>
            {!selectedKelasId ? (
              <div className="text-sm text-default-500">Silakan pilih kelas di panel kiri.</div>
            ) : siswaLoading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : (
              <>
                <Table aria-label="Ringkasan aktivitas siswa" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Nama</TableColumn>
                    <TableColumn>NIS / NISN</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>Ekstrakurikuler</TableColumn>
                    <TableColumn>Organisasi</TableColumn>
                    <TableColumn>Lomba</TableColumn>
                    <TableColumn>Terakhir</TableColumn>
                    <TableColumn className="text-right">Aksi</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Belum ada data siswa" items={siswaRows}>
                    {(item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <UserCell
                            name={item.nama}
                            description={
                              item.hasAktivitas
                                ? <Chip size="sm" color="success" variant="flat">Ada aktivitas</Chip>
                                : <Chip size="sm" variant="flat">Belum ada aktivitas</Chip>
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.nis ?? "-"} <span className="text-default-400">/</span> {item.nisn ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell><b>{item.totalAktivitas}</b></TableCell>
                        <TableCell>{item.perJenis.EKSTRAKURIKULER}</TableCell>
                        <TableCell>{item.perJenis.ORGANISASI}</TableCell>
                        <TableCell>{item.perJenis.LOMBA}</TableCell>
                        <TableCell>{fmtDate(item.lastActivityAt)}</TableCell>
                        <TableCell className="text-right">
                          <Tooltip content="Lihat detail aktivitas">
                            <Button
                              size="sm"
                              variant="flat"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onPress={() => openDetail(item.id)}
                            >
                              Detail
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
                    total={Math.max(1, Math.ceil(totalSiswaFiltered / rowsPerPage))}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* MODAL: Detail Aktivitas Siswa */}
      <Modal
        isOpen={showDetail}
        size="3xl"
        onOpenChange={(open) => { if (!open) closeDetail(); }}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Detail Aktivitas Siswa</ModalHeader>
          <ModalBody>
            {!selectedKelasId || !selectedSiswaId ? (
              <div className="text-sm text-default-500">Tidak ada siswa dipilih.</div>
            ) : siswaDetailLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : !siswaDetail ? (
              <div className="text-sm text-default-500">Data tidak ditemukan.</div>
            ) : (
              <>
                <Card>
                  <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-default-500">Nama</div>
                      <div className="font-medium">{siswaDetail.siswa.nama}</div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">NIS / NISN</div>
                      <div className="font-medium">
                        {siswaDetail.siswa.nis ?? "-"} <span className="text-default-400">/</span> {siswaDetail.siswa.nisn ?? "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">Total Aktivitas</div>
                      <div className="font-medium">{siswaDetail.ringkasan.totalAktivitas}</div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">Terakhir</div>
                      <div className="font-medium">{fmtDate(siswaDetail.ringkasan.lastActivityAt)}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-default-500">Ringkasan per Jenis</div>
                      <div className="font-medium text-sm">
                        Ekstrakurikuler: {siswaDetail.ringkasan.perJenis.EKSTRAKURIKULER ?? 0} ·{" "}
                        Organisasi: {siswaDetail.ringkasan.perJenis.ORGANISASI ?? 0} ·{" "}
                        Lomba: {siswaDetail.ringkasan.perJenis.LOMBA ?? 0}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Divider className="my-3" />
                <div className="font-semibold flex items-center gap-2">
                  <InformationCircleIcon className="w-4 h-4" /> Daftar Aktivitas
                </div>

                <Table aria-label="Daftar Aktivitas" isStriped fullWidth removeWrapper>
                  <TableHeader>
                    <TableColumn>Tanggal</TableColumn>
                    <TableColumn>Nama Kegiatan</TableColumn>
                    <TableColumn>Jenis</TableColumn>
                    <TableColumn>Catatan</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Belum ada aktivitas" items={siswaDetail.aktivitas}>
                    {(a) => (
                      <TableRow key={a.id}>
                        <TableCell>{fmtDate(a.tanggal)}</TableCell>
                        <TableCell>{a.namaKegiatan}</TableCell>
                        <TableCell>{a.jenis}</TableCell>
                        <TableCell>{a.catatan ?? "-"}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Divider,
  User as UserCell,
  Tooltip,
  Badge,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { DeviceTabletIcon, EyeIcon } from "@heroicons/react/24/outline";
// import { Eye, Info, RefreshCw } from "lucide-react";

// ---------- Helpers ----------
function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

function fmtName(
  depan?: string,
  tengah?: string | null,
  belakang?: string | null
) {
  return [depan, tengah, belakang].filter(Boolean).join(" ");
}

function fmtDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// ---------- Types (sesuaikan dgn API sebelumnya) ----------
type KelasItem = {
  id: string;
  kelas: string;
  waliKelas?: { id: string; nama: string } | null;
  totalSiswa: number;
  siswaDenganPelanggaran: number;
};

type KelasResponse = {
  success: boolean;
  data: KelasItem[];
};

type KelasDetail = {
  kelas: {
    id: string;
    kelas: string;
    waliKelas?: { id: string; nama: string } | null;
    tahunAjaran: { id: string; tahun: string; aktif: boolean };
  };
  students: Array<{
    id: string;
    nama: string;
    nis?: string | null;
    nisn?: string | null;
    totalPelanggaran: number;
    totalPoin: number;
    lastViolationAt: string | null;
    hasViolation: boolean;
  }>;
};

type KelasDetailResponse = {
  success: boolean;
  data: KelasDetail;
};

type SiswaDetail = {
  siswa: {
    id: string;
    namaDepan?: string;
    namaTengah?: string | null;
    namaBelakang?: string | null;
    nis?: string | null;
    nisn?: string | null;
    nama: string;
  };
  ringkasan: {
    totalPelanggaran: number;
    totalPoin: number;
    lastViolationAt: string | null;
  };
  pelanggaran: Array<{
    id: string;
    jenisPelanggaran: string;
    tanggal: string;
    poin: number;
    tindakan: string;
  }>;
};

type SiswaDetailResponse = {
  success: boolean;
  data: SiswaDetail;
};

// ---------- Services ----------
async function fetchKelas(): Promise<KelasItem[]> {
  const res = await axios.get<KelasResponse>("/api/admin/pelanggaran/kelas");
  return res.data.data ?? [];
}

async function fetchKelasDetail(kelasId: string): Promise<KelasDetail> {
  const res = await axios.get<KelasDetailResponse>(
    `/api/admin/pelanggaran/kelas/${kelasId}`
  );
  return res.data.data;
}

async function fetchSiswaDetail(kelasId: string, siswaId: string) {
  const res = await axios.get<SiswaDetailResponse>(
    `/api/admin/pelanggaran/kelas/${kelasId}/siswa/${siswaId}`
  );
  return res.data.data;
}

// ---------- Page ----------
export default function PelanggaranSiswaPage() {
  const [selectedKelasId, setSelectedKelasId] = useState<string | null>(null);
  const [searchKelas, setSearchKelas] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [showSiswaDetail, setShowSiswaDetail] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);

  // pagination siswa
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Query: list semua kelas
  const {
    data: kelasList,
    isLoading: kelasLoading,
    refetch: refetchKelas,
    isRefetching: kelasRefetching,
  } = useQuery({
    queryKey: ["pelanggaran-kelas"],
    queryFn: fetchKelas,
  });

  // Query: detail kelas → seluruh siswa
  const {
    data: kelasDetail,
    isLoading: siswaLoading,
    refetch: refetchKelasDetail,
    isRefetching: siswaRefetching,
  } = useQuery({
    queryKey: ["pelanggaran-by-kelas", selectedKelasId],
    queryFn: () => fetchKelasDetail(selectedKelasId!),
    enabled: !!selectedKelasId,
  });

  // Query: detail siswa
  const {
    data: siswaDetail,
    isLoading: siswaDetailLoading,
    refetch: refetchSiswaDetail,
    isRefetching: siswaDetailRefetching,
  } = useQuery({
    queryKey: ["pelanggaran-detail-siswa", selectedKelasId, selectedSiswaId],
    queryFn: () => fetchSiswaDetail(selectedKelasId!, selectedSiswaId!),
    enabled: !!selectedKelasId && !!selectedSiswaId && showSiswaDetail,
  });

  const filteredKelas = useMemo(() => {
    if (!kelasList) return [];
    if (!searchKelas.trim()) return kelasList;
    const q = searchKelas.toLowerCase();
    return kelasList.filter(
      (k) =>
        k.kelas.toLowerCase().includes(q) ||
        (k.waliKelas?.nama?.toLowerCase().includes(q) ?? false)
    );
  }, [kelasList, searchKelas]);

  const siswaRows = useMemo(() => {
    const arr = kelasDetail?.students ?? [];
    const q = searchSiswa.toLowerCase().trim();
    const filtered = q
      ? arr.filter(
          (s) =>
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
      ? arr.filter(
          (s) =>
            s.nama.toLowerCase().includes(q) ||
            (s.nis?.toLowerCase().includes(q) ?? false) ||
            (s.nisn?.toLowerCase().includes(q) ?? false)
        ).length
      : arr.length;
  }, [kelasDetail, searchSiswa]);

  const onOpenSiswaDetail = (siswaId: string) => {
    setSelectedSiswaId(siswaId);
    setShowSiswaDetail(true);
  };

  const onCloseSiswaDetail = () => {
    setShowSiswaDetail(false);
    setSelectedSiswaId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl md:text-2xl font-semibold">
          Pelanggaran Siswa
        </div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            onPress={() => {
              refetchKelas();
              if (selectedKelasId) refetchKelasDetail();
              if (showSiswaDetail && selectedKelasId && selectedSiswaId)
                refetchSiswaDetail();
            }}
          >
            {kelasRefetching || siswaRefetching || siswaDetailRefetching ? (
              <Spinner size="sm" />
            ) : (
              <EyeIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* KIRI: Kelas */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-col items-start gap-2">
            <div className="font-semibold">Kelas Aktif</div>
            <Input
              size="sm"
              placeholder="Cari kelas / wali kelas…"
              value={searchKelas}
              onValueChange={setSearchKelas}
            />
          </CardHeader>
          <CardBody className="space-y-2 max-h-[70vh] overflow-auto">
            {kelasLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : filteredKelas.length === 0 ? (
              <div className="text-sm text-default-500">Tidak ada kelas.</div>
            ) : (
              filteredKelas.map((k) => {
                const active = selectedKelasId === k.id;
                return (
                  <button
                    key={k.id}
                    onClick={() => {
                      setSelectedKelasId(k.id);
                      setPage(1);
                    }}
                    className={cn(
                      "w-full text-left rounded-xl border px-3 py-2 transition",
                      active
                        ? "border-primary-500 bg-primary-50"
                        : "border-default-200 hover:bg-default-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{k.kelas}</div>
                      <Badge color={k.siswaDenganPelanggaran > 0 ? "danger" : "default"}>
                        {k.siswaDenganPelanggaran}
                      </Badge>
                    </div>
                    <div className="text-xs text-default-500">
                      Wali: {k.waliKelas?.nama ?? "-"}
                    </div>
                    <div className="text-xs text-default-500">
                      Total siswa: {k.totalSiswa}
                    </div>
                  </button>
                );
              })
            )}
          </CardBody>
        </Card>

        {/* TENGAH: Siswa di kelas */}
        <Card className="lg:col-span-9">
          <CardHeader className="flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold">
                {selectedKelasId
                  ? `Siswa di Kelas ${
                      kelasDetail?.kelas.kelas ?? ""
                    } · TA ${kelasDetail?.kelas.tahunAjaran.tahun ?? ""}`
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
                onValueChange={(v) => {
                  setSearchSiswa(v);
                  setPage(1);
                }}
                isDisabled={!selectedKelasId}
              />
              {selectedKelasId && (
                <Chip variant="flat" color="primary">
                  Total: {totalSiswaFiltered}
                </Chip>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {!selectedKelasId ? (
              <div className="text-sm text-default-500">
                Silakan pilih kelas di panel kiri.
              </div>
            ) : siswaLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                <Table
                  aria-label="Daftar siswa"
                  removeWrapper
                  isStriped
                  fullWidth
                >
                  <TableHeader>
                    <TableColumn>Nama</TableColumn>
                    <TableColumn>NIS / NISN</TableColumn>
                    <TableColumn>Ringkasan</TableColumn>
                    <TableColumn className="text-right">Aksi</TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent="Belum ada data siswa"
                    items={siswaRows ?? []}
                  >
                    {(item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <UserCell
                            name={item.nama}
                            description={
                              item.hasViolation ? (
                                <Chip color="danger" size="sm" variant="flat">
                                  Ada pelanggaran
                                </Chip>
                              ) : (
                                <Chip size="sm" variant="flat">
                                  Tidak ada pelanggaran
                                </Chip>
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.nis ?? "-"}{" "}
                            <span className="text-default-400">/</span>{" "}
                            {item.nisn ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div>
                              Total pelanggaran:{" "}
                              <b>{item.totalPelanggaran}</b>
                            </div>
                            <div>Total poin: <b>{item.totalPoin}</b></div>
                            <div>
                              Terakhir: <b>{fmtDate(item.lastViolationAt)}</b>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Tooltip content="Lihat detail pelanggaran">
                            <Button
                              size="sm"
                              variant="flat"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onPress={() => onOpenSiswaDetail(item.id)}
                            >
                              Detail
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-end mt-4">
                  <Pagination
                    showShadow
                    size="sm"
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

      {/* KANAN: Modal Detail Siswa */}
      <Modal
        isOpen={showSiswaDetail}
        size="3xl"
        onOpenChange={(open) => {
          if (!open) onCloseSiswaDetail();
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Detail Pelanggaran Siswa
          </ModalHeader>
          <ModalBody>
            {!selectedKelasId || !selectedSiswaId ? (
              <div className="text-sm text-default-500">Tidak ada siswa dipilih.</div>
            ) : siswaDetailLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
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
                        {siswaDetail.siswa.nis ?? "-"}{" "}
                        <span className="text-default-400">/</span>{" "}
                        {siswaDetail.siswa.nisn ?? "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">Total Pelanggaran</div>
                      <div className="font-medium">
                        {siswaDetail.ringkasan.totalPelanggaran}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">Total Poin</div>
                      <div className="font-medium">
                        {siswaDetail.ringkasan.totalPoin}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-default-500">Terakhir</div>
                      <div className="font-medium">
                        {fmtDate(siswaDetail.ringkasan.lastViolationAt)}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Divider className="my-3" />

                <div className="font-semibold flex items-center gap-2">
                  <DeviceTabletIcon className="w-4 h-4" />
                  Riwayat Pelanggaran
                </div>

                <Table aria-label="Riwayat pelanggaran" isStriped fullWidth removeWrapper>
                  <TableHeader>
                    <TableColumn>Tanggal</TableColumn>
                    <TableColumn>Jenis Pelanggaran</TableColumn>
                    <TableColumn>Poin</TableColumn>
                    <TableColumn>Tindakan</TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent="Tidak ada pelanggaran"
                    items={siswaDetail.pelanggaran}
                  >
                    {(p) => (
                      <TableRow key={p.id}>
                        <TableCell>{fmtDate(p.tanggal)}</TableCell>
                        <TableCell>{p.jenisPelanggaran}</TableCell>
                        <TableCell>
                          <Chip size="sm" color="danger" variant="flat">
                            {p.poin}
                          </Chip>
                        </TableCell>
                        <TableCell>{p.tindakan}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onCloseSiswaDetail}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

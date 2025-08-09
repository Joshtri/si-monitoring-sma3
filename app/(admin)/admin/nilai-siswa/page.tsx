"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Chip, Spinner, Badge, Tooltip, Pagination, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Divider, User as UserCell
} from "@heroui/react";
import { EyeIcon } from "@heroicons/react/24/outline";
// import { Eye, RefreshCw, Info } from "lucide-react";

type KelasItem = {
  id: string;
  kelas: string;
  waliKelas?: { id: string; nama: string } | null;
  totalSiswa: number;
  siswaDenganNilai: number;
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
    totalEntri: number;
    ratarata: number | null;
    ratarataPerJenis: {
      TUGAS: number | null;
      ULANGAN: number | null;
      UTS: number | null;
      UAS: number | null;
    };
    hasNilai: boolean;
  }>;
};
type KelasDetailResp = { success: boolean; data: KelasDetail };

type SiswaDetail = {
  siswa: { id: string; nama: string; nis?: string | null; nisn?: string | null };
  ringkasan: { totalEntri: number; rataRata: number | null };
  nilai: Array<{ id: string; mapel: string; jenis: "TUGAS"|"ULANGAN"|"UTS"|"UAS"; nilai: number; semester: string }>;
};
type SiswaDetailResp = { success: boolean; data: SiswaDetail };

async function fetchKelas(): Promise<KelasItem[]> {
  const res = await axios.get<KelasResp>("/api/admin/nilai/kelas");
  return res.data.data ?? [];
}
async function fetchKelasDetail(kelasId: string): Promise<KelasDetail> {
  const res = await axios.get<KelasDetailResp>(`/api/admin/nilai/kelas/${kelasId}`);
  return res.data.data;
}
async function fetchSiswaDetail(kelasId: string, siswaId: string): Promise<SiswaDetail> {
  const res = await axios.get<SiswaDetailResp>(`/api/admin/nilai/kelas/${kelasId}/siswa/${siswaId}`);
  return res.data.data;
}

export default function NilaiSiswaPage() {
  const [selectedKelasId, setSelectedKelasId] = useState<string | null>(null);
  const [searchKelas, setSearchKelas] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [showDetail, setShowDetail] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);

  const { data: kelasList, isLoading: kelasLoading, refetch: refetchKelas, isRefetching: kelasRefetching } = useQuery({
    queryKey: ["nilai-kelas"], queryFn: fetchKelas,
  });

  const { data: kelasDetail, isLoading: siswaLoading, refetch: refetchKelasDetail, isRefetching: siswaRefetching } = useQuery({
    queryKey: ["nilai-by-kelas", selectedKelasId],
    queryFn: () => fetchKelasDetail(selectedKelasId!),
    enabled: !!selectedKelasId,
  });

  const { data: siswaDetail, isLoading: siswaDetailLoading, refetch: refetchSiswaDetail, isRefetching: siswaDetailRefetching } = useQuery({
    queryKey: ["nilai-detail-siswa", selectedKelasId, selectedSiswaId],
    queryFn: () => fetchSiswaDetail(selectedKelasId!, selectedSiswaId!),
    enabled: !!selectedKelasId && !!selectedSiswaId && showDetail,
  });

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
      ? arr.filter(s => s.nama.toLowerCase().includes(q) || (s.nis?.toLowerCase().includes(q) ?? false) || (s.nisn?.toLowerCase().includes(q) ?? false))
      : arr;
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [kelasDetail, searchSiswa, page]);

  const totalSiswaFiltered = useMemo(() => {
    const arr = kelasDetail?.students ?? [];
    const q = searchSiswa.toLowerCase().trim();
    return q
      ? arr.filter(s => s.nama.toLowerCase().includes(q) || (s.nis?.toLowerCase().includes(q) ?? false) || (s.nisn?.toLowerCase().includes(q) ?? false)).length
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
      <div className="flex items-center justify-between">
        <div className="text-xl md:text-2xl font-semibold">Nilai Siswa</div>
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
            <EyeIcon className="w-4 h-4" />
          )}
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
                      <Badge color={k.siswaDenganNilai > 0 ? "primary" : "default"}>
                        {k.siswaDenganNilai}
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

        {/* Panel Tengah: Siswa & Ringkasan Nilai */}
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
                <Table aria-label="Ringkasan nilai siswa" removeWrapper isStriped fullWidth>
                  <TableHeader>
                    <TableColumn>Nama</TableColumn>
                    <TableColumn>NIS / NISN</TableColumn>
                    <TableColumn>Rata-rata</TableColumn>
                    <TableColumn>Tugas</TableColumn>
                    <TableColumn>Ulangan</TableColumn>
                    <TableColumn>UTS</TableColumn>
                    <TableColumn>UAS</TableColumn>
                    <TableColumn className="text-right">Aksi</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Belum ada data siswa" items={siswaRows}>
                    {(item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <UserCell
                            name={item.nama}
                            description={
                              item.hasNilai
                                ? <Chip size="sm" color="primary" variant="flat">Ada nilai</Chip>
                                : <Chip size="sm" variant="flat">Belum ada nilai</Chip>
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.nis ?? "-"} <span className="text-default-400">/</span> {item.nisn ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell><b>{item.ratarata ?? "-"}</b></TableCell>
                        <TableCell>{item.ratarataPerJenis.TUGAS ?? "-"}</TableCell>
                        <TableCell>{item.ratarataPerJenis.ULANGAN ?? "-"}</TableCell>
                        <TableCell>{item.ratarataPerJenis.UTS ?? "-"}</TableCell>
                        <TableCell>{item.ratarataPerJenis.UAS ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          <Tooltip content="Lihat detail nilai">
                            <Button size="sm" variant="flat" startContent={<EyeIcon className="w-4 h-4" />} onPress={() => openDetail(item.id)}>
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

      {/* Modal Detail Nilai Siswa */}
      <Modal
        isOpen={showDetail}
        size="3xl"
        onOpenChange={(open) => { if (!open) closeDetail(); }}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Detail Nilai Siswa</ModalHeader>
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
                      <div className="text-xs text-default-500">Total Entri</div>
                      <div className="font-medium">{siswaDetail.ringkasan.totalEntri}</div>
                    </div>
                    <div>
                      <div className="text-xs text-default-500">Rata-rata</div>
                      <div className="font-medium">{siswaDetail.ringkasan.rataRata ?? "-"}</div>
                    </div>
                  </CardBody>
                </Card>

                <Divider className="my-3" />
                <div className="font-semibold flex items-center gap-2">
                  <EyeIcon className="w-4 h-4" /> Daftar Nilai
                </div>

                <Table aria-label="Daftar Nilai" isStriped fullWidth removeWrapper>
                  <TableHeader>
                    <TableColumn>Semester</TableColumn>
                    <TableColumn>Mata Pelajaran</TableColumn>
                    <TableColumn>Jenis</TableColumn>
                    <TableColumn>Nilai</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Belum ada nilai" items={siswaDetail.nilai}>
                    {(n) => (
                      <TableRow key={n.id}>
                        <TableCell>{n.semester}</TableCell>
                        <TableCell>{n.mapel}</TableCell>
                        <TableCell>{n.jenis}</TableCell>
                        <TableCell>
                          <Chip size="sm" color="primary" variant="flat">{n.nilai}</Chip>
                        </TableCell>
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

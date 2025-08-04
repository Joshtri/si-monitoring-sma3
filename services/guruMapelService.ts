// services/guruMapelService.ts

import api from "@/lib/axios";

export async function getMapelByGuru(guruId: string) {
    const res = await api.get(`/api/guru/${guruId}/mapel`);
    return res.data;
}

// guruMapelService.ts - Pilihan 1: Ubah service untuk single mapel
export async function assignMapelToGuru(guruId: string, mataPelajaranId: string) {
    const res = await api.post(`/api/guru/${guruId}/mapel`, {
        mataPelajaranId // ✅ Sesuai dengan API
    });
    return res.data;
}

// Jika butuh assign multiple mapel, buat function terpisah
export async function assignMultipleMapelToGuru(guruId: string, mapelIds: string[]) {
    const promises = mapelIds.map(id => assignMapelToGuru(guruId, id));
    return Promise.all(promises);
}

export async function deleteMapelFromGuru(guruId: string, mapelId: string) {
    const res = await api.delete(`/api/guru/${guruId}/mapel/${mapelId}`);
    return res.data;
}

export async function getAllGuruMapel() {
    const res = await api.get("/api/guru-mapel");
    return res.data;
}
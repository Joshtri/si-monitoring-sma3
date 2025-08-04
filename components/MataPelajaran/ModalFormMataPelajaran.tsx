"use client";

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Button,
  Switch,
  ModalContent,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface MataPelajaranModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nama: string; aktif: boolean }) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  defaultValues?: {
    nama: string;
    aktif: boolean;
  };
}

export function MataPelajaranModalForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "create",
  defaultValues,
}: MataPelajaranModalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      nama: "",
      aktif: true,
    },
  });

  // Populate form with defaultValues if in edit mode
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setValue("nama", defaultValues.nama);
      setValue("aktif", defaultValues.aktif);
    } else {
      reset(); // reset form if create mode
    }
  }, [mode, defaultValues, setValue, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitForm = (data: { nama: string; aktif: boolean }) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>
              {mode === "edit" ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Mata Pelajaran
                  </label>
                  <Input
                    {...register("nama", {
                      required: "Nama mata pelajaran wajib diisi",
                    })}
                    placeholder="Contoh: Matematika"
                    isInvalid={!!errors.nama}
                    errorMessage={errors.nama?.message}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Aktif</label>
                  <Switch {...register("aktif")} isSelected={watch("aktif")} />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={close}>
                Batal
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit((data) => {
                  onSubmit(data);
                  close();
                  reset();
                })}
                isLoading={isLoading}
              >
                Simpan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

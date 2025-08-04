"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Switch } from "@heroui/switch";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useForm, Controller } from "react-hook-form";
import { Image } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: loginMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Redirect berdasarkan role yang diterima dari server
      router.push("/dashboard");
      // Atau refresh halaman untuk memicu middleware
      window.location.href = "/dashboard";
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Terjadi kesalahan saat login";
      alert(msg);
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = (data: { email: string; password: string }) => {
    loginMutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:50px_50px]" />
      </div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-sky-300/10 rounded-full blur-xl animate-pulse delay-500" />

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative z-10">
        {/* Informational Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <Image
                alt="Logo SMA N 3 Kupang"
                src="/img/logoSMA3.png"
                width={80}
                height={80}
                className="object-cover rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-sky-300">SIMON</h2>
                <p className="text-blue-200">SMA Negeri 3 Kupang</p>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
              Selamat Datang di SIMON
            </h1>
            <p className="text-xl mb-4 text-sky-100 font-medium">
              Sistem Informasi Monitoring Siswa
            </p>
            <p className="text-lg text-sky-200 leading-relaxed">
              Pantau kehadiran, nilai, dan perkembangan siswa SMA Negeri 3
              Kupang secara digital.
            </p>
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-lg font-semibold mb-3 text-white">
                Fitur Utama:
              </h3>
              <ul className="space-y-2 text-sky-100">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mr-3" />
                  Monitoring Kehadiran Harian
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mr-3" />
                  Rapor Nilai Akademik & Sikap
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mr-3" />
                  Laporan Disiplin & Reward
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
            <CardHeader className="flex flex-col items-center pt-8 pb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-sky-600 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-blue-100">
                <AcademicCapIcon className="text-white w-10 h-10" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">SIMON</h2>
                <p className="text-sm text-gray-600">SMA Negeri 3 Kupang</p>
              </div>
            </CardHeader>
            <CardBody className="px-8 pb-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: "Email wajib diisi" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Email"
                      placeholder="Masukkan Email Anda"
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                      labelPlacement="outside"
                      classNames={{
                        label: "text-gray-700 font-semibold",
                        input: "text-gray-800 text-base",
                        inputWrapper:
                          "border-2 border-gray-200 hover:border-sky-400 focus-within:border-sky-500 bg-gray-50/50",
                      }}
                      startContent={
                        <UserIcon className="w-5 h-5 text-gray-700" />
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Password wajib diisi" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={isVisible ? "text" : "password"}
                      label="Password"
                      placeholder="Masukkan password"
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.message}
                      labelPlacement="outside"
                      classNames={{
                        label: "text-gray-700 font-semibold",
                        input: "text-gray-800 text-base",
                        inputWrapper:
                          "border-2 border-gray-200 hover:border-sky-400 focus-within:border-sky-500 bg-gray-50/50",
                      }}
                      startContent={
                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                      }
                      endContent={
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className="focus:outline-none"
                        >
                          {isVisible ? (
                            <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      }
                    />
                  )}
                />

                <div className="flex items-center justify-between py-2">
                  <Switch
                    isSelected={rememberMe}
                    onValueChange={setRememberMe}
                    size="sm"
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-blue-600",
                    }}
                  >
                    <span className="text-sm text-gray-600 font-medium ml-2">
                      Ingat saya
                    </span>
                  </Switch>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Lupa password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  radius="lg"
                  size="lg"
                  isLoading={isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 text-lg shadow-lg"
                >
                  Masuk
                </Button>

                <div className="text-center mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    © 2025 SMA Negeri 3 Kupang. Semua Hak Dilindungi.
                  </p>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

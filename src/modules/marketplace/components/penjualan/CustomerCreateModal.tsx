/** @format */

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CustomerCreatePayload = Readonly<{
  name: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  npwp: string;
}>;

export type CustomerCreateModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: CustomerCreatePayload) => Promise<void> | void;
  onCancel?: () => void;
}>;

export function CustomerCreateModal({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CustomerCreateModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Individu");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [npwp, setNpwp] = useState("");

  const resetForm = () => {
    setName("");
    setType("Individu");
    setEmail("");
    setPhone("");
    setAddress("");
    setNpwp("");
  };

  const handleClose = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    const payload: CustomerCreatePayload = {
      name: name.trim(),
      type: type || "Individu",
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      npwp: npwp.trim(),
    };

    if (onSubmit) {
      await onSubmit(payload);
      handleClose(false);
      return;
    }

    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        overlayClassName="bg-gray-900/50 backdrop-blur-sm"
        className="bg-surface-light dark:bg-surface-dark w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-0"
        showCloseButton={false}
      >
        <div className="bg-white dark:bg-surface-dark px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-indigo-600">Tambah Pelanggan Baru</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleClose(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-6 py-6">
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nama Pelanggan
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 sm:text-sm transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Tipe Pelanggan
                </label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-indigo-600/20">
                    <SelectValue placeholder="Individu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individu">Individu</SelectItem>
                    <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 sm:text-sm transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nomor Telepon
                </label>
                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="0812..."
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 sm:text-sm transition-shadow"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Alamat
              </label>
              <Textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Alamat lengkap..."
                rows={3}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 sm:text-sm transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                NPWP
              </label>
              <Input
                value={npwp}
                onChange={(event) => setNpwp(event.target.value)}
                placeholder="Nomor Pokok Wajib Pajak"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 sm:text-sm transition-shadow"
              />
            </div>
          </form>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700">
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-md shadow-indigo-500/20 px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-600/50 sm:ml-0 sm:w-auto sm:text-sm transition-colors"
          >
            Simpan Pelanggan
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onCancel?.();
              handleClose(false);
            }}
            className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-600/50 sm:mt-0 sm:ml-0 sm:w-auto sm:text-sm transition-colors"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

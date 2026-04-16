"use client";

import { useState } from "react";
import { useAdminSerials } from "@/hooks/admin/use-admin-serials";

// ✅ Import Refactored Components
import BulkUploadSerialsModal from "@/components/admin/serial/BulkUploadSerials";
import EditSerialModal from "@/components/admin/serial/EditSerialModal";
import SerialHeader from "@/components/admin/serial/SerialHeader";
import SerialStats from "@/components/admin/serial/SerialStats";
import SerialValidator from "@/components/admin/serial/SerialValidator";
import SerialTable from "@/components/admin/serial/SerialTable";

export default function AdminSerialsPage() {
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState<any>(null);
  const [validateQuery, setValidateQuery] = useState("");

  const {
    serials = [],
    loading = false,
    stats,
    validateSerial,
    updateSerial,
  } = useAdminSerials();

  const handleEditClick = (serial: any) => {
    setSelectedSerial(serial);
    setIsEditOpen(true);
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateSerial(id, data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="space-y-10 min-h-screen bg-white dark:bg-gray-900 pb-24 px-6 md:px-10 pt-4 animate-in fade-in duration-700">
      {/* Modals Layer */}
      <BulkUploadSerialsModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
      />

      {selectedSerial && (
        <EditSerialModal
          isOpen={isEditOpen}
          serial={selectedSerial}
          onClose={() => setIsEditOpen(false)}
          onSave={handleUpdate}
        />
      )}

      {/* 1. Header Section */}
      <SerialHeader onBulkClick={() => setIsBulkOpen(true)} />

      {/* 2. Stats Section */}
      <SerialStats stats={stats} />

      {/* 3. Search/Validation Section */}
      <SerialValidator
        query={validateQuery}
        setQuery={setValidateQuery}
        onValidate={validateSerial}
      />

      {/* 4. Table Section */}
      <SerialTable
        serials={serials}
        loading={loading}
        onEdit={handleEditClick}
      />
    </div>
  );
}

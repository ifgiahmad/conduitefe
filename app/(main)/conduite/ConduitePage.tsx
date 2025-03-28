"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import DataTableConduite from "@/components/data-table/data-table-conduite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { VwConduite } from "@/lib/types/vwconduite";
import { getConduite } from "@/services/service_api_vwconduite";
import { useRouter, useSearchParams } from "next/navigation";
import DialogCrewConduite from "./DialogConduiteForm";
import { getCrewing } from "@/services/service_api_crewing";
import Swal from "sweetalert2";

const ConduitePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seafarerCode = searchParams.get("seafarerCode");
  const [selectedSeafarerCode, setSelectedSeafarerCode] = useState<
    string | null
  >(null);
  const [selectedVslSize, setSelectedVslSize] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isConduiteOpen, setIsConduiteOpen] = useState(false);
  const [data, setData] = useState<VwConduite[]>([]);

  const fetchData = useCallback(async () => {
    if (!seafarerCode) return;
    try {
      const crew = await getCrewing(seafarerCode);
      if (crew && (crew.position === "NAKHODA" || crew.position === "KKM")) {
        const result = await getConduite(seafarerCode as string);
        setData(result);

        if (crew.position === "NAKHODA") {
          setSelectedRole("CRW-NKD");
        } else if (crew.position === "KKM") {
          setSelectedRole("CRW-KKM");
        }
      } else {
        router.push(`/auth`);
      }
    } catch (error) {
      console.error("Error fetching conduite data:", error);
    }
  }, [seafarerCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (
    seafarerCode: string,
    vslSize: string,
    level: string
  ) => {
    setSelectedSeafarerCode(seafarerCode);
    setSelectedVslSize(vslSize);
    setSelectedLevel(level);
    setIsConduiteOpen(true);
  };

  const columns: ColumnDef<VwConduite>[] = [
    {
      header: " ",
      cell: (info: CellContext<VwConduite, unknown>) => {
        const row = info.row.original;
        return (
          <button
            onClick={() =>
              handleOpenModal(
                row.seafarerCode || "",
                row.vslSize || "",
                row.lvlPosition || ""
              )
            }
            className="px-3 py-1 text-white bg-green-900 rounded hover:bg-green-700"
          >
            Conduite
          </button>
        );
      },
    },
    { header: "Nama Crew", accessorKey: "namaLengkap" },
    { header: "Kode Pelaut", accessorKey: "seafarerCode" },
    { header: "Jabatan", accessorKey: "position" },
    { header: "Skor", accessorKey: "score" },
    { header: "Kapal", accessorKey: "vessel" },
  ];

  return (
    <>
      <Card className="mb-2 py-1.5">
        <CardHeader>
          <CardTitle>Daftar Crew</CardTitle>
        </CardHeader>
      </Card>
      <div className="flex-grow overflow-auto min-h-[70vh]">
        <Card className="h-full">
          <CardContent className="h-full">
            <DataTableConduite data={data} columns={columns} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isConduiteOpen} onOpenChange={setIsConduiteOpen}>
        <DialogContent className="w-full max-w-screen-lg sm:max-w-screen-lg h-[90vh] overflow-auto">
          <DialogTitle>Form Conduite</DialogTitle>
          <DialogCrewConduite
            onClose={() => setIsConduiteOpen(false)}
            onSave={fetchData}
            seafarerCode={selectedSeafarerCode || ""}
            vslSize={selectedVslSize || ""}
            level={selectedLevel || ""}
            roleCode={selectedRole || ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConduitePage;

import DataTableAspectScore from "@/components/data-table/data-table-aspect-score";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MsAssessmentAspect } from "@/lib/types/msassessmentaspect";
import { MsAssessmentAspectScore } from "@/lib/types/msassessmentaspectscore";
import {
  createVwCrewConduiteDetail,
  createVwCrewConduiteDetailZod,
  VwCrewConduiteDetail,
} from "@/lib/types/vwcrewconduitedetail";
import { getAssessmentAspectScoreListByAspectId } from "@/services/service_api_msassessmentaspect";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface InputScoreConduiteFormProps {
  onClose: () => void;
  onSave: (data: createVwCrewConduiteDetail) => void; // Perubahan di sini
  conduiteDetailId?: number;
  aspectId: number;
}

const DialogInputScoreConduite = ({
  onClose,
  onSave,
  conduiteDetailId,
  aspectId,
}: InputScoreConduiteFormProps) => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<createVwCrewConduiteDetail>({
    resolver: zodResolver(createVwCrewConduiteDetailZod),
    defaultValues: {
      seafarerCode: "",
      namaLengkap: "",
      month: 0,
      year: 0,
      score: 0,
      crewingId: 0,
      detailId: 0,
      headerId: 0,
      periodeId: 0,
      scoreDescriptionAssessor: "",
    },
  });

  const [model, setModel] = useState<VwCrewConduiteDetail>();
  const [listMasterAspect, setListMasterAspect] = useState<
    MsAssessmentAspectScore[]
  >([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDescIna, setSelectedDescIna] = useState<string | null>(null);
  const [selectedDescEng, setSelectedDescEng] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    setValue,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const columnsDetail: ColumnDef<MsAssessmentAspectScore>[] = [
    {
      header: "Pilih",
      cell: (info) => {
        const row = info.row.original;
        const isChecked = selectedId === row.id;

        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() =>
                handleSelect(
                  row.id,
                  row.scoreDescriptionIna || "",
                  row.scoreDescriptionEng || "",
                  row.score
                )
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        );
      },
    },
    {
      header: "Skor",
      accessorKey: "score",
      cell: (info) => (
        <div className="flex items-center justify-center">
          {info.getValue<number>()}
        </div>
      ),
    },
    {
      header: "Deskripsi Skor",
      accessorKey: "scoreDescriptionIna",
      cell: (info) => (
        <div className="whitespace-normal break-words w-100">
          {info.getValue<string>()}
        </div>
      ),
    },
  ];

  const handleSelect = (
    id: number,
    descIna: string,
    descEng: string,
    score: number
  ) => {
    setSelectedId(id);
    setSelectedDescIna(descIna);
    setSelectedDescEng(descEng);
    setSelectedScore(score);
  };

  useEffect(() => {
    fetchData();
  }, [setValue]);

  const fetchData = async () => {
    try {
      const listAspect = await getAssessmentAspectScoreListByAspectId(aspectId);
      setListMasterAspect(listAspect);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const onSubmit = async (data: createVwCrewConduiteDetail) => {
    setLoading(true);

    if (!selectedId) {
      setErrorMessage("Harap pilih salah satu skor sebelum menyimpan.");
      setLoading(false);
      return;
    }

    const finalData: createVwCrewConduiteDetail = {
      ...data, // Data dari form
      score: selectedScore || 0, // ID skor yang dipilih
      scoreDescriptionIna: selectedDescIna || "", // Deskripsi skor
      scoreDescriptionEng: selectedDescEng || "", // Nilai skor
      aspectId: aspectId,
      detailId: conduiteDetailId,
    };
    onSave(finalData);
    setLoading(false);
    onClose;
  };

  return (
    <>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        {" "}
        <Card>
          <CardHeader>
            <CardTitle>Pilih salah satu dari pilihan berikut</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTableAspectScore
              data={listMasterAspect}
              columns={columnsDetail}
            />
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
          </CardContent>
        </Card>
        <Card className="mt-1">
          <CardHeader>
            <CardTitle>Deskripsi dari penilai (Tidak Wajib)</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 lg:grid-cols-4"
              >
                <FormField
                  name="scoreDescriptionAssessor"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormControl>
                        <Textarea
                          placeholder="Deskripsi"
                          {...field}
                          className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="md:col-span-4 flex flex-wrap justify-end items-center mt-4 gap-2">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white hover:bg-gray-200 text-gray-700"
                  >
                    Keluar
                  </Button>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-orange-700 hover:bg-orange-500"
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DialogInputScoreConduite;

import DataTableCrewConduiteDetail from "@/components/data-table/data-table-crew-conduite-detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConduitePeriod } from "@/lib/types/conduiteperiod";
import { Crewing } from "@/lib/types/crewing";
import { MsAssessmentAspect } from "@/lib/types/msassessmentaspect";
import {
  createVwCrewConduite,
  createVwCrewConduiteZod,
  VwCrewConduite,
} from "@/lib/types/vwcrewconduite";
import {
  createVwCrewConduiteDetail,
  VwCrewConduiteDetail,
} from "@/lib/types/vwcrewconduitedetail";
import { getPeriod } from "@/services/service_api_conduite_period";
import { getCrewing } from "@/services/service_api_crewing";
import { getAssessmentAspectList } from "@/services/service_api_msassessmentaspect";
import { getCrewConduiteByCrwIdMonthYearList } from "@/services/service_api_vwcrewconduite";
import { getCrewConduiteDetailList } from "@/services/service_api_vwcrewconduitedetail";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { string } from "zod";
import DialogInputScoreConduite from "./DialogInputScoreForm";
import { saveTrConduite } from "@/services/service_api_conduite";
import { TrConduite } from "@/lib/types/trcrewconduite";

interface CrewConduiteFormProps {
  onClose: () => void;
  onSave: () => void;
  seafarerCode: string;
  vslSize: string;
  level: string;
  roleCode: string;
}

const DialogCrewConduite = ({
  onClose,
  onSave,
  seafarerCode,
  vslSize,
  level,
  roleCode,
}: CrewConduiteFormProps) => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<createVwCrewConduite>({
    resolver: zodResolver(createVwCrewConduiteZod),
    defaultValues: {
      id: Number(0),
      seafarerCode: "",
      namaLengkap: "",
      vessel: "",
      position: "",
      description: "",
      month: 0,
      year: 0,
      totalScore: 0,
    },
  });

  const [modelHeader, setModelHeader] = useState<VwCrewConduite>();
  const [modelDetail, setModelDetail] = useState<VwCrewConduiteDetail[]>([]);
  const [modelPeriod, setModelPeriod] = useState<ConduitePeriod>();
  const [modelCrew, setModelCrew] = useState<Crewing>();
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [idHeader, setIdHeader] = useState<number | null>(null);
  const [selectedAspectId, setSelectedAspectId] = useState<number | null>(null);
  const [selectedConduiteDetailId, setSelectedConduiteDetailId] = useState<
    number | null
  >(null);
  const [isInputScore, setIsInputScore] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    setValue,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const columnsDetail = [
    {
      header: " ",
      cell: (info: CellContext<VwCrewConduiteDetail, unknown>) => {
        const row = info.row.original;
        return (
          <button
            onClick={() => handleInputScore(row.aspectId, row.detailId)}
            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Input Score
          </button>
        );
      },
    },
    { header: "Tipe Aspek", accessorKey: "aspectTypeIna" },
    { header: "Aspek", accessorKey: "aspectIna" },
    {
      header: "Deskripsi Aspek",
      accessorKey: "aspectDescIna",
      cell: (info: CellContext<VwCrewConduiteDetail, unknown>) => (
        <div className="whitespace-normal break-words w-full">
          {info.getValue<string>()}
        </div>
      ),
    },
    { header: "Skor", accessorKey: "score" },
    {
      header: "Deskripsi Skor",
      accessorKey: "scoreDescriptionIna",
      cell: (info: CellContext<VwCrewConduiteDetail, unknown>) => (
        <div className="whitespace-normal break-words w-full">
          {info.getValue<string>()}
        </div>
      ),
    },
    {
      header: "Deksripisi Penilai",
      accessorKey: "scoreDescriptionAssessor",
      cell: (info: CellContext<VwCrewConduiteDetail, unknown>) => (
        <div className="whitespace-normal break-words w-full">
          {info.getValue<string>()}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [seafarerCode, setValue]);

  const fetchData = async () => {
    try {
      const today = new Date();

      // Buat salinan tanggal agar tidak mengubah `today`
      const lastMonthDate = new Date(today);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

      const month = lastMonthDate.getMonth() + 1; // `getMonth()` dimulai dari 0
      const year = lastMonthDate.getFullYear();

      // Ambil periode berdasarkan bulan dan tahun
      const period = await getPeriod(month, year);

      if (!period) {
        Swal.fire({
          title: "Error!",
          text: "Periode Conduite untuk bulan ini belum dibuat",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Pastikan `endDate` dalam format `Date` sebelum dibandingkan
      const periodEndDate = period.endDate ? new Date(period.endDate) : null;

      if (!periodEndDate || today <= periodEndDate) {
        console.log("Fetching crew data...");

        const dataCrew = await getCrewing(seafarerCode);

        setModelCrew(dataCrew);

        if (dataCrew) {
          // Ambil listConduite berdasarkan crewingId, bulan, dan tahun
          const listConduite = await getCrewConduiteByCrwIdMonthYearList(
            Number(dataCrew.id),
            month,
            year,
            roleCode
          );

          if (Array.isArray(listConduite) && listConduite.length > 0) {
            const selectedModel = listConduite[0]; // Simpan ke variabel sementara
            setModelHeader(selectedModel);

            // Ambil detail berdasarkan ID yang dipilih
            const detailResponse = await getCrewConduiteDetailList(
              selectedModel.id
            );
            setIdHeader(selectedModel.id);
            setModelDetail(detailResponse);

            setValue("crewingId", selectedModel.crewingId ?? "");
            setValue("namaLengkap", selectedModel.namaLengkap ?? "");
            setValue("seafarerCode", selectedModel.seafarerCode ?? "");
            setValue("position", selectedModel.position ?? "");
            setValue("vessel", selectedModel.vessel ?? "");
            setValue("periodId", period.id ?? "");
            setValue("roleCodeAssessor", roleCode ?? "");
            setValue("id", selectedModel.id ?? "");
          } else {
            // Jika `listConduite` kosong, isi dengan data `dataCrew`
            setValue("crewingId", dataCrew.id ?? "");
            setValue("namaLengkap", dataCrew.name ?? "");
            setValue("seafarerCode", dataCrew.seafarerCode ?? "");
            setValue("position", dataCrew.position ?? "");
            setValue("vessel", dataCrew.vessel ?? "");
            setValue("periodId", period.id ?? "");
            setValue("roleCodeAssessor", roleCode ?? "");
            // Ambil data aspek penilaian yang difilter
            const detailResponse = await getFilteredAssessmentAspects(
              level,
              vslSize
            );
            setModelDetail(detailResponse);
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: "Data kru tidak ditemukan",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        setIsClosed(true);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleInputScore = (aspectId: number, conduiteDetailId: number) => {
    setSelectedAspectId(aspectId);
    setSelectedConduiteDetailId(conduiteDetailId);
    setIsInputScore(true);
  };

  const handleSaveDetail = () => {
    fetchData();
  };

  const handleSaveScore = (data: createVwCrewConduiteDetail) => {
    setModelDetail((prevList: VwCrewConduiteDetail[]) =>
      prevList.map((item) =>
        item.aspectId === data.aspectId ? { ...item, ...data } : item
      )
    );
    setIsInputScore(false);
  };

  async function getFilteredAssessmentAspects(
    level: string,
    vslSize: string
  ): Promise<VwCrewConduiteDetail[]> {
    const assessmentAspectList: MsAssessmentAspect[] =
      await getAssessmentAspectList();

    return assessmentAspectList
      .filter((item) => item.position === level && item.vslSize === vslSize)
      .map(
        (item) =>
          ({
            aspectDescIna: item.aspectDescIna,
            aspectDescEng: item.aspectDescEng,
            aspectId: item.id,
            aspectEng: item.aspectEng,
            aspectIna: item.aspectIna,
            aspectTypeEng: item.aspectTypeEng,
            aspectTypeIna: item.aspectTypeIna,
          } as VwCrewConduiteDetail)
      );
  }

  const onSubmit = async (model: createVwCrewConduite) => {
    const hasInvalidScore = modelDetail.some(
      (item) => !item.score || item.score === 0 || item.score === null
    );

    if (hasInvalidScore) {
      setErrorMessage(
        "Terdapat skor dengan nilai 0 atau kosong. Harap periksa kembali."
      );
      setLoading(false);
      return;
    }

    const requestData = { model, modelDetail };
    try {
      const response = await saveTrConduite(requestData);
      if (response.status === 200) {
        onSave();
        onClose();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Gagal menyimpan data",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal mengirim data",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        {isClosed ? (
          <Card className="mb-2">
            <p className="text-red-500 text-center">
              Periode Conduite Sudah Ditutup
            </p>
          </Card>
        ) : (
          <>
            {" "}
            <Card className="mb-2">
              <CardHeader>
                <CardTitle>Data Crew</CardTitle>
              </CardHeader>
              <CardContent>
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                  >
                    <Card className="p-1">
                      <FormField
                        name="seafarerCode"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Kode Pelaut</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Kode Pelaut"
                                {...field}
                                readOnly
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.seafarerCode?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="namaLengkap"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Nama Crew</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nama Crew"
                                {...field}
                                readOnly
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.namaLengkap?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </Card>
                    <Card className="p-2">
                      <FormField
                        name="vessel"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Kapal</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Kapal"
                                {...field}
                                readOnly
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>{errors.vessel?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="position"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Jabatan</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jabatan"
                                {...field}
                                readOnly
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.position?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </Card>
                    <Card className="p-2">
                      <FormField
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Deskripsi"
                                {...field}
                                className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.description?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </Card>

                    <div className="md:col-span-4 flex flex-wrap justify-end items-center mt-1 gap-2">
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
            <Card>
              <CardHeader>
                <CardTitle>Daftar Penilaian</CardTitle>
              </CardHeader>
              <CardContent>
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
                <DataTableCrewConduiteDetail
                  data={modelDetail}
                  columns={columnsDetail}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Dialog open={isInputScore} onOpenChange={setIsInputScore}>
        <DialogContent className="w-full max-w-screen-lg sm:max-w-screen-md h-[100vh] overflow-auto">
          <DialogTitle>Form Input Score</DialogTitle>
          <DialogInputScoreConduite
            onClose={() => setIsInputScore(false)}
            onSave={handleSaveScore}
            conduiteDetailId={selectedConduiteDetailId || 0}
            aspectId={selectedAspectId || 0}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogCrewConduite;

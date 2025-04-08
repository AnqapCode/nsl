"use client";

// * Modules
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// * UI
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// * Local
import { checkSchema, UrlCheckData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkUrl } from "@/server/actions/urls/check-url-safety";
import { AlertTriangle, Check, CircleCheckBig, InfoIcon, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { motion } from "motion/react";

const CheckUrlSafe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInfo, setMessageInfo] = useState<{
    flagged: boolean;
    reason: string | null;
    message: string | null;
  } | null>(null);

  const onDelete = () => {
    setMessageInfo(null);
  };

  const form = useForm<UrlCheckData>({
    resolver: zodResolver(checkSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: UrlCheckData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("url", data.url);

      const response = await checkUrl(formData);
      setMessageInfo(null);

      if (response.success) {
        setMessageInfo({
          flagged: response.data!.flagged,
          reason: response.data?.flagReason || null,
          message: response.data?.message || null,
        });
        toast.success(`${data.url}`, {
          description: "Berhasil di periksa",
        });
      } else {
        toast.error(`${response.error}`);
      }
    } catch (error) {
      setError("An error occured. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1 relative">
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Paste your long URL here" {...field} disabled={isLoading} type="url" className="pr-10" />
                        {field.value && ( // Gunakan field.value bukan form.watch
                          <button
                            type="button" // Penting untuk mencegah submit form
                            onClick={() => {
                              field.onChange("");
                              onDelete();
                            }} // Langsung kosongkan value
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear input"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading || !form.watch("url")}>
                {isLoading ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Check Progress ...
                  </>
                ) : (
                  "Check URL"
                )}
              </Button>
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

            <Card>
              <CardContent className="p-4">
                <motion.div
                  key={messageInfo ? `message-${messageInfo.flagged}` : "default-message"}
                  initial={{ opacity: 0.0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  {messageInfo ? (
                    <div
                      className={`mt-3 p-6 ${
                        messageInfo.flagged ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                      }  rounded-md`}
                    >
                      {/* <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" /> */}
                      {messageInfo.flagged ? (
                        <>
                          <div className="flex justify-center mb-3">
                            <div className="size-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                              <AlertTriangle className="size-8 text-yellow-600 dark:text-yellow-400" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">URL yang anda inputkan terdeteksi mencurigakan</p>
                              <p className="text-xs text-start text-yellow-700 dark:text-yellow-400 mt-1">{messageInfo.message}</p>
                              {/* {messageInfo.reason && (
                              <p className="text-sm mt-2 text-start text-yellow-600 dark:text-yellow-400">
                                <span className="font-medium">Reason:</span> {messageInfo.reason}
                              </p>
                            )} */}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-center mb-3">
                            <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center">
                              <CircleCheckBig strokeWidth={2.5} className="size-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">URL yang anda inputkan terdeteksi aman</p>
                              <p className="text-xs text-start text-emerald-700 dark:text-emerald-400 mt-1">{messageInfo.message}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 p-6 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-md text-center">
                      {/* Bagian icon dan judul */}
                      <div className="flex justify-center mb-3">
                        <div className="size-16 rounded-full bg-cyan-100 dark:bg-cyan-800/30 flex items-center justify-center">
                          <InfoIcon strokeWidth={2.5} className="size-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-cyan-800 dark:text-cyan-300">Pemeriksa Keamanan Link</p>

                      {/* Bagian deskripsi dengan alignment berbeda */}
                      <div className="text-left py-2">
                        <p className="text-cyan-600 dark:text-cyan-400 text-xs mt-1">Sistem kami akan melakukan pemeriksaan keamanan menyeluruh yang mencakup berbagai aspek penting:</p>
                        <ul className="list-disc pl-5 space-y-1 text-cyan-600 dark:text-cyan-400 text-xs mt-1">
                          <li>
                            <span className="font-medium">Verifikasi keaslian domain</span> - Memeriksa registrasi domain, validitas sertifikat SSL, usia domain, dan kemiripan dengan domain terkenal untuk mendeteksi upaya penipuan
                            (typo-squatting)
                          </li>
                          <li>
                            <span className="font-medium">Deteksi teknik phishing</span> - Menganalisis struktur URL, konten halaman, formulir input, dan pola umum yang biasa digunakan dalam serangan phishing untuk mencuri data sensitif
                          </li>
                          <li>
                            <span className="font-medium">Analisis reputasi situs</span> - Mengecek berbagai database blacklist global, riwayat pelaporan abuse, aktivitas mencurigakan, dan reputasi domain berdasarkan sumber terpercaya
                          </li>
                          <li>
                            <span className="font-medium">Pemindaian indikasi malware</span> - Mendeteksi skrip berbahaya, iframe mencurigakan, link eksternal berisiko, serta pola serangan yang dikenal seperti cross-site scripting (XSS)
                            atau injeksi kode
                          </li>
                          <li>
                            <span className="font-medium">Evaluasi keamanan konten</span> - Memeriksa elemen halaman yang berpotensi berbahaya termasuk pop-up, redirect tersembunyi, dan konten eksploitatif
                          </li>
                        </ul>
                        <p className="text-cyan-600 dark:text-cyan-400 text-xs mt-2 italic">Hasil pemeriksaan memberikan gambaran komprehensif tentang tingkat keamanan link sebelum Anda melanjutkan ke situs tersebut.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CheckUrlSafe;

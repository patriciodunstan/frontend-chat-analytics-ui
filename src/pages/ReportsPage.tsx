

import React, { useEffect, useState } from "react";
import { Plus, Download, FileText, Loader2, Calendar } from "lucide-react";
import { reportsApi } from "../services/api";
import type { Report, ReportRequest } from "../types";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // New Report Form State
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportType, setNewReportType] = useState<
    ReportRequest["report_type"]
  >("data_summary");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await reportsApi.list();
      setReports(response.data.reports);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await reportsApi.generate({
        title: newReportTitle,
        report_type: newReportType,
      });
      toast.success("Report generation started");
      setShowModal(false);
      setNewReportTitle("");
      loadReports();
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async (id: number, title: string) => {
    try {
      const res = await reportsApi.download(id);
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Generate and view detailed analysis of your chat data.
          </p>
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleGenerate}>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Create a new analysis report from your chat data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    value={newReportTitle}
                    onChange={(e) => setNewReportTitle(e.target.value)}
                    placeholder="e.g., Q1 Performance Review"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Report Type</Label>
                  <select
                    id="type"
                    value={newReportType}
                    onChange={(e) =>
                      setNewReportType(
                        e.target.value as ReportRequest["report_type"]
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="data_summary">Data Summary</option>
                    <option value="trend_analysis">Trend Analysis</option>
                    <option value="custom">Custom Analysis</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Create Report"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="group hover:bg-muted/50 transition-colors"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center border",
                      report.status === "completed"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : report.status === "processing"
                        ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}
                  >
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                        {report.report_type.replace("_", " ")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full",
                      report.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : report.status === "processing"
                        ? "bg-indigo-500/10 text-indigo-500 animate-pulse"
                        : "bg-red-500/10 text-red-500"
                    )}
                  >
                    {report.status}
                  </span>

                  {report.status === "completed" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => downloadReport(report.id, report.title)}
                    >
                      <Download size={18} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <FileText size={48} className="mx-auto mb-4" />
              <p>No reports generated yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

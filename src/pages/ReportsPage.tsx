import React, { useEffect, useState } from 'react';
import { Plus, Download, FileText, Loader2, Calendar } from 'lucide-react';
import { reportsApi } from '../services/api';
import type { Report, ReportRequest } from '../types';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // New Report Form State
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportType, setNewReportType] = useState<ReportRequest['report_type']>('data_summary');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await reportsApi.list();
      setReports(response.data.reports);
    } catch {
      toast.error('Failed to load reports');
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
      toast.success('Report generation started');
      setShowModal(false);
      setNewReportTitle('');
      loadReports();
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async (id: number, title: string) => {
    try {
      // Fetch blob with auth headers
      // For simplicity assuming the API client handles blob downloads or we use a direct link if public.
      // But wait, our API client is Axios. 
      // Let's use a simple window.open if cookies are used, or Axios blob fetch if Bearer token needed.
      // Since we use Bearer token, we need to fetch via Axios.
      
      const res = await reportsApi.download(id);
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Download failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-[var(--text-muted)]">Generate and view detailed analysis of your chat data.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="glass-button px-6 py-3 flex items-center gap-2 font-medium bg-[var(--primary)] border-[var(--primary)] hover:brightness-110"
        >
          <Plus size={20} />
          New Report
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        </div>
      ) : (
        <div className="grid gap-4 animate-slide-up">
          {reports.map((report) => (
            <div key={report.id} className="glass-panel p-6 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  report.status === 'completed' ? 'bg-[rgba(16,185,129,0.2)] text-[var(--success)]' :
                  report.status === 'processing' ? 'bg-[rgba(99,102,241,0.2)] text-[var(--primary)]' :
                  'bg-[rgba(239,68,68,0.2)] text-[var(--error)]'
                }`}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mt-1">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-xs">
                      {report.report_type.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  report.status === 'completed' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--success)]' :
                  report.status === 'processing' ? 'bg-[rgba(99,102,241,0.1)] text-[var(--primary)] animate-pulse' :
                  'bg-[rgba(239,68,68,0.1)] text-[var(--error)]'
                }`}>
                  {report.status}
                </span>
                
                {report.status === 'completed' && (
                  <button 
                    onClick={() => downloadReport(report.id, report.title)}
                    className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    <Download size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <FileText size={48} className="mx-auto mb-4" />
              <p>No reports generated yet</p>
            </div>
          )}
        </div>
      )}

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 m-4 relative">
             <h2 className="text-xl font-bold mb-6">Generate New Report</h2>
             
             <form onSubmit={handleGenerate} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Report Title</label>
                 <input
                   type="text"
                   required
                   value={newReportTitle}
                   onChange={(e) => setNewReportTitle(e.target.value)}
                   className="glass-input"
                   placeholder="e.g., Q1 Performance Review"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Type</label>
                 <select
                   value={newReportType}
                   onChange={(e) => setNewReportType(e.target.value as ReportRequest['report_type'])}
                   className="glass-input"
                 >
                   <option value="data_summary" className="bg-[var(--bg-app)]">Data Summary</option>
                   <option value="trend_analysis" className="bg-[var(--bg-app)]">Trend Analysis</option>
                   <option value="custom" className="bg-[var(--bg-app)]">Custom Analysis</option>
                 </select>
               </div>

               <div className="flex gap-3 mt-8">
                 <button
                   type="button"
                   onClick={() => setShowModal(false)}
                   className="flex-1 px-4 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={isGenerating}
                   className="flex-1 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                 >
                   {isGenerating ? 'Generating...' : 'Create Report'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

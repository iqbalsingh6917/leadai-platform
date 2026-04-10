'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useBulkImport } from '@/hooks/useLeads';
import toast from 'react-hot-toast';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_CSV =
  'firstName,lastName,email,phone,company,source,status,notes,tags\n' +
  'Arjun,Sharma,arjun@example.com,9876543210,Acme Corp,website,new,Interested in product,hot,vip\n' +
  'Priya,Patel,priya@example.com,,Tech Ltd,referral,qualified,,\n';

function downloadSampleCSV() {
  const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(SAMPLE_CSV);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'sample-leads.csv';
  link.click();
}

interface ImportResult {
  imported: number;
  failed: number;
  errors: string[];
}

export function BulkImportModal({ isOpen, onClose }: BulkImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const { mutateAsync: bulkImport, isPending } = useBulkImport();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await bulkImport(formData);
      setResult(res);
      if (res.imported > 0) {
        toast.success(`Imported ${res.imported} lead${res.imported !== 1 ? 's' : ''}`);
      }
    } catch {
      toast.error('Import failed');
    }
  }

  function handleClose() {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Leads from CSV" size="md">
      <div className="space-y-4">
        {/* Format hint */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-1">Expected CSV columns:</p>
          <code className="text-xs text-slate-500 break-all">
            firstName, lastName, email, phone, company, source, status, notes, tags
          </code>
          <div className="mt-2">
            <button
              type="button"
              onClick={downloadSampleCSV}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              Download Sample CSV
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CSV File
            </label>
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              {file ? (
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm text-slate-500">Click to select a CSV file</p>
                  <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-emerald-600">{result.imported}</span> imported.{' '}
                  {result.failed > 0 && (
                    <span className="font-semibold text-rose-600">{result.failed} failed.</span>
                  )}
                </p>
              </div>
              {result.errors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <p className="text-xs font-medium text-rose-600">Errors:</p>
                  </div>
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-rose-500">{err}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              {result ? 'Close' : 'Cancel'}
            </Button>
            {!result && (
              <Button type="submit" disabled={isPending || !file}>
                {isPending ? 'Importing…' : 'Import'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}

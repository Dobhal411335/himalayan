"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react";
const PackagePdf = ({ productData, packageId }) => {
  // State for PDF entries
  const [pdfRows, setPdfRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [pdfLog, setPdfLog] = useState([]); // [{ name, url }]
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const handleDeleteRow = (idx) => {
    if (pdfRows.length === 1) return;
    setPdfRows(rows => rows.filter((_, i) => i !== idx));
  }
  const productName = productData?.title || "";
  console.log(pdfRows)
  // Add more PDF row
  const handleAddRow = () => setPdfRows([...pdfRows, { name: "", file: null }]);
  // Remove a row
  // Handle input change
  const handleChange = (idx, field, value) =>
    setPdfRows(rows => rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  // Cloudinary PDF upload handler
  const handlePdfUpload = async (file, idx) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }
    if (!pdfRows[idx]?.name || pdfRows[idx].name.trim() === "") {
      toast.error("First enter the PDF title before uploading the file.");
      return;
    }
    setUploadingIdx(idx);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Pass the PDF name as 'title' for filename use
      formData.append('title', pdfRows[idx]?.name || file.name || 'Untitled');
      // Optionally: formData.append('upload_preset', 'your_upload_preset');
      const res = await fetch('/api/uploadPdf', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('PDF upload failed');
      const result = await res.json();
      // Update the PDF row with Cloudinary url and key
      setPdfRows(rows =>
        rows.map((row, i) =>
          i === idx ? { ...row, file, url: result.url, key: result.key } : row
        )
      );
      // Optionally show a toast
      toast.success('PDF uploaded successfully');
    } catch (err) {
      toast.error('PDF upload failed');
    } finally {
      setSaving(false);
      setUploadingIdx(null);
    }
  };

  // Save handler to upload PDF data to DB
  const handleSave = async e => {
    e.preventDefault();
    // Check for missing fields before saving
    // Only submit rows that have BOTH name and url
    const rowsToSave = pdfRows.filter(row => row.name && row.url);
    if (rowsToSave.length === 0) {
      toast.error("Please enter both a PDF name and upload a PDF file for every row before saving.");
      return;
    }
    setSaving(true);
    let allSuccess = true;
    for (const row of rowsToSave) {
      // Only save if not already in DB (no _id)
      if (row.url && !row._id) {
        try {
          const res = await fetch('/api/packagePdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              packageId,
              name: row.name,
              url: row.url,
              key: row.key
            })
          });
          const result = await res.json();
          if (!result.success) {
            allSuccess = false;
            toast.error(result.error || 'Failed to save PDF');
          } else {
            toast.success('PDF saved to database');
            setPdfLog(log => [...log, { name: row.name, url: row.url, key: row.key }]);
          }
        } catch (err) {
          allSuccess = false;
          toast.error('Error saving PDF to DB');
        }
      }
    }
    if (allSuccess) {
      // Refetch all PDFs from the backend to update the UI with all saved PDFs
      try {
        const res = await fetch(`/api/packagePdf?packageId=${packageId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          let newRows = data.data.map(pdf => ({
            _id: pdf._id,
            name: pdf.name,
            url: pdf.url,
            key: pdf.key,
            file: null
          }));
          // Always show at least one empty row if no PDFs exist
          if (newRows.length === 0) {
            newRows = [{ name: '', file: null }];
          } else if (!newRows.some(row => !row.name && !row.url)) {
            newRows.push({ name: '', file: null });
          }
          setPdfRows(newRows);
        } else {
          setPdfRows([{ name: '', file: null }]);
        }
      } catch {
        setPdfRows([{ name: '', file: null }]);
      }
    }
    setSaving(false);
  };


  // View PDF handler
  const handleView = url => setSelectedPdfUrl(url);

  // Fetch PDFs for this package on mount
  React.useEffect(() => {
    async function fetchPdfs() {
      try {
        const res = await fetch(`/api/packagePdf?packageId=${packageId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          let newRows = data.data.map(pdf => ({
            _id: pdf._id,
            name: pdf.name,
            url: pdf.url,
            key: pdf.key,
            file: null
          }));
          // Always show at least one empty row if no PDFs exist
          if (newRows.length === 0) {
            newRows = [{ name: '', file: null }];
          } else if (!newRows.some(row => !row.name && !row.url)) {
            newRows.push({ name: '', file: null });
          }
          setPdfRows(newRows);
        } else {
          setPdfRows([{ name: '', file: null }]);
        }
      } catch {
        setPdfRows([{ name: "", file: null }]);
      }
    }
    fetchPdfs();
  }, [packageId]);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold underline mb-2">Upload PDF</h2>
      <form onSubmit={handleSave} className="space-y-4">
        {pdfRows.map((row, idx) => (
          <div
            key={row._id || idx}
            className="flex items-center gap-2 mb-3 bg-white rounded-lg shadow-sm px-2 py-2 border border-blue-100"
          >
            <input
              type="text"
              value={row.name}
              onChange={e => handleChange(idx, "name", e.target.value)}
              placeholder="PDF Name"
              className="bg-blue-50 text-gray-900 px-3 py-2 rounded-l-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 font-medium text-base"
              style={{ minWidth: 0 }}
            />
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => handlePdfUpload(e.target.files[0], idx)}
            />
            <div
              className={`transition-colors duration-150 px-4 py-2 rounded-md font-semibold text-base flex items-center justify-center
    ${row.file || row.url ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-blue-700'}
  `}
              style={{ minWidth: 200 }}
            >
              {uploadingIdx === idx ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin px-2" />
                  Uploading...
                </span>
              ) : row.url ? (
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-white inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {row.name || (row.file && row.file.name) || 'Uploaded!'}
                  </span>
                </span>
              ) : row.file ? (
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-white inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {row.name || row.file.name || 'Uploaded!'}
                  </span>
                </span>
              ) : (
                row.name ? `Upload: ${row.name}` : "Upload PDF"
              )}
            </div>
            {row.url && (
              <button
                type="button"
                className="ml-2 text-blue-700 hover:text-blue-900"
                title="View PDF"
                onClick={() => handleView(row.url)}
                style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            )}
            {pdfRows.length > 1 && (
              <button
                type="button"
                className="ml-1 bg-red-600 hover:bg-red-800 text-white w-9 h-9 flex items-center justify-center rounded-full text-xl font-bold shadow"
                onClick={() => handleDeleteRow(idx)}
                tabIndex={-1}
                aria-label="Delete PDF Row"
                title="Delete this row"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {idx === pdfRows.length - 1 && (
              <button
                type="button"
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white w-9 h-9 flex items-center justify-center rounded-full text-2xl font-bold shadow"
                onClick={handleAddRow}
                tabIndex={-1}
                aria-label="Add PDF Row"
              >
                +
              </button>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 font-semibold text-lg mt-2"
          disabled={saving}
        >
          {saving ? "Saving..." : "Data Save"}
        </button>
      </form>
      {/* Modal PDF Viewer */}
      {selectedPdfUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 2px 16px #0008', position: 'relative' }}>
            <button style={{ position: 'absolute', top: 8, right: 8, fontSize: 24, background: 'transparent', border: 'none', cursor: 'pointer', color: '#333' }} onClick={() => setSelectedPdfUrl(null)}>&times;</button>
            <iframe
              src={selectedPdfUrl}
              width="800px"
              height="600px"
              style={{ border: 'none', maxWidth: '80vw', maxHeight: '80vh' }}
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagePdf;
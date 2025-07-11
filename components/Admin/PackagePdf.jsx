"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast"
const PackagePdf = ({ productData }) => {
  // State for PDF entries
  const [pdfRows, setPdfRows] = useState([{ name: "", file: null }]);
  const [saving, setSaving] = useState(false);
  const [pdfLog, setPdfLog] = useState([]); // [{ name, url }]
  const productName = productData?.title || "";

  // Add more PDF row
  const handleAddRow = () => setPdfRows([...pdfRows, { name: "", file: null }]);
  // Remove a row
  const handleRemoveRow = idx =>
    setPdfRows(rows => (rows.length > 1 ? rows.filter((_, i) => i !== idx) : rows));
  // Handle input change
  const handleChange = (idx, field, value) =>
    setPdfRows(rows => rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  // Cloudinary PDF upload handler
  const handlePdfUpload = async (file, idx) => {
    if (!file) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Optionally: formData.append('upload_preset', 'your_upload_preset');
      const res = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('PDF upload failed');
      const result = await res.json();
      // Update the PDF row with Cloudinary url and key
      setPdfRows(rows =>
        rows.map((row, i) =>
          i === idx ? { ...row, url: result.url, key: result.key } : row
        )
      );
      // Optionally show a toast
      toast.success('PDF uploaded successfully');
    } catch (err) {
      toast.error('PDF upload failed');
    } finally {
      setSaving(false);
    }
  };

  // Save handler (simulate upload)
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    // Only add rows with a Cloudinary url
    setPdfLog(log => [
      ...log,
      ...pdfRows.filter(row => row.url).map(row => ({
        name: row.name,
        url: row.url,
        key: row.key,
      })),
    ]);
    setPdfRows([{ name: "", file: null }]);
    setSaving(false);
  };
  // View PDF handler
  const handleView = url => window.open(url, "_blank");
  // Delete PDF from log
  const handleDelete = idx => setPdfLog(log => log.filter((_, i) => i !== idx));

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold underline mb-2">Uplode PDF</h2>
      <form onSubmit={handleSave} className="space-y-4">
        {pdfRows.map((row, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={row.name}
              onChange={e => handleChange(idx, "name", e.target.value)}
              placeholder="Pdf Name"
              className="bg-blue-200 text-center font-bold px-2 py-2 flex-1 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {idx === 0 && (
              <span
                className="ml-2 text-xs font-semibold text-gray-600 cursor-pointer"
                onClick={handleAddRow}
              >
                Add More
              </span>
            )}
          </div>
        ))}
        {pdfRows.map((row, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <label className="flex-1">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={e => handlePdfUpload(e.target.files[0], idx)}
                required={!row.file}
              />
              <div className="bg-black text-white text-lg font-semibold text-center py-2 cursor-pointer select-none">
                {row.file ? row.file.name : "Browse Pdf"}
              </div>
            </label>
            <button
              type="button"
              className="bg-red-600 text-white w-9 h-9 flex items-center justify-center rounded text-2xl font-bold"
              onClick={handleAddRow}
              tabIndex={-1}
              style={{ marginLeft: "-4px" }}
            >
              +
            </button>
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
      {/* PDF Log Table */}
      <h3 className="text-lg font-bold underline mt-8 mb-2">PDF Log</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-black text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-black px-2 py-1">#</th>
              <th className="border border-black px-2 py-1">Pdf Name</th>
              <th className="border border-black px-2 py-1">View</th>
              <th className="border border-black px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {pdfLog.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-2">
                  No PDFs uploaded yet.
                </td>
              </tr>
            )}
            {pdfLog.map((pdf, idx) => (
              <tr key={idx}>
                <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                <td className="border border-black px-2 py-1">{pdf.name}</td>
                <td className="border border-black px-2 py-1 text-center">
                  <button
                    className="bg-black text-white px-3 py-1 rounded"
                    onClick={() => handleView(pdf.url)}
                  >
                    View
                  </button>
                </td>
                <td className="border border-black px-2 py-1 text-center">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackagePdf;
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addRecord,
  getAllRecords,
  deleteRecord,
  clearAllRecords,
  getRecordCount,
  NexusRecord,
} from "@/lib/db";

interface Props {
  onBack: () => void;
}

export default function DatabaseView({ onBack }: Props) {
  const [records, setRecords] = useState<NexusRecord[]>([]);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "note" as NexusRecord["category"],
  });

  const loadRecords = useCallback(async () => {
    const all = await getAllRecords();
    setRecords(all.reverse());
    setCount(await getRecordCount());
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await addRecord({
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
    });
    setForm({ title: "", content: "", category: "note" });
    setShowModal(false);
    await loadRecords();
    showToast("Record added");
  };

  const handleDelete = async (id: number) => {
    await deleteRecord(id);
    await loadRecords();
    showToast("Record deleted");
  };

  const handleClear = async () => {
    if (records.length === 0) return;
    await clearAllRecords();
    await loadRecords();
    showToast("All records cleared");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="screen-title">Local Database</span>
      </div>

      <div className="status-bar">
        <span className="status-dot" />
        <span>{count} record{count !== 1 ? "s" : ""} stored</span>
      </div>

      <div className="db-controls">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Record
        </button>
        <button
          className="btn btn-danger"
          onClick={handleClear}
          disabled={records.length === 0}
        >
          Clear All
        </button>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div className="empty-text">No records yet. Tap &quot;Add Record&quot; to get started.</div>
        </div>
      ) : (
        <div className="record-list">
          {records.map((rec) => (
            <div className="record-item" key={rec.id}>
              <span className={`record-badge ${rec.category}`}>{rec.category}</span>
              <div className="record-body">
                <div className="record-title">{rec.title}</div>
                {rec.content && <div className="record-content">{rec.content}</div>}
                <div className="record-time">{formatTime(rec.timestamp)}</div>
              </div>
              <button
                className="record-delete"
                onClick={() => handleDelete(rec.id!)}
                title="Delete record"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">New Record</div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="Record title..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                placeholder="Details or notes..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as NexusRecord["category"],
                  }))
                }
              >
                <option value="note">Note</option>
                <option value="scan">Scan</option>
                <option value="device">Device</option>
              </select>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={handleAdd}
              disabled={!form.title.trim()}
              style={{ marginTop: 8 }}
            >
              Save Record
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}

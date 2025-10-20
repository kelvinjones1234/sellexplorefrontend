"use client";
import React, { useState, useEffect } from "react";
import { apiClient } from "../../api";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  recipient: string | null;
  category: string | null;
  paystack_reference: string | null;
  description: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: { [key: string]: string } = {};
      if (status) params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (transactionId) params.transaction_id = transactionId;
      if (amount) params.amount = amount;

      const data = await apiClient.getTransactions(params);
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Transaction History
      </h1>

      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingLabelSelect
            name="status"
            value={status}
            onChange={(val) => setStatus(val.toString())}
            placeholder="Select Status"
            options={statusOptions}
          />
          <FloatingLabelInput
            type="date"
            name="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <FloatingLabelInput
            type="date"
            name="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <FloatingLabelInput
            type="text"
            name="transaction_id"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Transaction ID"
          />
          <FloatingLabelInput
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            step="0.01"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)]">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">Recipient</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--color-text-primary)]">Reference</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center text-[var(--color-text-secondary)]">
                  No transactions found
                </td>
              </tr>
            )}
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-t border-[var(--color-border-strong)]">
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{txn.id}</td>
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{txn.type}</td>
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{txn.amount} {txn.currency}</td>
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{txn.status}</td>
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{new Date(txn.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{txn.recipient || "N/A"}</td>
                <td className="px-4 py-2 text-[var(--color-text-secondary)]">{txn.paystack_reference || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
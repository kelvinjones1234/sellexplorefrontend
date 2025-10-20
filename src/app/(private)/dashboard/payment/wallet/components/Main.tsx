"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Plus,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  CreditCard,
  Clock,
  TrendingUp,
  Download,
  Settings,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../api";
import WalletSetupFlow from "./WalletSetupFlow";
import ChangePinModal from "./ChangePinModal";
import ContactSupportModal from "./ContactSupportModal";
import UpdateWalletDetailsModal from "./UpdateWalletDetailsModal";
import WithdrawModal from "./WithdrawalModal";

interface Transaction {
  id: number;
  type: "sent" | "received" | "withdrawal" | "deposit";
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  category?: string;
  paystack_reference?: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  action: string;
  color: string;
}

interface WalletStatus {
  activated: boolean;
  bank_name?: string;
  account_number?: string;
  balance?: number;
  currency?: string;
}

const Main = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "balance-overview",
    "recent-transactions",
  ]);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    activated: false,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWalletSetupOpen, setIsWalletSetupOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
  const [isUpdateDetailsOpen, setIsUpdateDetailsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const banks = [
    // { value: "058", label: "Sellexplore Wallet" },
    { value: "058", label: "GTBank" },
    { value: "011", label: "First Bank" },
    { value: "044", label: "Access Bank" },
    { value: "063", label: "Diamond Bank" },
    { value: "050", label: "Ecobank Nigeria" },
    { value: "070", label: "Fidelity Bank" },
    { value: "214", label: "FCMB" },
    { value: "301", label: "Jaiz Bank" },
    { value: "082", label: "Keystone Bank" },
    { value: "039", label: "Stanbic IBTC Bank" },
    { value: "232", label: "Sterling Bank" },
    { value: "032", label: "Union Bank" },
    { value: "033", label: "UBA" },
    { value: "215", label: "Unity Bank" },
    { value: "035", label: "Wema Bank" },
    { value: "057", label: "Zenith Bank" },
    { value: "101", label: "Providus Bank" },
    { value: "104", label: "Parallex Bank" },
    { value: "107", label: "Optimus Bank" },
    { value: "105", label: "Premium Trust Bank" },
    { value: "106", label: "Signature Bank" },
    { value: "100", label: "SunTrust Bank" },
    { value: "102", label: "Titan Trust Bank" },
    { value: "103", label: "Globus Bank" },
    { value: "076", label: "Polaris Bank" },
    { value: "068", label: "Standard Chartered Bank" },
    { value: "999992", label: "Opay" },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "send",
      title: "Send Money",
      icon: <ArrowUpRight className="w-5 h-5" />,
      description: "Transfer to wallet or bank",
      action: "Send",
      color: "var(--color-brand-primary)",
    },

    {
      id: "withdraw",
      title: "Withdraw",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Withdraw to your bank account",
      action: "Withdraw",
      color: "var(--color-accent)",
    },
  ];

  const router = useRouter();

  const fetchWalletStatus = async () => {
    setLoading(true);
    try {
      const status = await apiClient.getWalletStatus();
      setWalletStatus(status);
      if (!status.activated) {
        setIsWalletSetupOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch wallet status:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!walletStatus.activated) return;
    setLoading(true);
    try {
      const data = await apiClient.getTransactions({});
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletStatus();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [walletStatus.activated]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === "pending")
      return <Clock className="w-4 h-4 text-[var(--color-warning)]" />;
    if (status === "failed")
      return <ExternalLink className="w-4 h-4 text-[var(--color-danger)]" />;

    switch (type) {
      case "sent":
        return <ArrowUpRight className="w-4 h-4 text-[var(--color-danger)]" />;
      case "received":
        return (
          <ArrowDownLeft className="w-4 h-4 text-[var(--color-success)]" />
        );
      case "withdrawal":
        return <CreditCard className="w-4 h-4 text-[var(--color-accent)]" />;
      case "deposit":
        return <Plus className="w-4 h-4 text-[var(--color-brand-primary)]" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRequestPinReset = () => {
    setIsContactSupportOpen(true);
  };

  const handleChangePinClose = () => {
    setIsChangePinOpen(false);
    fetchWalletStatus(); // Refresh wallet status after PIN change
  };

  const handleWalletSetupSuccess = () => {
    fetchWalletStatus(); // Refresh wallet status after setup
    setIsWalletSetupOpen(false);
  };

  const handleWithdrawSuccess = () => {
    fetchWalletStatus();
    fetchTransactions();
    setIsWithdrawOpen(false);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "withdraw") {
      if (!walletStatus.activated) {
        setIsWalletSetupOpen(true);
        return;
      }
      setIsWithdrawOpen(true);
    }
    // Add other actions as needed
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === "all") return true;
    return transaction.type === selectedFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-border-default)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">
            Loading wallet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Modals */}
      <WalletSetupFlow
        isOpen={isWalletSetupOpen}
        onClose={() => setIsWalletSetupOpen(false)}
        onSuccess={handleWalletSetupSuccess}
        banks={banks}
      />
      <ChangePinModal isOpen={isChangePinOpen} onClose={handleChangePinClose} />
      <ContactSupportModal
        isOpen={isContactSupportOpen}
        onClose={() => setIsContactSupportOpen(false)}
      />
      <UpdateWalletDetailsModal
        isOpen={isUpdateDetailsOpen}
        onClose={() => setIsUpdateDetailsOpen(false)}
        banks={banks}
        initialBankName={walletStatus.bank_name || "Sellexplore Wallet"}
        initialAccountNumber={walletStatus.account_number || "2087654321"}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={walletStatus.balance || 0}
        onSuccess={handleWithdrawSuccess}
      />
      {/* Header */}
      <header className="bg-[var(--color-bg-primary)] py-3 px-4 sticky top-0 z-40 border-b border-[var(--color-border-default)]">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[var(--color-text-primary)]">
            My Wallet
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchWalletStatus}
              className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
            <button
              onClick={() => setIsChangePinOpen(true)}
              className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>
      </header>
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Wallet */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Overview Section */}
            <div className="bg-[var(--color-bg-surface)] rounded-2xl shadow-xs border border-[var(--color-border-default)] overflow-hidden">
              <button
                onClick={() => toggleSection("balance-overview")}
                className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-success)20",
                      color: "var(--color-success)",
                    }}
                  >
                    <span className="font-bold">💰</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Wallet Balance
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--color-text-secondary)] transition-transform ${
                    expandedSections.includes("balance-overview")
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expandedSections.includes("balance-overview") && (
                <div className="border-t border-[var(--color-border-default)] p-4 lg:p-6">
                  {/* Main Balance Display */}
                  <div className="flex flex-col items-center justify-center text-center mb-6 space-y-3">
                    {/* Available Balance */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        Available Balance
                      </span>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-1 hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
                      >
                        {showBalance ? (
                          <Eye className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        )}
                      </button>
                    </div>

                    {/* Balance Amount */}
                    <h3 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                      {showBalance && walletStatus.balance
                        ? formatAmount(walletStatus.balance)
                        : "*****"}
                    </h3>

                    {/* Account Details */}
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span>{walletStatus.account_number || "2087654321"}</span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            walletStatus.account_number || "2087654321"
                          )
                        }
                        className="p-1 hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Update Details */}
                    {walletStatus.activated && (
                      <button
                        onClick={() => setIsUpdateDetailsOpen(true)}
                        className="text-sm text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)]"
                      >
                        Update Details
                      </button>
                    )}
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                        onClick={() => handleQuickAction(action.id)}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--color-on-brand)]"
                          style={{
                            backgroundColor: action.color,
                          }}
                        >
                          {action.icon}
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {action.title}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)] text-center">
                          {action.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-[var(--color-bg-surface)] rounded-2xl shadow-xs border border-[var(--color-border-default)] overflow-hidden">
              <button
                onClick={() => toggleSection("recent-transactions")}
                className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-accent)20",
                      color: "var(--color-accent)",
                    }}
                  >
                    <span className="font-bold">📋</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Recent Transactions
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/transactions");
                    }}
                    className="text-sm text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] transition-colors"
                  >
                    View All
                  </button>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-text-secondary)] transition-transform ${
                      expandedSections.includes("recent-transactions")
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </button>

              {expandedSections.includes("recent-transactions") && (
                <div className="border-t border-[var(--color-border-default)]">
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 p-4 border-b border-[var(--color-border-default)] overflow-x-auto">
                    {["all", "received", "sent", "withdrawal", "deposit"].map(
                      (filter) => (
                        <button
                          key={filter}
                          onClick={() => setSelectedFilter(filter)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedFilter === filter
                              ? "bg-[var(--color-brand-primary)] text-[var(--color-on-brand)]"
                              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      )
                    )}
                  </div>

                  {/* Transactions List */}
                  <div className="divide-y divide-[var(--color-border-default)]">
                    {filteredTransactions.length === 0 ? (
                      <div className="p-4 text-center text-[var(--color-text-secondary)]">
                        No transactions found
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center">
                              {getTransactionIcon(
                                transaction.type,
                                transaction.status
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[var(--color-text-primary)] text-sm">
                              {transaction.description}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[var(--color-text-secondary)]">
                                {formatTime(transaction.timestamp)}
                              </span>
                              {transaction.recipient && (
                                <>
                                  <span className="text-xs text-[var(--color-text-muted)]">
                                    •
                                  </span>
                                  <span className="text-xs text-[var(--color-text-secondary)]">
                                    {transaction.recipient}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <span
                              className={`font-semibold text-sm ${
                                transaction.type === "sent" ||
                                transaction.type === "withdrawal"
                                  ? "text-[var(--color-danger)]"
                                  : "text-[var(--color-success)]"
                              }`}
                            >
                              {transaction.type === "sent" ||
                              transaction.type === "withdrawal"
                                ? "-"
                                : "+"}
                              {formatAmount(transaction.amount)}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                transaction.status === "completed"
                                  ? "bg-[var(--color-success)/10] text-[var(--color-success)]"
                                  : transaction.status === "pending"
                                  ? "bg-[var(--color-warning)/10] text-[var(--color-warning)]"
                                  : "bg-[var(--color-danger)/10] text-[var(--color-danger)]"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Wallet Tools & Info */}
          <div className="space-y-6">
            {/* Wallet Tools */}
            <div className="bg-[var(--color-bg-surface)] rounded-2xl shadow-xs border border-[var(--color-border-default)] p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  Wallet Tools
                </h3>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4" />
                    <span>Export Statements</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button className="w-full flex items-center justify-between py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Spending Analytics</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => setIsChangePinOpen(true)}
                  className="w-full flex items-center justify-between py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Change PIN</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={handleRequestPinReset}
                  className="w-full flex items-center justify-between py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Reset PIN</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

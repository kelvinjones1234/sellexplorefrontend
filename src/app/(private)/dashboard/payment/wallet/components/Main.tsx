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
  Filter,
  Download,
  Settings,
  RefreshCw,
  Zap,
  Gift,
  MoreHorizontal,
} from "lucide-react";
import { apiClient } from "../../api";
import WalletSetupFlow from "./WalletSetupFlow";
import ChangePinModal from "./ChangePinModal";
import ContactSupportModal from "./ContactSupportModal";
import UpdateWalletDetailsModal from "./UpdateWalletDetailsModal";

interface Transaction {
  id: string;
  type: "sent" | "received" | "withdrawal" | "deposit";
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  category?: string;
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
  const [isWalletSetupOpen, setIsWalletSetupOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
  const [isUpdateDetailsOpen, setIsUpdateDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock bank list
  const banks = [
    { value: "Sellexplore Wallet", label: "Sellexplore Wallet" },
    { value: "GTBank", label: "GTBank" },
    { value: "First Bank", label: "First Bank" },
  ];

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "received",
      amount: 15000,
      currency: "NGN",
      description: "Payment from Order #SE-001",
      recipient: "John Doe",
      timestamp: "2024-01-15T10:30:00Z",
      status: "completed",
      category: "sales",
    },
    {
      id: "2",
      type: "sent",
      amount: 2500,
      currency: "NGN",
      description: "Transfer to Adunni Store",
      recipient: "Adunni Store",
      timestamp: "2024-01-14T16:45:00Z",
      status: "completed",
      category: "transfer",
    },
    {
      id: "3",
      type: "withdrawal",
      amount: 50000,
      currency: "NGN",
      description: "Withdrawal to GTBank",
      timestamp: "2024-01-14T14:20:00Z",
      status: "completed",
      category: "withdrawal",
    },
    {
      id: "4",
      type: "deposit",
      amount: 75000,
      currency: "NGN",
      description: "Bank Transfer Deposit",
      timestamp: "2024-01-13T11:15:00Z",
      status: "pending",
      category: "deposit",
    },
    {
      id: "5",
      type: "received",
      amount: 8500,
      currency: "NGN",
      description: "Payment from Order #SE-002",
      recipient: "Sarah Johnson",
      timestamp: "2024-01-12T09:30:00Z",
      status: "completed",
      category: "sales",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "send",
      title: "Send Money",
      icon: <ArrowUpRight className="w-5 h-5" />,
      description: "Transfer to wallet or bank",
      action: "Send",
      color: "bg-blue-500",
    },
    {
      id: "request",
      title: "Request Money",
      icon: <ArrowDownLeft className="w-5 h-5" />,
      description: "Request payment from customers",
      action: "Request",
      color: "bg-green-500",
    },
    {
      id: "withdraw",
      title: "Withdraw",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Withdraw to your bank account",
      action: "Withdraw",
      color: "bg-purple-500",
    },
    {
      id: "deposit",
      title: "Add Money",
      icon: <Plus className="w-5 h-5" />,
      description: "Top up your wallet balance",
      action: "Add Money",
      color: "bg-orange-500",
    },
  ];

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

  useEffect(() => {
    fetchWalletStatus();
  }, []);

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
      return <Clock className="w-4 h-4 text-yellow-500" />;
    if (status === "failed")
      return <ExternalLink className="w-4 h-4 text-red-500" />;

    switch (type) {
      case "sent":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "received":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      case "deposit":
        return <Plus className="w-4 h-4 text-[var(--color-primary)]" />;
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

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === "all") return true;
    return transaction.type === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">My Wallet</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchWalletStatus}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setIsChangePinOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </header>
      <div className="px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Wallet */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Overview Section */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection("balance-overview")}
                className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">💰</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Wallet Balance
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedSections.includes("balance-overview")
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expandedSections.includes("balance-overview") && (
                <div className="border-t border-gray-200 p-4 lg:p-6">
                  {/* Main Balance Display */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">
                        Available Balance
                      </span>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {showBalance ? (
                          <Eye className="w-4 h-4 text-gray-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                      {showBalance && walletStatus.balance
                        ? formatAmount(walletStatus.balance)
                        : "••••••"}
                    </h3>

                    {/* Account Details */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>
                        {walletStatus.bank_name || "Sellexplore Wallet"}
                      </span>
                      <span>•</span>
                      <span>{walletStatus.account_number || "2087654321"}</span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            walletStatus.account_number || "2087654321"
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {walletStatus.activated && (
                      <button
                        onClick={() => setIsUpdateDetailsOpen(true)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
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
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center text-white`}
                        >
                          {action.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {action.title}
                        </span>
                        <span className="text-xs text-gray-600 text-center">
                          {action.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection("recent-transactions")}
                className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📋</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Transactions
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    View All
                  </button>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedSections.includes("recent-transactions")
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </button>

              {expandedSections.includes("recent-transactions") && (
                <div className="border-t border-gray-200">
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 p-4 border-b border-gray-200 overflow-x-auto">
                    {["all", "received", "sent", "withdrawal", "deposit"].map(
                      (filter) => (
                        <button
                          key={filter}
                          onClick={() => setSelectedFilter(filter)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedFilter === filter
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      )
                    )}
                  </div>

                  {/* Transactions List */}
                  <div className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getTransactionIcon(
                              transaction.type,
                              transaction.status
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-sm">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {formatTime(transaction.timestamp)}
                            </span>
                            {transaction.recipient && (
                              <>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-600">
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
                                ? "text-red-500"
                                : "text-green-500"
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
                                ? "bg-green-100 text-green-600"
                                : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Wallet Tools & Info */}
          <div className="space-y-6">
            {/* Wallet Tools */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Wallet Tools</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4" />
                    <span>Export Statements</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4" />
                    <span>Advanced Filters</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Spending Analytics</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => setIsChangePinOpen(true)}
                  className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Change PIN</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={handleRequestPinReset}
                  className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Reset PIN</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            {/* Rewards Program */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 lg:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Earn rewards on every transaction
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get cashback and points for using your Sellexplore wallet
                    for business transactions.
                  </p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg text-sm font-medium text-white transition-colors">
                View Rewards
                <Gift className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { X, Eye, EyeOff, Clock, Calendar, Download } from "lucide-react";
import { type Transaction } from "@/lib/supabase"
import Logo from "../../public/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const {
    user,
    profile,
    calculateTotalBalance,
    accountsLoading,
    accounts,
    transactions,
    transactionsLoading,
    fetchTransactions,
    fetchAccounts
  } = useAuth()

  const [currentPage, setCurrentPage] = useState(1)
  const [showBalances, setShowBalances] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const transactionsPerPage = 6

  useEffect(() => {
    // Only fetch data if it's not already loaded and we have a user
    if (user) {
      if (accounts.length === 0) {
        fetchAccounts()
      }

      if (transactions.length === 0) {
        fetchTransactions()
      }
    }

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timeInterval)
  }, [user, accounts.length, transactions.length, fetchAccounts, fetchTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return ""
    return "••••" + accountNumber.slice(-4)
  }

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
  const totalPages = Math.ceil(transactions.length / transactionsPerPage)

  const handlePdfDownloadStatement = () => {
    const doc = new jsPDF();
    const logoImg = Logo;
    const img = new Image();
    img.src = logoImg.src;

    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();

      // === Logo Settings ===
      const logoWidth = 60; // Larger logo
      const logoHeight = (img.height / img.width) * logoWidth;
      const logoX = 10;
      const logoY = 10;

      doc.addImage(img, "PNG", logoX, logoY, logoWidth, logoHeight);

      // === Address Under Logo ===
      const addressY = logoY + logoHeight + 4;
      doc.setFontSize(8); // Smaller font
      doc.setTextColor(120); // Grey color
      doc.setFont("normal"); // Not bold

      doc.text("400 Arthur Godfrey Road, Suite 506", logoX, addressY);
      doc.text("Miami Beach, FL 33140", logoX, addressY + 4);

      // === Header Title (Center) ===
      doc.setFontSize(14);
      doc.setTextColor(0); // Reset to black
      doc.setFont("bold");
      doc.text("Transaction History - D ESS 0001", pageWidth / 2, 20, {
        align: "center",
      });

      // === Right Subtitle ===
      doc.setFontSize(11);
      doc.setFont("normal");
      doc.text("Gibraltar Private Bank & Trust", pageWidth - 10, 15, {
        align: "right",
      });

      // === Table Data ===
      const headers = [["Date", "Description", "Amount", "Type", "Status"]];
      const data = transactions.map((t) => [
        formatDate(t.transaction_date),
        t.description,
        t.amount.toLocaleString(),
        t.type,
        t.status,
      ]);

      // === Table ===
      const tableStartY = addressY + 10;
      autoTable(doc, {
        startY: tableStartY,
        head: headers,
        body: data,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [52, 58, 64], textColor: 255 },
        margin: { horizontal: 10 },
      });

      // === Total Balance Summary ===
      const finalY = (doc as any).lastAutoTable.finalY;
      doc.setFontSize(12);
      doc.setFont("bold");
      doc.setTextColor(0);
      doc.text(
        `Total Balance: $${calculateTotalBalance().toLocaleString()}`,
        pageWidth - 10,
        finalY + 10,
        { align: "right" }
      );

      // === Save PDF ===
      doc.save(`statement_${new Date().toISOString().split("T")[0]}.pdf`);
    };
  };

  // Calculate total balances
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  // Mock financial summary data (would be replaced with real data)
  const financialSummary = {
    income: 3113102.34,
    expenses: 81145.41,
    savingsRate: 75.9
  }

  // Combined loading state
  const isLoading = accountsLoading || transactionsLoading

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column - User Welcome & Quick Actions */}
        <div className="lg:col-span-4 space-y-5"> {/* Adds consistent spacing between sections */}
          {/* User Welcome Card */}
          <div className="bg-yellow-600 text-white shadow rounded-xl p-5">
            <h2 className="text-xl font-bold mb-2">Hi, {profile?.firstName || profile?.email?.split('@')[0] || "there"}!</h2>
            <div className="flex items-center text-yellow-100 mb-1 text-sm">
              <Clock size={14} className="mr-1" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center text-yellow-100 text-sm">
              <Calendar size={14} className="mr-1" />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="dashboard/transfer" className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center transition">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Transfer Money
              </a>
              <a href="dashboard/transfer" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded text-sm flex items-center justify-center transition">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Pay Bills
              </a>
              <a href="dashboard/deposit" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded text-sm flex items-center justify-center transition">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Mobile Deposit
              </a>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-base font-semibold mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded">
                <div className="text-xs text-green-700">Income (MTD)</div>
                <div className="text-lg font-bold text-green-800">${financialSummary.income.toLocaleString()}</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-xs text-red-700">Expenses (MTD)</div>
                <div className="text-lg font-bold text-red-800">${financialSummary.expenses.toLocaleString()}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-xs text-yellow-700">Savings Rate</div>
                <div className="text-lg font-bold text-yellow-800">{financialSummary.savingsRate}%</div>
              </div>
            </div>
          </div>
        </div>


        {/* Right Column - Account Summary & Transactions */}
        <div className="lg:col-span-8">
          {/* Account Summary */}
          <div className="bg-white shadow rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Account Summary</h2>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="text-gray-600 hover:text-gray-800 flex items-center text-xs"
              >
                {showBalances ? (
                  <>
                    <EyeOff size={14} className="mr-1" />
                    <span>Hide Balances</span>
                  </>
                ) : (
                  <>
                    <Eye size={14} className="mr-1" />
                    <span>Show Balances</span>
                  </>
                )}
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500">Total Available Balance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {showBalances ? formatCurrency(totalBalance) : "••••••••"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedAccount(account)}
                >
                  <h3 className="font-semibold text-base mb-1">{account.account_type}</h3>
                  <p className="text-xs text-gray-500 mb-0.5">Account Number</p>
                  <p className="font-medium text-xs mb-1">
                    {showBalances ? account.account_number : maskAccountNumber(account.account_number)}
                  </p>
                  <p className="text-xs text-gray-500 mb-0.5">Available Balance</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {showBalances ? formatCurrency(account.balance) : "••••••••"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white shadow rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Transaction History</h2>
              <button
                onClick={handlePdfDownloadStatement}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded text-xs flex items-center"
              >
                <Download size={12} className="mr-1" />
                Download Statement
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${transaction.type === "Credit"
                              ? "bg-green-100 text-green-800"
                              : transaction.type === "Debit"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${transaction.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-3 text-center text-xs text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - Fixed overlay issue */}
            {transactions.length > transactionsPerPage && (
              <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 mt-3">
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastTransaction, transactions.length)}</span> of{" "}
                      <span className="font-medium">{transactions.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-1 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {/* Limit displayed page numbers to avoid overflow */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Calculate which page numbers to show based on current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-2 py-1 text-xs font-semibold ${pageNum === currentPage
                              ? "z-10 bg-yellow-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-1 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Improved Account Details Modal */}
      {selectedAccount && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  {selectedAccount.account_type} Account
                </h3>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-white hover:text-gray-200 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <p className="font-medium text-sm">{selectedAccount?.account_number}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Routing Number</p>
                  <p className="font-medium text-sm">{selectedAccount?.routing_number}</p>
                </div>
              </div>

              <div className="mt-5 bg-yellow-50 p-4 rounded-xl text-center">
                <p className="text-xs text-yellow-700 mb-1">Available Balance</p>
                <p className="text-xl font-bold text-yellow-700">
                  {formatCurrency(selectedAccount.balance)}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-1">Opened On</p>
                <p className="font-medium text-sm">January 2022</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
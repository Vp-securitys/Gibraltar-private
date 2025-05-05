"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { supabase, type Profile, type Account, type Transaction } from "@/lib/supabase"

export default function AdminUpdateUtility() {
  const [selectedUserId, setSelectedUserId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  })

  const [accountForm, setAccountForm] = useState({
    accountId: "",
    newBalance: "",
  })

  const [transactionForm, setTransactionForm] = useState({
    transactionId: "",
    newStatus: "",
  })

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*")

        if (error) throw error
        setProfiles(data as Profile[])
      } catch (error) {
        console.error("Error fetching profiles:", error)
      }
    }

    fetchProfiles()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError("")
    setSuccess("")
    setSelectedProfile(null)
    setAccounts([])
    setTransactions([])

    try {
      // Search by user_id or email
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`user_id.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)

      if (error) throw error

      if (data.length === 0) {
        setError("No users found matching the search query")
      } else if (data.length === 1) {
        // If only one user found, select them automatically
        handleUserSelect(data[0].id)
      } else {
        // If multiple users found, update the profiles list
        setProfiles(data as Profile[])
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while searching")
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = async (userId: string) => {
    setSelectedUserId(userId)
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) throw profileError
      setSelectedProfile(profileData as Profile)
      setProfileForm({
        fullName: profileData.full_name,
        email: profileData.email,
      })

      // Fetch user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)

      if (accountsError) throw accountsError
      setAccounts(accountsData as Account[])

      if (accountsData.length > 0) {
        setAccountForm({
          accountId: accountsData[0].id,
          newBalance: accountsData[0].balance.toString(),
        })
      }

      // Fetch pending transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "Pending")
        .order("transaction_date", { ascending: false })

      if (transactionsError) throw transactionsError
      setTransactions(transactionsData as Transaction[])

      if (transactionsData.length > 0) {
        setTransactionForm({
          transactionId: transactionsData[0].id,
          newStatus: "Completed",
        })
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching user data")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAccountForm((prev) => ({ ...prev, [name]: value }))

    // If account selection changes, update the balance field
    if (name === "accountId") {
      const selectedAccount = accounts.find((acc) => acc.id === value)
      if (selectedAccount) {
        setAccountForm((prev) => ({ ...prev, newBalance: selectedAccount.balance.toString() }))
      }
    }
  }

  const handleTransactionFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setTransactionForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedProfile) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.fullName,
          email: profileForm.email,
        })
        .eq("id", selectedProfile.id)

      if (error) throw error

      setSuccess("Profile updated successfully")

      // Update the selected profile in state
      setSelectedProfile((prev) => {
        if (!prev) return null
        return {
          ...prev,
          full_name: profileForm.fullName,
          email: profileForm.email,
        }
      })
    } catch (error: any) {
      setError(error.message || "An error occurred while updating profile")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBalance = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const newBalance = Number.parseFloat(accountForm.newBalance)
      if (isNaN(newBalance) || newBalance < 0) {
        throw new Error("Please enter a valid balance amount")
      }

      const { error } = await supabase
        .from("accounts")
        .update({
          balance: newBalance,
        })
        .eq("id", accountForm.accountId)

      if (error) throw error

      setSuccess("Account balance updated successfully")

      // Update the accounts in state
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === accountForm.accountId ? { ...acc, balance: newBalance } : acc)),
      )
    } catch (error: any) {
      setError(error.message || "An error occurred while updating balance")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTransactionStatus = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error: transactionError } = await supabase
        .from("transactions")
        .update({
          status: transactionForm.newStatus,
        })
        .eq("id", transactionForm.transactionId)

      if (transactionError) throw transactionError

      // If transaction is a deposit and status is changed to Completed, update account balance
      const transaction = transactions.find((t) => t.id === transactionForm.transactionId)
      if (transaction && transaction.type === "Deposit" && transactionForm.newStatus === "Completed") {
        // Find the account
        const account = accounts.find((acc) => acc.id === transaction.account_id)
        if (account) {
          // Update account balance
          const newBalance = account.balance + transaction.amount
          const { error: accountError } = await supabase
            .from("accounts")
            .update({
              balance: newBalance,
            })
            .eq("id", account.id)

          if (accountError) throw accountError

          // Update accounts in state
          setAccounts((prev) => prev.map((acc) => (acc.id === account.id ? { ...acc, balance: newBalance } : acc)))

          // If there's a related deposit, update its status too
          if (transaction.related_deposit_id) {
            const { error: depositError } = await supabase
              .from("deposits")
              .update({
                status: "Approved",
                reviewed_at: new Date().toISOString(),
              })
              .eq("id", transaction.related_deposit_id)

            if (depositError) throw depositError
          }
        }
      }

      setSuccess("Transaction status updated successfully")

      // Remove the transaction from the list if it's no longer pending
      if (transactionForm.newStatus !== "Pending") {
        setTransactions((prev) => prev.filter((t) => t.id !== transactionForm.transactionId))

        // Reset transaction form if there are other transactions
        const remainingTransactions = transactions.filter((t) => t.id !== transactionForm.transactionId)
        if (remainingTransactions.length > 0) {
          setTransactionForm({
            transactionId: remainingTransactions[0].id,
            newStatus: "Completed",
          })
        } else {
          setTransactionForm({
            transactionId: "",
            newStatus: "Completed",
          })
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while updating transaction status")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gibraltar Bank Admin Update Utility</h1>
          <p className="mt-2 text-gray-600">Internal tool for updating user data and account information</p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This is a demo admin utility. In a production environment, this page would
                require additional authentication and authorization.
              </p>
            </div>
          </div>
        </div>

        {/* User Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Search</h2>

          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User ID or Email"
              className="input-field flex-1"
            />
            <button onClick={handleSearch} disabled={loading || !searchQuery.trim()} className="btn-primary">
              Search
            </button>
          </div>

          {profiles.length > 1 && (
            <div className="mt-4">
              <label className="form-label">Select User</label>
              <select value={selectedUserId} onChange={(e) => handleUserSelect(e.target.value)} className="input-field">
                <option value="">Select a user</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name} ({profile.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">{error}</div>}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">{success}</div>
        )}

        {selectedProfile && (
          <div className="space-y-6">
            {/* Update User Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Update User Details</h2>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700">Current Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{selectedProfile.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedProfile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{formatDate(selectedProfile.created_at)}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="form-label">
                      New Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileFormChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      New Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileFormChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <button type="submit" disabled={loading} className="btn-primary">
                      Update Details
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Update Account Balance */}
            {accounts.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Update Account Balance</h2>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Current Accounts</h3>
                  <div className="mt-2 space-y-2">
                    {accounts.map((account) => (
                      <div key={account.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{account.account_type} Account</p>
                            <p className="text-sm text-gray-500">Account Number: {account.account_number}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Balance</p>
                            <p className="font-bold text-blue-600">{formatCurrency(account.balance)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleUpdateBalance}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="accountId" className="form-label">
                        Select Account
                      </label>
                      <select
                        id="accountId"
                        name="accountId"
                        value={accountForm.accountId}
                        onChange={handleAccountFormChange}
                        required
                        className="input-field"
                      >
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.account_type} - {account.account_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="newBalance" className="form-label">
                        New Balance
                      </label>
                      <input
                        type="number"
                        id="newBalance"
                        name="newBalance"
                        value={accountForm.newBalance}
                        onChange={handleAccountFormChange}
                        required
                        min="0"
                        step="0.01"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <button type="submit" disabled={loading} className="btn-primary">
                        Update Balance
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Update Transaction Status */}
            {transactions.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Update Transaction Status</h2>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Pending Transactions</h3>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.transaction_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.type === "Credit"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.type === "Debit"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <form onSubmit={handleUpdateTransactionStatus}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="transactionId" className="form-label">
                        Select Transaction
                      </label>
                      <select
                        id="transactionId"
                        name="transactionId"
                        value={transactionForm.transactionId}
                        onChange={handleTransactionFormChange}
                        required
                        className="input-field"
                      >
                        {transactions.map((transaction) => (
                          <option key={transaction.id} value={transaction.id}>
                            {formatDate(transaction.transaction_date)} - {transaction.description} -{" "}
                            {formatCurrency(transaction.amount)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="newStatus" className="form-label">
                        New Status
                      </label>
                      <select
                        id="newStatus"
                        name="newStatus"
                        value={transactionForm.newStatus}
                        onChange={handleTransactionFormChange}
                        required
                        className="input-field"
                      >
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>

                    <div>
                      <button type="submit" disabled={loading} className="btn-primary">
                        Update Status
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

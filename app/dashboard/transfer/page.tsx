"use client"

import type React from "react"
import { useState, type FormEvent, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import {
  DollarSign,
  Building,
  User,
  CreditCard,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Landmark,
  Loader2
} from "lucide-react"

type TransferFormErrors = {
  recipientName?: string;
  recipientAccountNumber?: string;
  recipientRoutingNumber?: string;
  amount?: string;
  sourceAccountId?: string;
};

export default function Transfer() {
  const { user, accounts, calculateTotalBalance, fetchTransactions } = useAuth();
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formErrors, setFormErrors] = useState<TransferFormErrors>({});
  const [showCheck, setShowCheck] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientAccountNumber: "",
    recipientRoutingNumber: "",
    amount: 0,
    memo: "",
    sourceAccountId: "",
  });

  // Set default source account if accounts exist
  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.sourceAccountId) {
      setFormData((prev) => ({ ...prev, sourceAccountId: accounts[0].id }))
    }
  }, [accounts, formData.sourceAccountId]);

  useEffect(() => {
    if (success) {
      setShowCheck(false);
      const timer = setTimeout(() => {
        setShowCheck(true);
      }, 1500); // simulate delay before showing check
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateFields = () => {
    const errors: TransferFormErrors = {};

    // Validate recipient name
    if (!formData.recipientName.trim()) {
      errors.recipientName = 'Recipient name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.recipientName)) {
      errors.recipientName = 'Only letters are allowed.';
    }

    // Validate account number
    if (!formData.recipientAccountNumber.trim()) {
      errors.recipientAccountNumber = 'Account number is required.';
    } else if (!/^\d+$/.test(formData.recipientAccountNumber)) {
      errors.recipientAccountNumber = 'Only numbers are allowed.';
    } else if (formData.recipientAccountNumber.length < 8 || formData.recipientAccountNumber.length > 17) {
      errors.recipientAccountNumber = 'Account number must be between 8 and 17 digits.';
    }

    // Validate routing number
    if (!formData.recipientRoutingNumber.trim()) {
      errors.recipientRoutingNumber = 'Routing number is required.';
    } else if (!/^\d+$/.test(formData.recipientRoutingNumber)) {
      errors.recipientRoutingNumber = 'Only numbers are allowed.';
    } else if (formData.recipientRoutingNumber.length !== 9) {
      errors.recipientRoutingNumber = 'Routing number must be 9 digits.';
    }

    // Validate amount
    const amountValue = parseFloat(String(formData.amount));
    if (!formData.amount) {
      errors.amount = 'Amount is required.';
    } else if (isNaN(amountValue) || amountValue <= 0) {
      errors.amount = 'Enter a valid amount greater than zero.';
    }

    // Validate source account
    if (!formData.sourceAccountId) {
      errors.sourceAccountId = 'Please select an account.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear specific error when field is edited
    if (formErrors[name as keyof TransferFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof TransferFormErrors];
        return newErrors;
      });
    }
  }

  const handleInitialSubmit = (e: FormEvent) => {
    e.preventDefault();

    // First validate fields
    if (!validateFields()) return;

    // Show confirmation screen
    setShowConfirmation(true);
  };

  // Handle the final confirmation and actual transfer
  const handleConfirmTransfer = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!user) throw new Error("User not authenticated");

      const amount = parseFloat(String(formData.amount));
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Find the source account
      const sourceAccount = accounts.find((acc) => acc.id === formData.sourceAccountId);
      if (!sourceAccount) {
        throw new Error("Source account not found");
      }

      // Check if there are sufficient funds
      if (sourceAccount.balance < amount) {
        throw new Error("Insufficient funds in the selected account");
      }

      // Create transaction description
      const description = formData.memo
        ? `Transfer to ${formData.recipientName} - ${formData.memo}`
        : `Transfer to ${formData.recipientName}`;

      // console.log("Creating transaction record with data:", {
      //   transaction_date: new Date().toISOString(),
      //   description,
      //   amount: -amount,
      //   type: "Debit",
      //   status: "Pending",
      //   user_id: user.id,
      //   account_type: sourceAccount.account_type,
      // });

      try {
        // Create transaction record - wrapped in its own try/catch for detailed error logging
        const { data: transactionData, error: transactionError } = await supabase
          .from("transactions")
          .insert([
            {
              transaction_date: new Date().toISOString(),
              description: description,
              amount: amount, // Negative amount for outgoing transfers
              type: "Debit",
              status: "Pending",
              user_id: user.id,
              account_type: sourceAccount.account_type,
            },
          ])
          .select();

        console.log("Database response:", { transactionData, transactionError });

        if (transactionError) {
          console.error("Transaction insert error:", transactionError);
          throw new Error(transactionError.message || "Failed to create transaction");
        }

        if (!transactionData) {
          console.error("No transaction data returned");
          throw new Error("No transaction data returned from database");
        }

        console.log("Transaction inserted successfully:", transactionData);
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        throw dbError; // Re-throw to be caught by outer try/catch
      }

      // Update account balance
      console.log("Updating account balance");
      // try {
      //   const { error: updateError } = await supabase
      //     .from("accounts")
      //     .update({ balance: sourceAccount.balance - amount })
      //     .eq("id", formData.sourceAccountId);

      //   if (updateError) {
      //     console.error("Account update error:", updateError);
      //     throw new Error(updateError.message || "Failed to update account balance");
      //   }

      //   console.log("Account balance updated successfully");
      // } catch (updateError) {
      //   console.error("Account update failed:", updateError);
      //   throw updateError;
      // }

      // Refresh transactions list
      // console.log("Refreshing transactions");
      // await fetchAccounts(); 
      await fetchTransactions();

      // Reset form and show success message
      setFormData({
        recipientName: "",
        recipientAccountNumber: "",
        recipientRoutingNumber: "",
        amount: 0,
        memo: "",
        sourceAccountId: accounts[0]?.id || "",
      });

      setSuccess(true);
      setShowConfirmation(false);
      console.log("Transfer completed successfully");
    } catch (error: any) {
      console.error("Transfer error:", error);
      setError(error.message || "An error occurred while processing your transfer");
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  }

  const selectedAccount = accounts.find(acc => acc.id === formData.sourceAccountId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-yellow-800 to-yellow-600 px-6 py-5 text-white">
          <div className="flex items-center mb-1">
            <Send className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Money Transfer</h2>
          </div>
          <p className="text-yellow-100 text-sm">Send funds securely to external accounts</p>
        </div>

        {/* Main Form Content */}
        <div className="p-6">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl shadow-sm transition-all duration-500 ease-in-out">
              <div className="flex items-start space-x-3">
                {!showCheck ? (
                  <div className="animate-spin text-green-500 mt-0.5">
                    <Loader2 className="h-5 w-5" />
                  </div>
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 animate-bounce mt-0.5" />
                )}

                <div className={`transition-opacity duration-500 ${showCheck ? "opacity-100" : "opacity-0"}`}>
                  <p className="font-semibold text-green-700">Transfer Successful</p>
                  <p className="text-sm text-green-700">
                    Your transfer has been processed successfully. The funds should appear in the recipient's account within 1–2 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Unable to Complete Transfer</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Main Form */}
          {!showConfirmation ? (
            <form onSubmit={handleInitialSubmit}>
              <div className="space-y-5">
                <div className="bg-yellow-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Transfer Timeline
                  </h3>
                  <p className="text-xs text-yellow-700">Transfers initiated before 8:00 PM ET on business days typically arrive within 1-2 business days.</p>
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="sourceAccountId" className="block text-sm font-medium text-gray-700">
                    From Account
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                    </div>
                    <select
                      id="sourceAccountId"
                      name="sourceAccountId"
                      value={formData.sourceAccountId}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border ${formErrors.sourceAccountId ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg shadow-sm bg-white hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none`}
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id} className="py-1">
                          {account.account_type} - {account.account_number} ({formatCurrency(account.balance)})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  {formErrors.sourceAccountId && (
                    <p className="mt-0.5 text-xs text-red-600">{formErrors.sourceAccountId}</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-md font-medium text-gray-800 mb-4">Recipient Information</h3>
                </div>

                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${formErrors.recipientName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm`}
                      placeholder="Enter recipient's full name"
                    />
                  </div>
                  {formErrors.recipientName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="recipientAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="recipientAccountNumber"
                      name="recipientAccountNumber"
                      value={formData.recipientAccountNumber}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${formErrors.recipientAccountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm`}
                      placeholder="Enter recipient's account number"
                      maxLength={17}
                    />
                  </div>
                  {formErrors.recipientAccountNumber && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.recipientAccountNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="recipientRoutingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Landmark className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="recipientRoutingNumber"
                      name="recipientRoutingNumber"
                      value={formData.recipientRoutingNumber}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${formErrors.recipientRoutingNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm`}
                      placeholder="Enter recipient's routing number"
                      maxLength={9}
                    />
                  </div>
                  {formErrors.recipientRoutingNumber && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.recipientRoutingNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Transfer Amount
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0.01"
                      step="0.01"
                      className={`block w-full pl-10 pr-3 py-3 border ${formErrors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm`}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.amount && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
                    Memo (Optional)
                  </label>
                  <textarea
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                    rows={2}
                    placeholder="Add a note about this transfer"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Continue
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Confirmation UI */
            <div className="space-y-6">
              <div className="bg-yellow-50 p-5 rounded-md border border-yellow-100">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Please Confirm Your Transfer</h3>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">From Account:</span>
                    <span className="font-medium text-gray-900">{selectedAccount?.account_type} - {selectedAccount?.account_number}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium text-gray-900">{formData.recipientName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium text-gray-900">
                      {formData.recipientAccountNumber.replace(/(\d{4})$/, '••••')}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">Routing Number:</span>
                    <span className="font-medium text-gray-900">{formData.recipientRoutingNumber}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-yellow-800 text-lg">
                      {formatCurrency(parseFloat(String(formData.amount)))}
                    </span>
                  </div>

                  {formData.memo && (
                    <div className="flex justify-between py-2 border-b border-yellow-100">
                      <span className="text-gray-600">Memo:</span>
                      <span className="font-medium text-gray-900">{formData.memo}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Estimated Arrival:</span>
                    <span className="font-medium text-gray-900">1-2 Business Days</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={cancelConfirmation}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handleConfirmTransfer}
                  disabled={loading}
                  className="flex-1 flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Transfer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Secure Transfer</h4>
                <p className="text-xs text-gray-500 mt-1">Your financial information is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
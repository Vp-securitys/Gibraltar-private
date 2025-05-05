"use client"

import type React from "react"
import { useState, type FormEvent, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import {
  DollarSign,
  Building,
  Check,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Loader2,
  Camera,
  Upload,
  Trash2
} from "lucide-react"

type DepositFormErrors = {
  amount?: string;
  accountId?: string;
  frontImage?: string;
  backImage?: string;
};

export default function Deposit() {
  const { user, accounts, fetchTransactions } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<DepositFormErrors>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCheck, setShowCheck] = useState(false)

  const frontImageRef = useRef<HTMLInputElement>(null)
  const backImageRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    amount: "",
    accountId: "",
    frontImageFile: null as File | null,
    backImageFile: null as File | null,
    frontImagePreview: "",
    backImagePreview: "",
  })

  // Set default source account if accounts exist
  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.accountId) {
      setFormData((prev) => ({ ...prev, accountId: accounts[0].id }))
    }
  }, [accounts, formData.accountId])

  useEffect(() => {
    if (success) {
      setShowCheck(false);
      const timer = setTimeout(() => {
        setShowCheck(true);
      }, 1500); // simulate delay before showing check
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear specific error when field is edited
    if (formErrors[name as keyof DepositFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof DepositFormErrors];
        return newErrors;
      });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = formData[`${side}ImagePreview`]
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const newPreviewUrl = URL.createObjectURL(file)

    setFormData((prev) => ({
      ...prev,
      [`${side}ImageFile`]: file,
      [`${side}ImagePreview`]: newPreviewUrl,
    }))

    // Clear specific error when image is uploaded
    if (formErrors[`${side}Image` as keyof DepositFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${side}Image` as keyof DepositFormErrors];
        return newErrors;
      });
    }
  }

  const removeImage = (side: "front" | "back") => {
    // Revoke the URL to prevent memory leaks
    if (formData[`${side}ImagePreview`]) {
      URL.revokeObjectURL(formData[`${side}ImagePreview`])
    }

    // Reset the file and preview
    setFormData((prev) => ({
      ...prev,
      [`${side}ImageFile`]: null,
      [`${side}ImagePreview`]: "",
    }))

    // Reset the file input
    if (side === "front" && frontImageRef.current) {
      frontImageRef.current.value = ""
    } else if (side === "back" && backImageRef.current) {
      backImageRef.current.value = ""
    }
  }

  const triggerFileInput = (side: "front" | "back") => {
    if (side === "front") {
      frontImageRef.current?.click()
    } else {
      backImageRef.current?.click()
    }
  }

  const validateFields = () => {
    const errors: DepositFormErrors = {};

    // Validate amount
    const amountValue = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      errors.amount = 'Amount is required.';
    } else if (isNaN(amountValue) || amountValue <= 0) {
      errors.amount = 'Enter a valid amount greater than zero.';
    }

    // Validate account selection
    if (!formData.accountId) {
      errors.accountId = 'Please select an account.';
    }

    // Validate front image
    if (!formData.frontImageFile) {
      errors.frontImage = 'Front image of check is required.';
    }

    // Validate back image
    if (!formData.backImageFile) {
      errors.backImage = 'Back image of check is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitialSubmit = (e: FormEvent) => {
    e.preventDefault();

    // First validate fields
    if (!validateFields()) return;

    // Show confirmation screen
    setShowConfirmation(true);
  };

  const handleConfirmDeposit = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!user) throw new Error("User not authenticated");

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Find the selected account
      const selectedAccount = accounts.find((acc) => acc.id === formData.accountId);
      if (!selectedAccount) {
        throw new Error("Selected account not found");
      }

      // In a real implementation, we would upload the check images to storage
      // and get back URLs to store in the database
      console.log("Processing check deposit with front and back images");
      const frontImageUrl = `dummy/path/to/${formData.frontImageFile?.name}`;
      const backImageUrl = `dummy/path/to/${formData.backImageFile?.name}`;

      // Create deposit record
      // const { data: depositData, error: depositError } = await supabase
      //   .from("deposits")
      //   .insert([
      //     {
      //       user_id: user.id,
      //       account_id: formData.accountId,
      //       amount: amount,
      //       front_image_url: frontImageUrl,
      //       back_image_url: backImageUrl,
      //       status: "Pending",
      //       submitted_at: new Date().toISOString(),
      //     },
      //   ])
      //   .select("id")
      //   .single();

      // if (depositError) {
      //   console.error("Deposit insert error:", depositError);
      //   throw new Error(depositError.message || "Failed to create deposit record");
      // }

      // if (!depositData) {
      //   console.error("No deposit data returned");
      //   throw new Error("No deposit data returned from database");
      // }

      // Create transaction record for the deposit
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            transaction_date: new Date().toISOString(),
            description: "Mobile Check Deposit",
            amount: amount, // Positive amount for incoming deposits
            type: "Credit",
            status: "Pending", // Status is pending until the check clears
            user_id: user.id,
            account_type: selectedAccount.account_type,
          },
        ]);

      if (transactionError) {
        console.error("Transaction insert error:", transactionError);
        throw new Error(transactionError.message || "Failed to create transaction record");
      }

      // Refresh transactions list
      await fetchTransactions();

      // Reset form and show success message
      setFormData({
        amount: "",
        accountId: accounts[0]?.id || "",
        frontImageFile: null,
        backImageFile: null,
        frontImagePreview: "",
        backImagePreview: "",
      });

      setSuccess(true);
      setShowConfirmation(false);

      // Reset file inputs
      if (frontImageRef.current) frontImageRef.current.value = "";
      if (backImageRef.current) backImageRef.current.value = "";


    } catch (error: any) {

      setError(error.message || "An error occurred while processing your deposit");
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '$0.00';

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  }

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  }

  const selectedAccount = accounts.find(acc => acc.id === formData.accountId);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (formData.frontImagePreview) URL.revokeObjectURL(formData.frontImagePreview);
      if (formData.backImagePreview) URL.revokeObjectURL(formData.backImagePreview);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-yellow-800 to-yellow-600 px-6 py-5 text-white">
          <div className="flex items-center mb-1">
            <Camera className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Mobile Check Deposit</h2>
          </div>
          <p className="text-yellow-100 text-sm">Deposit checks quickly and securely using your device's camera</p>
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
                  <p className="font-semibold text-green-700">Deposit Submitted Successfully</p>
                  <p className="text-sm text-green-700">
                    Your check deposit has been received and is pending review. Funds will be available in your account after the check clears, typically within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Deposit Failed</p>
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
                    <Check className="h-4 w-4 mr-2" />
                    Deposit Guidelines
                  </h3>
                  <ul className="text-xs text-yellow-700 list-disc pl-5 space-y-1">
                    <li>Endorse the back of your check with your signature</li>
                    <li>Write "For Mobile Deposit Only" below your signature</li>
                    <li>Ensure both images are clear and well-lit</li>
                    <li>Deposits submitted before 8 PM ET on business days will be processed same day</li>
                  </ul>
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                    From Account
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                    </div>
                    <select
                      id="accountId"
                      name="accountId"
                      value={formData.accountId}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border ${formErrors.accountId ? 'border-red-500' : 'border-gray-300'
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
                  {formErrors.accountId && (
                    <p className="mt-0.5 text-xs text-red-600">{formErrors.accountId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Check Amount
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

                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-md font-medium text-gray-800 mb-4">Check Images</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Front Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Front of Check
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => triggerFileInput("front")}
                        className={`w-full h-40 border-2 ${formData.frontImagePreview
                            ? "border-gray-300"
                            : formErrors.frontImage
                              ? "border-red-300 bg-red-50"
                              : "border-dashed border-yellow-400 hover:border-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                          } rounded-lg flex items-center justify-center text-center 
                        transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                        shadow-sm hover:shadow-md`}
                      >
                        {formData.frontImagePreview ? (
                          <img
                            src={formData.frontImagePreview}
                            alt="Front of check preview"
                            className="w-full h-full object-contain rounded-lg p-1"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-10 w-10 text-yellow-600" />
                            <span className="mt-2 text-sm font-medium text-yellow-600">
                              Upload front of check
                            </span>
                          </div>
                        )}
                      </button>

                      {formData.frontImagePreview && (
                        <button
                          type="button"
                          onClick={() => removeImage("front")}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md 
                          border border-gray-200 hover:bg-red-100 transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Remove front image"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      )}

                      <input
                        type="file"
                        id="frontImage"
                        name="frontImage"
                        ref={frontImageRef}
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "front")}
                        className="hidden"
                      />
                    </div>
                    {formErrors.frontImage && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.frontImage}</p>
                    )}
                  </div>

                  {/* Back Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Back of Check
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => triggerFileInput("back")}
                        className={`w-full h-40 border-2 ${formData.backImagePreview
                            ? "border-gray-300"
                            : formErrors.backImage
                              ? "border-red-300 bg-red-50"
                              : "border-dashed border-yellow-400 hover:border-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                          } rounded-lg flex items-center justify-center text-center 
                        transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                        shadow-sm hover:shadow-md`}
                      >
                        {formData.backImagePreview ? (
                          <img
                            src={formData.backImagePreview}
                            alt="Back of check preview"
                            className="w-full h-full object-contain rounded-lg p-1"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-10 w-10 text-yellow-600" />
                            <span className="mt-2 text-sm font-medium text-yellow-600">
                              Upload back of check
                            </span>
                          </div>
                        )}
                      </button>

                      {formData.backImagePreview && (
                        <button
                          type="button"
                          onClick={() => removeImage("back")}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md 
                          border border-gray-200 hover:bg-red-100 transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Remove back image"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      )}

                      <input
                        type="file"
                        id="backImage"
                        name="backImage"
                        ref={backImageRef}
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "back")}
                        className="hidden"
                      />
                    </div>
                    {formErrors.backImage && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.backImage}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Continue
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Confirmation UI */
            <div className="space-y-6">
              <div className="bg-yellow-50 p-5 rounded-md border border-yellow-100">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Please Confirm Your Deposit</h3>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">To Account:</span>
                    <span className="font-medium text-gray-900">{selectedAccount?.account_type} - {selectedAccount?.account_number}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-yellow-100">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-yellow-800 text-lg">
                      {formatCurrency(formData.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Estimated Availability:</span>
                    <span className="font-medium text-gray-900">1-2 Business Days</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="border border-yellow-200 rounded-md p-2 bg-white">
                    <p className="text-xs text-center text-gray-500 mb-2">Front of Check</p>
                    <img
                      src={formData.frontImagePreview}
                      alt="Front of check preview"
                      className="w-full h-32 object-contain rounded-md"
                    />
                  </div>
                  <div className="border border-yellow-200 rounded-md p-2 bg-white">
                    <p className="text-xs text-center text-gray-500 mb-2">Back of Check</p>
                    <img
                      src={formData.backImagePreview}
                      alt="Back of check preview"
                      className="w-full h-32 object-contain rounded-md"
                    />
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
                  onClick={handleConfirmDeposit}
                  disabled={loading}
                  className="flex-1 flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Deposit
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
                <h4 className="text-sm font-medium text-gray-900">Secure Deposit</h4>
                <p className="text-xs text-gray-500 mt-1">Your financial information and check images are encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
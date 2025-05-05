"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useAuth } from "@/contexts/auth-context";
import { Shield, AlertCircle, Lock, User, Key } from "lucide-react";
import { motion } from "framer-motion";


const loginEmail = process.env.NEXT_PUBLIC_LOGIN_EMAIL!
const loginUserId = process.env.NEXT_PUBLIC_LOGIN_USER_ID!

export default function Login() {

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
console.log("userId", loginUserId);
console.log("loginEmial", loginEmail)
console.log("all env", process.env)
      if (userId.toString() !== loginUserId.toString()) {
        setError("Invalid credentials");
      }

      const { error } = await signIn(loginEmail, password, accessCode);

      if (error) {
        setError(error.message || "Failed to sign in");
      }

    } catch (err) {
      console.log(err)
      setError("Invalid credentials , ensure your details are correct");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
       <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Logo className="w-32" />
            </motion.div>
          </Link>
        </div>
      </header>


      {/* Background SVG Decorations */}
      <svg className="absolute top-0 left-0 w-96 h-96 text-yellow-100 opacity-20" viewBox="0 0 200 200" fill="currentColor">
        <path d="M43.2,-75.7C56.4,-64.5,67.3,-52,70.5,-38.6C73.8,-25.3,69.4,-11.2,68.6,3.8C67.9,18.9,70.9,34.9,64.6,46.3C58.4,57.6,42.9,64.3,28.1,67.8C13.3,71.4,-0.9,71.8,-14.6,68.8C-28.3,65.7,-41.5,59.3,-50.7,48.8C-60,38.3,-65.3,23.7,-65.8,9.2C-66.4,-5.4,-62.2,-19.7,-55.8,-31.7C-49.5,-43.6,-41.1,-53.3,-30.3,-65C-19.6,-76.6,-9.8,-90.3,2.3,-93.4C14.4,-96.5,28.7,-89.9,43.2,-75.7Z" transform="translate(100 100)" />
      </svg>

      <svg className="absolute bottom-0 right-0 w-64 h-64 text-yellow-100 opacity-10" viewBox="0 0 200 200" fill="currentColor">
        <path d="M43.2,-75.7C56.4,-64.5,67.3,-52,70.5,-38.6C73.8,-25.3,69.4,-11.2,68.6,3.8C67.9,18.9,70.9,34.9,64.6,46.3C58.4,57.6,42.9,64.3,28.1,67.8C13.3,71.4,-0.9,71.8,-14.6,68.8C-28.3,65.7,-41.5,59.3,-50.7,48.8C-60,38.3,-65.3,23.7,-65.8,9.2C-66.4,-5.4,-62.2,-19.7,-55.8,-31.7C-49.5,-43.6,-41.1,-53.3,-30.3,-65C-19.6,-76.6,-9.8,-90.3,2.3,-93.4C14.4,-96.5,28.7,-89.9,43.2,-75.7Z" transform="translate(100 100)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Centered Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Logo className="w-36 h-auto" />
        </motion.div>

        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Secure Client Login</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
          </div>

          <motion.div
            className="bg-white shadow-lg rounded-lg p-8 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="user-id" className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="user-id"
                    name="userId"
                    type="text"
                    required
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter your User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="access-code" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="access-code"
                    name="accessCode"
                    type="text"
                    required
                    className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter your access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-900 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure login</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Shield className="h-5 w-5 text-yellow-900 mr-2" />
                <p className="text-xs text-gray-600">
                  Your connection to Gibraltar Private Bank is secure and encrypted
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <p className="text-sm text-gray-600">
              Need an account?{" "}
              <Link href="/contact-support-for-registration" className="font-medium text-yellow-900 hover:text-yellow-800 transition-colors">
                Contact support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <footer className="relative z-10 bg-white border-t border-gray-200 py-4 shadow-inner">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Gibraltar Private Bank & Trust. All rights reserved.
          </p>
        </div>
      </footer>
      <div className="bg-gradient-to-b from-gray-100 via-white to-white text-gray-600 text-xs px-6 py-12 border-t border-gray-300">
        <div className="max-w-7xl mx-auto space-y-4 leading-relaxed text-justify">
          <p>
            <strong>Insurance Products, Investments & Annuities:</strong> Not A Deposit, Not Guaranteed By The Bank Or Its Affiliates,
            Not FDIC Insured, Not Insured By Any Federal Government Agency, May Go Down In Value.
          </p>
          <p>
            Banking Products and Services provided by Gibraltar Private Bank & Trust. Member FDIC. Equal Housing Lender.
          </p>
          <p>
            Insurance Products and Annuities: May be purchased from any agent or company, and the customer’s choice will not affect
            current or future credit decisions.
          </p>
          <p>
            Gibraltar Advisors is the trade name for wealth management products and services provided by Gibraltar Bank and its
            affiliates. Trust services and financial planning provided by Gibraltar Bank.
          </p>
          <p>
            Investment management services, investments, annuities and financial planning available through Gibraltar Advisors, Inc.,
            member FINRA, SIPC, and a subsidiary of Gibraltar Bank.
          </p>
          <p>
            Insurance products available through Gibraltar Insurance Services, Inc. ("GIS"), a subsidiary of Gibraltar Bank.
          </p>
          <p>
            The contents of this website are for informational purposes only. Nothing on this website should be considered investment
            advice; or, a recommendation or offer to buy or sell a security or other financial product or to adopt any investment
            strategy.
          </p>
          <p>
            Gibraltar Advisors does not offer tax or legal advice. You should consult your personal tax and/or legal advisor concerning
            your individual situation.
          </p>
          <p className="pt-2 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Gibraltar Private Bank & Trust. Member FDIC.
          </p>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link"
import {Logo} from "@/components/logo"

export default function ContactSupportForRegistration() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="w-48 mb-6" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registration Information</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Online Registration Not Available</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Gibraltar Private Bank & Trust accounts are set up directly by our banking personnel. Online registration is
            not available for security reasons.
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Contact Us</h4>
            <p className="text-gray-700 mb-2">Please contact our support team to set up your account:</p>
            <ul className="space-y-1 text-gray-700">
              <li>
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </li>
              <li>
                <span className="font-medium">Email:</span> support@gibraltarbank.com
              </li>
              <li>
                <span className="font-medium">Hours:</span> Monday-Friday, 9am-5pm EST
              </li>
            </ul>
          </div>
          <p className="text-gray-700 mb-6">
            One of our representatives will assist you with the account setup process and provide you with your secure
            login credentials.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
            <Link href="/login" className="p-4 bg-yellow-900">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

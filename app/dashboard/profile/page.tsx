"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Home, 
  CreditCard, 
  Shield, 
  Clock, 
  Download, 
  FileText, 
  AlertCircle, 
  Lock, 
  ChevronRight,
  Building,
  Key,
  Edit
} from "lucide-react"

// Fake account activity for demo purposes
const ACCOUNT_ACTIVITY = [
  {
    id: "act-1",
    type: "Login",
    date: "2025-05-02T14:32:00",
    details: "Web login from , USA",
    device: "Mobile App on iPhone"
  },
  {
    id: "act-2",
    type: "Password Changed",
    date: "2025-04-28T09:15:00",
    details: "Password successfully updated",
    device: "Mobile App on iPhone"
  },
  {
    id: "act-3",
    type: "Profile Updated",
    date: "2025-04-15T11:05:00",
    details: "Contact details updated",
    device: "Mobile App on iPhone"
  },
  {
    id: "act-4",
    type: "Login",
    date: "2025-04-10T19:22:00",
    details: "Web login from New York, USA",
    device: "Mobile App on iPhone"
  }
];

// Recent documents for demo
const RECENT_DOCUMENTS = [
    {
        id: "doc-1",
        name: "Account Statement - April 2025",
        date: "2025-05-01T08:15:00",
        type: "PDF",
        size: "890 KB"
      },
  {
    id: "doc-2",
    name: "Gibraltar Terms of Service",
    date: "2024-11-20T14:45:00",
    type: "PDF",
    size: "450 KB"
  },
];

export default function Profile() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Format date without time
  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date)
  }

  if (loading) {
    return (
        <div className="space-y-8">
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
  
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-md shadow-sm h-32"></div>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm h-32"></div>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm h-32"></div>
            </div>
          </div>
  
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded shadow-inner"></div>
          </div>
        </div>
      )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main profile information */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-yellow-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <User size={20} className="mr-2" />
                <h2 className="font-semibold">Personal Info.</h2>
              </div>
              <button className="text-xs bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded-full flex items-center">
                <Edit size={14} className="mr-1" />
                Contact Support to Edit
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile picture and name */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-800 text-3xl font-bold mb-3">
                    {profile?.firstName?.charAt(0) || 'U'}{profile?.lastName?.charAt(0) || 'N'}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{profile?.firstName} {profile?.lastName}</h3>
                  <p className="text-sm text-gray-500">Customer Since January 2022</p>
                  {/* <p className="text-sm text-gray-500">Customer since {profile?.created_at ? formatDateOnly(profile.created_at) : 'January 2022'}</p> */}
                </div>
                
                {/* Profile details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <div className="flex items-center">
                      <Mail size={16} className="text-yellow-700 mr-2" />
                      <p className="text-gray-800">{profile?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <div className="flex items-center">
                      <Phone size={16} className="text-yellow-700 mr-2" />
                      <p className="text-gray-800">{profile?.phoneNumber || '(442) 3464 753'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Customer ID</p>
                    <div className="flex items-center">
                      <Key size={16} className="text-yellow-700 mr-2" />
                      <p className="text-gray-800">{profile?.id || 'GIB12345678'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Residential Address</p>
                    <div className="flex items-start">
                      <Home size={16} className="text-yellow-700 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-gray-800">
                        {profile?.address || '123 Main Street'}<br />
                        {profile?.city || 'San Francisco'}, {profile?.state || 'CA'} {profile?.zipCode || '94105'}<br />
                        {profile?.country || 'United States'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Mailing Address</p>
                    <div className="flex items-start">
                      <Building size={16} className="text-yellow-700 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-gray-800">
                         Same as residential address
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Activity */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-yellow-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={20} className="mr-2" />
                <h2 className="font-semibold">Recent Account Activity</h2>
              </div>
              {/* <button className="text-xs bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded-full">
                View All Activity
              </button> */}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ACCOUNT_ACTIVITY.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <Lock size={14} className="text-yellow-700" />
                          </div>
                          <span className="text-sm text-gray-900">{activity.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.device}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Account Security */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-yellow-800 text-white px-4 py-3">
              <div className="flex items-center">
                <Shield size={20} className="mr-2" />
                <h2 className="font-semibold">Account Security</h2>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Lock size={14} className="text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Password</h3>
                    <p className="text-xs text-gray-500">Last changed {formatDateOnly("2025-04-28")}</p>
                  </div>
                </div>
                {/* <button className="text-xs text-yellow-700 hover:text-yellow-800">Change</button> */}
              </div>
              
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Shield size={14} className="text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500">Enabled via SMS</p>
                  </div>
                </div>
                {/* <button className="text-xs text-yellow-700 hover:text-yellow-800">Manage</button> */}
              </div>
              
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <AlertCircle size={14} className="text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Login Notifications</h3>
                    <p className="text-xs text-gray-500">Not configured</p>
                  </div>
                </div>
                {/* <button className="text-xs text-yellow-700 hover:text-yellow-800">Set up</button> */}
              </div>
              
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                <div className="flex items-start">
                  <Shield size={16} className="text-yellow-700 mr-2 mt-0.5 flex-shrink-0" />
                  <p>
                    Your account security is important to us. We recommend enabling all security features to protect your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Documents */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-yellow-800 text-white px-4 py-3">
              <div className="flex items-center">
                <FileText size={20} className="mr-2" />
                <h2 className="font-semibold">Recent Documents</h2>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {RECENT_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-red-700">{doc.type}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{formatDateOnly(doc.date)} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="text-yellow-700 hover:text-yellow-900">
                    {/* <Download size={16} /> */}
                  </button>
                </div>
              ))}
              
              {/* <button className="w-full text-center py-2 text-sm text-yellow-700 hover:text-yellow-900 flex items-center justify-center">
                View All Documents <ChevronRight size={16} className="ml-1" />
              </button> */}
            </div>
          </div>
          
          {/* Help Section */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-yellow-800 text-white px-4 py-3">
              <h2 className="font-semibold">Need Help?</h2>
            </div>
            <div className="p-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      To update your profile information, please contact our customer support team.
                    </p>
                  </div>
                </div>
              </div>
              
              <a href="/dashboard/messages" className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div className="flex items-center">
                  <Mail size={18} className="text-yellow-700 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Contact Support</span>
                </div>
                <ChevronRight size={16} className="text-yellow-700" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  ArrowLeftRight,
  Upload,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  User,
  Settings,
  HelpCircle
} from "lucide-react"


const dummyNotifications = [
  { id: 1, title: "Deposit Received", message: "A deposit of $1,600,879.00 was made to your Business Account." },
  { id: 2, title: "Payment Sent", message: "Your payment of $75.00 to 'Utility Company' has been completed." },
  { id: 3, title: "Statement Ready", message: "Your account statement is now available." },
  { id: 4, title: "Security Alert", message: "We noticed a new login ." },
];

// Skeleton loader component
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse w-full">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-6"></div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-60 bg-gray-200 rounded-lg w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, profile } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  // Track scroll for shadow effect on header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    // Close sidebar when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    if (sidebarOpen) {
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick)
      }, 100)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [sidebarOpen])

  // Track page transitions to show/hide loader
  useEffect(() => {
    // Initialize loading state
    setLoading(false);

    // Listen for route change start
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    // Listen for route change complete
    const handleRouteChangeComplete = () => {
      // Add a small delay to make the transition feel more natural
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    // Create mock event listeners for route changes
    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  // Reset loading state when pathname changes
  useEffect(() => {
    // Set loading to false after path change is complete
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [pathname]);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Transfers",
      href: "/dashboard/transfer",
      icon: ArrowLeftRight,
    },
    {
      name: "Deposits",
      href: "/dashboard/deposit",
      icon: Upload,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
  ]

  // Custom navigation handler
  const handleNavigation = (href: string) => {
    setLoading(true);
    setSidebarOpen(false);
    
    // Simulate navigation delay
    setTimeout(() => {
      window.location.href = href;
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-30 w-72 max-w-xs transform transition duration-300 ease-in-out md:hidden bg-white shadow-lg ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex-shrink-0 flex items-center px-6 py-6 h-20 border-b border-gray-200">
          <Logo className="w-36 transition-transform duration-200 hover:scale-105" />
        </div>

        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-900 font-semibold mr-4 shadow-sm transition-all duration-200 hover:shadow">
              {profile?.firstName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{profile?.firstName || "User"}</p>
              <p className="text-xs text-gray-500 mt-1">{profile?.email || "gibraltar@contact.com"} </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-yellow-500 focus:border-yellow-500 transition-shadow duration-200 hover:shadow-sm"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</p>
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${pathname === item.href
                ? "bg-yellow-50 text-yellow-900 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-yellow-900 hover:shadow-sm"
                }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation(item.href);
              }}
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-all duration-200 ${pathname === item.href
                  ? "text-yellow-900"
                  : "text-gray-500 group-hover:text-yellow-900 group-hover:scale-110"
                  }`}
              />
              {item.name}
            </a>
          ))}

          <div className="border-t border-gray-200 my-6"></div>
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</p>

          <a
            href="/dashboard/profile"
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-yellow-900 hover:shadow-sm transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/dashboard/profile");
            }}
          >
            <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-yellow-900 group-hover:scale-110 transition-all duration-200" />
            Settings
          </a>

          <a
            href="/dashboard/messages"
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-yellow-900 hover:shadow-sm transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/dashboard/messages");
            }}
          >
            <HelpCircle className="mr-3 h-5 w-5 text-gray-500 group-hover:text-yellow-900 group-hover:scale-110 transition-all duration-200" />
            Help Center
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              signOut();
            }}
            className="w-full group flex items-center px-4 py-3 mt-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-red-700 group-hover:scale-110 transition-all duration-200" />
            Logout
          </button>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-full border-r border-gray-200 bg-white">
            <div className="flex-shrink-0 flex items-center px-6 py-5 h-16 border-b border-gray-200">
              <Logo className="w-32" />
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-900 font-semibold mr-3">
                  {profile?.firstName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{profile?.firstName || "User"}</p>
                  <p className="text-xs text-gray-500">{profile?.email || "Gibraltar@info.com"}</p>
                </div>
              </div>
            </div>

            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Main</p>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${pathname === item.href
                    ? "bg-yellow-50 text-yellow-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-yellow-900"
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${pathname === item.href ? "text-yellow-900" : "text-gray-500 group-hover:text-yellow-900"
                      }`}
                  />
                  {item.name}
                </a>
              ))}

              <div className="border-t border-gray-200 my-4"></div>
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Account</p>

              <a 
                href="/dashboard/profile" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-yellow-900 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/dashboard/profile");
                }}
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-yellow-900" />
                Settings
              </a>

              <a 
                href="/dashboard/help" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-yellow-900 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/dashboard/help");
                }}
              >
                <HelpCircle className="mr-3 h-5 w-5 text-gray-500 group-hover:text-yellow-900" />
                Help Center
              </a>

              <button
               onClick={(e) => {
                e.stopPropagation();
                signOut();
              }}
                className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-yellow-900 transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-yellow-900" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-full flex-1 overflow-hidden">
        <header className={`z-10 flex-shrink-0 flex h-16 bg-white ${scrolled ? 'shadow-md' : ''} transition-shadow duration-200`}>
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {navItems.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>

            <div className="ml-4 flex items-center space-x-4" ref={notificationRef}>
              <button
                type="button"
                className="p-1 rounded-full text-gray-500 hover:text-yellow-900 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                aria-label="View notifications"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <span className="sr-only">View notifications</span>
                {notificationOpen ? (
                  <X className="h-6 w-6" /> // Show 'X' when open
                ) : (
                  <>
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform -translate-y-1 translate-x-1"></span>
                  </>
                )}
              </button>

              {notificationOpen && (
                <div className="origin-top-right absolute right-20 top-14 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 overflow-hidden">
                  <div className="py-2">
                    {dummyNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => setNotificationOpen(false)}
                        className="px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-500">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-900 font-semibold border-2 border-white shadow-sm">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {(profile?.firstName && profile?.lastName)
                        ? `${profile.firstName} ${profile.lastName}`
                        : profile?.firstName || profile?.full_name || "User"
                      }</p>
                    <p className="text-xs text-gray-500 truncate">Premium Client</p>
                  </div>
                  <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <a
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation("/dashboard/profile");
                      }}
                    >
                      Your Profile
                    </a>
                    <a
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation("/dashboard/profile");
                      }}
                    >
                      Settings
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Show skeleton loader when loading is true */}
              {loading ? (
                <div className="transition-opacity duration-300">
                  <SkeletonLoader />
                </div>
              ) : (
                <div className="transition-opacity duration-300">
                  {children}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
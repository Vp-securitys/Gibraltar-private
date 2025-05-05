"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Shield,
  CreditCard,
  BarChart3,
  Users,
  PiggyBank,
  DollarSign,
  TrendingUp,
  Headphones,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/logo";
import HeroImage from "../public/HomepageHero.jpg";
import FeaturedHomeRightImage from "../public/FeaturedHomeRightSmB.jpg";
import FeaturedHomeLeftImage from "../public/FeaturedHomeLeftPersonal.jpg";
import FeaturedHomeMiddleImage from "../public/Q424FeaturedHomeMiddle.jpg";
import Service1 from "../public/Service-1.jpg";
import Ceo1 from "../public/MackWilbourn.png";
import BiggerImage1 from "../public/easy-wireless-yechnology-payment.jpg";
import BiggerImage2 from "../public/diverse-business-entrepreneurs-sitting-conference-table-working-management-solution.jpg";

const categories = [
  {
    icon: CreditCard,
    title: "Checking Accounts",
    description: "Manage your daily finances with ease",
  },
  {
    icon: PiggyBank,
    title: "Savings Accounts",
    description: "Watch your money grow with competitive rates",
  },
  {
    icon: DollarSign,
    title: "Loans",
    description: "Finance your dreams with flexible options",
  },
  {
    icon: CreditCard,
    title: "Credit Cards",
    description: "Earn rewards on everyday purchases",
  },
  {
    icon: TrendingUp,
    title: "Investing",
    description: "Build wealth with smart investment solutions",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "We're here to help 24/7",
  },
];

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Logo size="md" className="w-40" />
            </div>
            {/* <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-yellow-900 font-medium">
                Personal
              </a>
              <a href="#" className="text-gray-700 hover:text-yellow-900 font-medium">
                Business
              </a>
              <a href="#" className="text-gray-700 hover:text-yellow-900 font-medium">
                Wealth Management
              </a>
              <a href="#" className="text-gray-700 hover:text-yellow-900 font-medium">
                About Us
              </a>
            </nav> */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden md:block px-4 py-2 text-yellow-900 font-medium border border-yellow-900 rounded hover:bg-yellow-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-yellow-900 text-white font-medium rounded hover:bg-yellow-800 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-10"></div>
          <div className="relative h-[600px] overflow-hidden">
            <Image
              src={HeroImage}
              alt="Luxury banking experience"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
                  Banking Excellence for Discerning Clients
                </h1>
                <p className="text-xl text-black/90 mb-8">
                  Experience personalized financial solutions with Gibraltar
                  Private Bank & Trust, where your wealth is our priority.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-yellow-900 text-white font-semibold rounded-md hover:bg-gray-100 transition-colors text-center"
                  >
                    Access Your Account
                  </Link>
                  <a
                    href="#learn-more"
                    className="px-6 py-3 border border-yellow-900 text-black font-semibold rounded-md hover:bg-white/10 transition-colors text-center"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How we can help */}
        <section className="bg-gradient-to-b from-white to-yellow-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How Can We Help You?
              </h2>
              <p className="text-lg text-gray-600">
                Explore our comprehensive financial solutions tailored to your
                needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={index}
                    className="relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="p-8">
                      <div
                        className={`relative z-10 flex flex-col items-center text-center transition-all duration-300 ${isHovered ? "transform -translate-y-2" : ""
                          }`}
                      >
                        <div
                          className={`h-20 w-20 flex items-center justify-center rounded-full mb-6 transition-all duration-300 ${isHovered ? "bg-yellow-600" : "bg-yellow-100"
                            }`}
                        >
                          <Icon
                            className={`h-10 w-10 transition-all duration-300 ${isHovered ? "text-white" : "text-yellow-600"
                              }`}
                          />
                        </div>

                        <h3 className="font-bold text-xl text-gray-800 mb-3">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {category.description}
                        </p>

                        <span
                          className={`inline-flex items-center font-semibold transition-all duration-300 ${isHovered ? "text-yellow-600" : "text-yellow-500"
                            }`}
                        >
                          Learn More <ExternalLink className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Animated background decoration */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${isHovered ? "bg-yellow-600" : "bg-transparent"
                        }`}
                    ></div>
                    <div className="absolute -bottom-full right-0 w-32 h-32 rounded-full bg-yellow-50 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-1/2 group-hover:translate-x-1/4"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-white py-12 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Banking */}
              <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-full h-60 relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={FeaturedHomeLeftImage}
                    alt="Personal Banking"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                  Personal Banking
                </h3>
                <p className="text-gray-600 mb-4">
                  Tailored financial solutions for your individual needs.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-yellow-900 font-medium"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Business Banking */}
              <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-full h-60 relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={FeaturedHomeRightImage}
                    alt="Business Banking"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                  Business Banking
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive services to help your business thrive.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-yellow-900 font-medium"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Wealth Management */}
              <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-full h-60 relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={FeaturedHomeMiddleImage}
                    alt="Wealth Management"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                  Wealth Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Strategic investment solutions for long-term growth.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-yellow-900 font-medium"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="learn-more" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Premier Banking Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Gibraltar Private Bank & Trust offers exclusive financial
                services designed for clients who expect excellence.
              </p>
            </div>

            {/* First Feature Block */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24 group">
              <div className="transition-all duration-700 delay-100">
                <h3 className="text-3xl font-bold text-yellow-900 mb-4">
                  Personalized Wealth Management
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Our wealth management approach is built around your unique
                  financial goals. We provide sophisticated strategies to
                  preserve and grow your wealth for generations.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <BarChart3 className="h-4 w-4 text-yellow-900" />
                    </div>
                    <span className="text-gray-700">
                      Customized investment portfolios
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-yellow-900" />
                    </div>
                    <span className="text-gray-700">
                      Estate planning and wealth preservation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-yellow-900" />
                    </div>
                    <span className="text-gray-700">
                      Family office services
                    </span>
                  </li>
                </ul>
                <a
                  href="#"
                  className="inline-flex items-center text-yellow-900 font-medium mt-6 transition-all hover:underline"
                >
                  Explore wealth management{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-2xl group">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10 rounded-3xl" />
                <Image
                  src={BiggerImage1} // Or BiggerImage2
                  alt="Wealth management services"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Second Feature Block */}
            <div className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-2xl group">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10 rounded-3xl" />
                <Image
                  src={BiggerImage2} // Or BiggerImage2
                  alt="Wealth management services"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="order-1 md:order-2 transition-all duration-700 delay-100">
                <h3 className="text-3xl font-bold text-yellow-900 mb-4">
                  Exclusive Private Banking
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Experience banking that goes beyond the ordinary. Our private
                  banking services offer personalized attention and exclusive
                  benefits designed for our distinguished clientele.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-yellow-900" />
                    </div>
                    <span className="text-gray-700">
                      Premium banking products with enhanced benefits
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-yellow-900" />
                    </div>
                    <span className="text-gray-700">
                      Dedicated private banker and relationship team
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-yellow-900" />
                    </div>
                    <span className="text-gray-700">
                      Enhanced security and privacy protections
                    </span>
                  </li>
                </ul>
                <a
                  href="#"
                  className="inline-flex items-center text-yellow-900 font-medium mt-6 transition-all hover:underline"
                >
                  Discover private banking{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="pt-32 pb-24 bg-white">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              <h3 className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-6">
                Where there's a dream, there's a way.
              </h3>

              <p className="text-2xl md:text-3xl text-gray-900 font-light leading-relaxed mb-8">
                It’s a new chapter, and I want to do things that I’m passionate
                about for my community.
              </p>

              <div className="flex items-center space-x-4 mb-10">
                <div>
                  <p className="font-semibold text-gray-900">Mack Wilbourn</p>
                  <p className="text-yellow-700 text-sm uppercase font-medium">
                    Owner & President, Mack II, Inc.
                  </p>
                </div>
                <div className="text-yellow-700 text-5xl font-bold">”</div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex space-x-4">
                <button
                  className="w-12 h-12 bg-yellow-900 text-white flex items-center justify-center rounded hover:bg-yellow-700 transition"
                  aria-label="Previous testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="w-12 h-12 bg-yellow-900 text-white flex items-center justify-center rounded hover:bg-yellow-700 transition"
                  aria-label="Next testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Images Content */}
            <div className="w-full lg:w-1/2 flex justify-center gap-6">
              {/* First Image */}
              <div className="overflow-hidden rounded-lg shadow-lg w-60 h-80">
                <Image
                  src={Ceo1}
                  alt="Mack Wilbourn smiling"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Second Image */}
              <div className="overflow-hidden rounded-lg shadow-lg w-60 h-80">
                <Image
                  src={Ceo1}
                  alt="Another testimonial"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="relative group overflow-hidden h-[500px] md:h-[600px]">
          <Image
            src={Service1}
            alt="A corporate man standing"
            fill
            className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-yellow-900/40 transition-opacity duration-700 group-hover:opacity-90" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-20 z-10 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Tailored Financial Services
            </h2>
            <p className="text-lg md:text-xl text-gray-100 max-w-xl animate-fade-in-up delay-200">
              Designed for individuals, families, and businesses who demand
              excellence and discretion.
            </p>
            <a
              href="#"
              className="mt-6 inline-block bg-yellow-900 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-800 transition-all duration-300 animate-fade-in-up delay-400"
            >
              Explore Our Services
            </a>
          </div>
        </section>

        {/* CTA section */}

        <section className="relative overflow-hidden bg-white py-24">
          {/* Background Gradient Shapes */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-900 opacity-20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-yellow-900 opacity-10 rounded-full blur-[120px]" />

          {/* Decorative SVG or Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="#b45309" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          {/* CTA Content */}
          <div className="relative container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-900 mb-6 tracking-tight animate-fade-in-up">
              Experience the Gibraltar Difference
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
              Step into a world of refined financial services, tailored
              exclusively for clients who expect nothing but the best.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
              <Link
                href="/login"
                className="group relative px-6 py-3 bg-yellow-900 text-white font-semibold rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg"
              >
                Access Your Account
                <span className="absolute inset-0 rounded-full ring-2 ring-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/contact-support-for-registration"
                className="px-6 py-3 border-2 border-yellow-900 text-yellow-900 font-semibold rounded-full hover:bg-yellow-900 hover:text-white transition-all hover:scale-105"
              >
                Contact Us
              </Link>
            </div>

            {/* Icon or Decorative Element */}
            <div className="mt-12">
              <svg
                className="mx-auto w-10 h-10 text-yellow-900 animate-bounce"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 3a1 1 0 011 1v9.586l2.95-2.95a1 1 0 111.414 1.414l-4.657 4.657a1 1 0 01-1.414 0l-4.657-4.657a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" />
              </svg>
            </div>
          </div>
        </section>
      </main>

      {/* Pre-Footer: Subtle divider or badges */}
      <div className="bg-black text-white py-4 text-center text-sm tracking-wide shadow-inner">
        Trusted. Discreet. Secure Banking for High Net-Worth Individuals.
      </div>


      {/* Main Footer */}
      <footer className="bg-yellow-900 text-white py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h2 className="text-2xl font-extrabold mb-2">GIBRALTAR</h2>
              <span className="text-sm text-white font-medium tracking-wide block mb-4">
                PRIVATE BANK & TRUST
              </span>
              <p className="text-white text-sm leading-relaxed">
                Providing exclusive banking services to discerning clients worldwide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Private Banking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Wealth Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Business Banking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Trust Services</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Leadership</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">News</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-white">
                <li>400 Arthur Godfrey Road , Suite 506</li>
                <li>Miami Beach, FL 33140</li>
                <li>+1 (305) 476-5543 </li>
                <li>contact@gibraltarbank.com</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-white mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Gibraltar Private Bank & Trust. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white hover:text-white/65 transition">Privacy Policy</a>
              <a href="#" className="text-white hover:text-white/65 transition">Terms of Service</a>
              <a href="#" className="text-white hover:text-white/65 transition">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* After-Footer: Subtle gradient background with fine typography */}
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

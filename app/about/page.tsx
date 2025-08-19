"use client"

import { AppSidebar } from "@/components/app-sidebar"

export default function AboutUs() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <main className="flex-1 p-6 sm:p-8 md:p-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl font-bold mb-4">About ShopEase</h1>
            <p className="text-gray-600 text-lg">
              Making online shopping easier, faster, and more enjoyable for everyone.
            </p>
          </section>

          {/* Mission */}
          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              At ShopEase, our mission is to create a seamless online shopping experience where convenience meets affordability.
              We aim to bring high-quality products, exceptional customer service, and secure transactions to every doorstep.
            </p>
          </section>

          {/* Values */}
          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Customer First</h3>
                <p className="text-gray-600">Your satisfaction is our top priority—always.</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Fast & Reliable</h3>
                <p className="text-gray-600">Speedy deliveries and a smooth checkout experience every time.</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Secure Shopping</h3>
                <p className="text-gray-600">We ensure safe transactions with modern encryption technologies.</p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">10M+</p>
                <p className="text-gray-600">Products Sold</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-gray-600">Countries Served</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4.8★</p>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-gray-600">Support</p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="text-center text-gray-600">
            <p>Thank you for choosing ShopEase. We’re committed to making your shopping experience better every day.</p>
          </section>
        </div>
      </main>
    </div>
  )
}

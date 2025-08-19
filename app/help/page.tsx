"use client"

import { IconSearch, IconMail, IconPhone, IconMessage } from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to 'Order History' in your account. We'll also send you email updates with tracking information."
    },
    {
      question: "What's your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be unused with original tags. Visit our Returns page to initiate a return."
    },
    {
      question: "How can I change my account information?",
      answer: "You can update your account details in the 'Settings' section of your profile. Changes take effect immediately."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship to over 100 countries. Shipping costs and delivery times vary by destination."
    },
    {
      question: "How do I apply a discount code?",
      answer: "Add items to your cart and proceed to checkout. You'll find a field to enter your discount code before payment."
    }
  ]

  const contactMethods = [
    {
      icon: <IconMail className="w-6 h-6" />,
      title: "Email Us",
      description: "We typically respond within 24 hours",
      action: "Send Message",
      link: "mailto:support@shopease.com"
    },
    {
      icon: <IconPhone className="w-6 h-6" />,
      title: "Call Support",
      description: "Mon-Fri, 9am-5pm EST",
      action: "+1 (800) 123-4567",
      link: "tel:+18001234567"
    },
    {
      icon: <IconMessage className="w-6 h-6" />,
      title: "Live Chat",
      description: "Instant help during business hours",
      action: "Start Chat",
      link: "#chat"
    }
  ]

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      
      <main className="flex-1 p-6 md:p-8 lg:p-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-gray-600 mb-8">Find answers to common questions or contact our support team</p>
          
          {/* Search Bar */}
          <div className="relative mb-10">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search help articles..."
              className="pl-10 pr-4 py-6 text-base"
            />
          </div>
          
          {/* Popular Questions */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Popular Questions</h2>
            <div className="space-y-4">
              {faqs.slice(0, 3).map((faq, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Full FAQ Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-white p-5 rounded-lg shadow-sm">
                  <summary className="flex justify-between items-center cursor-pointer font-medium">
                    <span>{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transform transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          
          {/* Contact Options */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Still need help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="flex justify-center mb-4 text-primary">
                    {method.icon}
                  </div>
                  <h3 className="font-medium mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <Button variant="outline" asChild>
                    <a href={method.link} className="w-full">
                      {method.action}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
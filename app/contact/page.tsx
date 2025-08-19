"use client"

import { IconMail, IconPhone, IconMessage } from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea" // Assuming you have a Textarea component

export default function ContactUs() {
  const contactMethods = [
    {
      icon: <IconMail className="w-6 h-6" />,
      title: "Email",
      detail: "support@shopease.com",
      link: "mailto:support@shopease.com"
    },
    {
      icon: <IconPhone className="w-6 h-6" />,
      title: "Phone",
      detail: "+1 (800) 123-4567",
      link: "tel:+18001234567"
    },
    {
      icon: <IconMessage className="w-6 h-6" />,
      title: "Live Chat",
      detail: "Start a conversation",
      link: "#chat"
    }
  ]

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            We’re here to help! Reach out using the form below or through one of our contact methods.
          </p>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-12">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="text" placeholder="Your Name" required />
                <Input type="email" placeholder="Your Email" required />
              </div>
              <Input type="text" placeholder="Subject" />
              <Textarea placeholder="Your Message" rows={5} required />
              <Button type="submit">Send Message</Button>
            </form>
          </div>

          {/* Other Contact Methods */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Other Ways to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="flex justify-center mb-4 text-primary">{method.icon}</div>
                  <h3 className="font-medium mb-1">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.detail}</p>
                  <Button variant="outline" asChild>
                    <a href={method.link} className="w-full">{method.title === "Live Chat" ? "Start Chat" : "Contact"}</a>
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

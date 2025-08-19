'use client'
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useState } from "react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
      
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-4">
            {isLogin ? <LoginForm /> : <SignupForm />}
            <div className="text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary underline-offset-4 hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'

export default function ClientLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate login attempt
    await new Promise(resolve => setTimeout(resolve, 2000))

    // For demo purposes, accept any email/password
    if (formData.email && formData.password) {
      // Redirect to client portal (placeholder)
      window.location.href = '/client/portal'
    } else {
      setError('Please enter both email and password')
    }

    setIsLoading(false)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-mp-black flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Client Portal</CardTitle>
              <p className="text-mp-gray">
                Sign in to access your projects and deliverables
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-3 bg-mp-red/10 border border-mp-red/20 rounded-lg text-mp-red text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </motion.div>
                )}

                <div>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-mp-gray hover:text-mp-black transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-mp-gold border-mp-gray-light rounded focus:ring-mp-gold focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-mp-gray">Remember me</span>
                  </label>
                  <a
                    href="/client/forgot-password"
                    className="text-sm text-mp-gold hover:text-mp-gold-dark transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow-gold group"
                  loading={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-mp-gray">
                  Don't have an account?{' '}
                  <a
                    href="/client/register"
                    className="text-mp-gold hover:text-mp-gold-dark transition-colors duration-200"
                  >
                    Contact us to get started
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 p-4 bg-mp-gold/10 border border-mp-gold/20 rounded-lg"
          >
            <h3 className="text-sm font-medium text-mp-gold mb-2">Demo Credentials</h3>
            <p className="text-xs text-mp-gray mb-2">
              For demonstration purposes, you can use any email and password to sign in.
            </p>
            <div className="text-xs text-mp-gray">
              <div>Email: demo@example.com</div>
              <div>Password: password123</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { ShoppingCart, User, Truck, CreditCard, CheckCircle } from 'lucide-react'

interface CheckoutStepperProps {
  currentStep: number
}

const steps = [
  { id: 1, label: 'Cart', icon: ShoppingCart },
  { id: 2, label: 'Customer', icon: User },
  { id: 3, label: 'Shipping', icon: Truck },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Complete', icon: CheckCircle },
]

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isActive = step.id === currentStep
          const isDisabled = step.id > currentStep
          const Icon = step.icon
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center group">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10",
                    isCompleted && "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
                    isActive && "border-cyan-400 bg-cyan-400 text-black scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)]",
                    isDisabled && "border-blue-900/30 bg-blue-900/10 text-blue-900/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {/* Label - only show for active step */}
                {isActive && (
                  <span className="absolute top-14 whitespace-nowrap text-xs font-black uppercase tracking-wider text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] animate-in fade-in slide-in-from-top-2">
                    {step.label}
                  </span>
                )}
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-[2px] mx-4 transition-all duration-500 rounded-full",
                    isCompleted ? "bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-blue-900/20"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

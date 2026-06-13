// frontend/src/components/Stepper.jsx
import React from "react";
import { Check } from "lucide-react";

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center w-full justify-between max-w-lg mx-auto mb-8 font-sans">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;

        return (
          <React.Fragment key={idx}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  isCompleted
                    ? "bg-amazon-green border-amazon-green text-white"
                    : isActive
                    ? "bg-white border-amazon-navy text-amazon-navy ring-4 ring-blue-50"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-2 font-semibold whitespace-nowrap absolute top-10 ${
                  isActive ? "text-gray-900 font-bold" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>

            {/* Step Line */}
            {idx < steps.length - 1 && (
              <div
                className={`flex-grow h-0.5 mx-2 transition-all ${
                  idx < currentStep ? "bg-amazon-green" : "bg-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div
              className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                step.number <= currentStep
                  ? "bg-blue-900 dark:bg-blue-600 text-white"
                  : "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                step.number <= currentStep
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-2 sm:mx-4 h-0.5 w-8 sm:w-16 lg:w-24 shrink-0 ${
                step.number < currentStep
                  ? "bg-blue-900 dark:bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
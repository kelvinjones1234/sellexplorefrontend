"use client";

interface ProgressScreenProps {
  goNext: () => void;
  completedSteps: number[];
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({
  goNext,
  completedSteps,
}) => {
  const progressItems = [
    { id: 2, name: "Basic Info", completed: completedSteps.includes(2) },
    { id: 3, name: "BVN", completed: completedSteps.includes(3) },
    { id: 4, name: "NIN", completed: completedSteps.includes(4) },
    { id: 5, name: "Address", completed: completedSteps.includes(5) },
  ];

  const totalCompleted = progressItems.filter((item) => item.completed).length;
  const progressPercentage = Math.round(
    (totalCompleted / progressItems.length) * 100
  );

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Success Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#47BDA2] mb-8">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-semibold text-[var(--color-text-secondary)] mb-2">
        Setup in progress
      </h1>
      <p className="text-[var(--color-text-secondary)] text-lg mb-12">Pick up where you left</p>

      {/* Progress Container */}
      <div className="w-full max-w-md rounded-xl shadow-sm border border-[var(--color-border-default)] p-6">
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Progress</span>
          <span className="text-sm text-[var(--color-text-primary)]">
            {progressPercentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-[#47BDA2] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Progress Items */}
        <div className="space-y-4">
          {progressItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between space-x-3 px-2"
            >
              <span
                className={`font-medium ${
                  item.completed ? "text-gray-[vaar(--color-text-secondary)]" : "text-[var(--color-text-secondary)]"
                }`}
              >
                {item.name}
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.completed ? "bg-[#47BDA2]" : "bg-gray-200"
                }`}
              >
                {item.completed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={goNext}
        className="w-full max-w-md bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] py-4 px-6 rounded-xl font-medium transition-colors duration-200 mt-8 flex items-center justify-center space-x-2"
      >
        <span>Continue setup</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProgressScreen;

// "use client";

// import React from "react";

// interface PaymentHomeScreenProps {
//   getStarted: () => void;
// }

// const PaymentHomeScreen: React.FC<PaymentHomeScreenProps> = ({
//   getStarted,
// }) => {
//   return (
//     <div className="">
//       {/* PaymentHomeScreen Content */}
//       <div className="py-10 px-6 text-center max-w-[1200px] lg:mt-[4rem] mx-auto">
//         <div className="flex justify-center mb-4">
//           <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
//             <svg
//               className="w-10 h-10 text-green-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//         </div>
//         <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
//           Collect Payments
//         </h3>
//         <h4 className="text-lg font-medium text-[var(--color-text-secondary)] mb-4">With Catlog</h4>
//         <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
//           Get a free bank account, collect payment in multiple ways & create
//           professional invoices
//         </p>
//         <button
//           onClick={getStarted}
//           className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors"
//         >
//           Start collecting payments <span className="inline-block ml-1">→</span>
//         </button>

//         {/* Features Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 xs:px-2 sm:px-[10vw] md:px-[6vw] lg:px-0 gap-6 mt-10">
//           <div className="bg-[var(--card-bg-2)] p-12 lg:px-8 rounded-xl text-center">
//             <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
//               <svg
//                 className="w-6 h-6 text-yellow-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
//                 />
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
//               Flexible Payment Options
//             </h5>
//             <p className="text-sm text-[var(--color-text-secondary)]">
//               Give your customers multiple ways to pay you - with transfers,
//               cards, USD & even split payments.
//             </p>
//           </div>
//           <div className="bg-[var(--card-bg-3)] p-12 lg:px-8 rounded-xl text-center">
//             <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-2">
//               <svg
//                 className="w-6 h-6 text-red-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
//                 />
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
//               Dedicated Business Account
//             </h5>
//             <p className="text-sm text-[var(--color-text-secondary)]">
//               You get a dedicated business account number - this helps you
//               separate your business finance.
//             </p>
//           </div>
//           <div className="bg-[var(--card-bg-4)] p-12 lg:px-8 rounded-xl text-center">
//             <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-2">
//               <svg
//                 className="w-6 h-6 text-pink-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
//                 /> 
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
//               Instant Withdrawals
//             </h5>
//             <p className="text-sm text-[var(--color-text-secondary)]">
//               Withdraw funds anytime you like and get them deposited into your
//               bank accounts instantly.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentHomeScreen;





"use client";
import React from "react";

interface PaymentHomeScreenProps {
  getStarted: () => void;
}

const PaymentHomeScreen: React.FC<PaymentHomeScreenProps> = ({
  getStarted,
}) => {
  return (
    <div className="">
      {/* PaymentHomeScreen Content */}
      <div className="py-10 px-6 text-center max-w-[1200px] lg:mt-[4rem] mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Collect Payments
        </h3>
        <h4 className="text-lg font-medium text-[var(--color-text-secondary)] mb-4">With Catlog</h4>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
          Get a free bank account, collect payment in multiple ways & create
          professional invoices
        </p>
        <button
          onClick={getStarted}
          className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors"
        >
          Start collecting payments <span className="inline-block ml-1">→</span>
        </button>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xs:px-2 sm:px-[10vw] md:px-[6vw] lg:px-0 gap-6 mt-10">
          <div className="bg-[var(--card-bg-2)] p-12 lg:px-8 rounded-xl text-center">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Flexible Payment Options
            </h5>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Give your customers multiple ways to pay you - with transfers,
              cards, USD & even split payments.
            </p>
          </div>
          <div className="bg-[var(--card-bg-3)] p-12 lg:px-8 rounded-xl text-center">
            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
                />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Dedicated Business Account
            </h5>
            <p className="text-sm text-[var(--color-text-secondary)]">
              You get a dedicated business account number - this helps you
              separate your business finance.
            </p>
          </div>
          <div className="bg-[var(--card-bg-4)] p-12 lg:px-8 rounded-xl text-center">
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Instant Withdrawals
            </h5>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Withdraw funds anytime you like and get them deposited into your
              bank accounts instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHomeScreen;
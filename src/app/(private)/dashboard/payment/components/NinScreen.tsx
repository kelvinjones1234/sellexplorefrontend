// // "use client";
// // import React, { useState, useEffect } from "react";
// // import FloatingLabelInput from "@/app/component/fields/Input";

// // interface UserData {
// //   firstName?: string;
// //   lastName?: string;
// //   bvn?: string;
// //   nin?: string;
// //   state?: string;
// //   lga?: string;
// //   city?: string;
// //   street?: string;
// // }

// // interface NinScreenProps {
// //   userData: UserData;
// //   updateUserData: (data: Partial<UserData>) => void;
// //   goNext: () => void;
// //   markStepComplete: (stepId: number) => void;
// // }

// // const NinScreen: React.FC<NinScreenProps> = ({
// //   userData,
// //   updateUserData,
// //   goNext,
// //   markStepComplete,
// // }) => {
// //   const [nin, setNin] = useState(userData.nin || "");
// //   const [error, setError] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     setNin(userData.nin || "");
// //   }, [userData]);

// //   const handleNext = async () => {
// //     if (!nin) {
// //       setError("Please enter your NIN");
// //       return;
// //     }

// //     if (nin.length !== 11) {
// //       setError("NIN must be 11 digits");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       // Simulate API call
// //       await new Promise((resolve) => setTimeout(resolve, 1000));

// //       updateUserData({ nin });
// //       markStepComplete(4); // Mark NIN step as complete
// //       goNext();
// //     } catch (err) {
// //       setError("An error occurred. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const value = e.target.value.replace(/\D/g, ""); // Only allow digits
// //     if (value.length <= 11) {
// //       setNin(value);
// //       setError(null);
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center p-6">
// //       <div className="py-6 text-center max-w-md w-full">
// //         {/* Icon and Title */}
// //         <div className="flex justify-center mb-4">
// //           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
// //             <svg
// //               className="w-10 h-10 text-green-600"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth="2"
// //                 d="M5 13l4 4L19 7"
// //               />
// //             </svg>
// //           </div>
// //         </div>
// //         <h3 className="text-xl font-semibold mb-2">Setup Payments</h3>
// //         <p className="mb-6 text-sm">Verify your NIN</p>

// //         {/* Input Fields */}
// //         <div className="space-y-6">
// //           <FloatingLabelInput
// //             type="text"
// //             name="nin"
// //             value={nin}
// //             onChange={handleNinChange}
// //             placeholder="National Identity Number (NIN)"
// //             error={error || ""}
// //           />
// //           <p className="text-xs text-gray-500 text-left">
// //             Your NIN is used to verify your identity and is required for account
// //             setup.
// //           </p>
// //         </div>

// //         {/* Next Button */}
// //         <button
// //           onClick={handleNext}
// //           disabled={loading || !nin || nin.length !== 11}
// //           className="w-full mt-8 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
// //         >
// //           {loading ? "Verifying..." : "Next"}
// //         </button>
// //         {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default NinScreen;






// "use client";
// import React, { useState, useEffect } from "react";
// import FloatingLabelInput from "@/app/component/fields/Input";
// import { apiClient } from "../api";


// interface UserData {
//   firstName?: string;
//   lastName?: string;
//   bvn?: string;
//   nin?: string;
//   state?: string;
//   lga?: string;
//   city?: string;
//   street?: string;
// }

// interface NinScreenProps {
//   userData: UserData;
//   updateUserData: (data: Partial<UserData>) => void;
//   goNext: () => void;
//   markStepComplete: (stepId: number) => void;
//   accessToken: string | null; // Add accessToken prop
// }

// const NinScreen: React.FC<NinScreenProps> = ({
//   userData,
//   updateUserData,
//   goNext,
//   markStepComplete,
//   accessToken,
// }) => {
//   const [nin, setNin] = useState(userData.nin || "");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setNin(userData.nin || "");
//   }, [userData]);

//   const handleNext = async () => {
//     if (!accessToken) {
//       setError("Authentication required. Please log in.");
//       return;
//     }

//     if (!nin) {
//       setError("Please enter your NIN");
//       return;
//     }

//     if (nin.length !== 11) {
//       setError("NIN must be 11 digits");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await apiClient.submitNin({ nin });
//       if (!res.verified) {
//         setError(
//           `Verification Failed. The name provided did not match the name on record. Please confirm the name linked to your NIN and try again. Confidence: ${res.confidence}`
//         );
//         return;
//       }
//       updateUserData({ nin });
//       markStepComplete(4); // Mark NIN step as complete
//       goNext();
//     } catch (err: any) {
//       if (err.status === 401) {
//         setError("Authentication required. Please log in.");
//       } else {
//         setError(err.message || "An error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, ""); // Only allow digits
//     if (value.length <= 11) {
//       setNin(value);
//       setError(null);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center p-6">
//       <div className="py-6 text-center max-w-md w-full">
//         {/* Icon and Title */}
//         <div className="flex justify-center mb-4">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
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
//         <h3 className="text-xl font-semibold mb-2">Setup Payments</h3>
//         <p className="mb-6 text-sm">Verify your NIN</p>

//         {/* Input Fields */}
//         <div className="space-y-6">
//           <FloatingLabelInput
//             type="text"
//             name="nin"
//             value={nin}
//             onChange={handleNinChange}
//             placeholder="National Identity Number (NIN)"
//             error={error || ""}
//           />
//           <p className="text-xs text-gray-500 text-left">
//             Your NIN is used to verify your identity and is required for account
//             setup.
//           </p>
//         </div>

//         {/* Next Button */}
//         <button
//           onClick={handleNext}
//           disabled={loading || !nin || nin.length !== 11}
//           className="w-full mt-8 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
//         >
//           {loading ? "Verifying..." : "Next"}
//         </button>
//         {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default NinScreen;





"use client";
import React, { useState, useEffect } from "react";
import FloatingLabelInput from "@/app/component/fields/Input";
import { apiClient } from "../api";
import { useAuth } from "@/context/AuthContext";

interface UserData {
  firstName?: string;
  lastName?: string;
  bvn?: string;
  nin?: string;
  state?: string;
  lga?: string;
  city?: string;
  street?: string;
}

interface NinScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  goNext: () => void;
  markStepComplete: (stepId: number) => void;
}

const NinScreen: React.FC<NinScreenProps> = ({
  userData,
  updateUserData,
  goNext,
  markStepComplete,
}) => {
  const { isAuthenticated } = useAuth();
  const [nin, setNin] = useState(userData.nin || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNin(userData.nin || "");
  }, [userData]);

  const handleNext = async () => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (!nin) {
      setError("Please enter your NIN");
      return;
    }

    if (nin.length !== 11) {
      setError("NIN must be 11 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.submitNin({ nin });
      if (!res.verified) {
        setError(
          `Verification Failed. The name provided did not match the name on record. Please confirm the name linked to your NIN and try again. Confidence: ${res.confidence}`
        );
        return;
      }
      updateUserData({ nin });
      markStepComplete(4); // Mark NIN step as complete
      goNext();
    } catch (err: any) {
      if (err.status === 401) {
        setError("Authentication required. Please log in.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 11) {
      setNin(value);
      setError(null);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="py-6 text-center max-w-md w-full">
        {/* Icon and Title */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
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
        <h3 className="text-xl font-semibold mb-2">Setup Payments</h3>
        <p className="mb-6 text-sm">Verify your NIN</p>

        {/* Input Fields */}
        <div className="space-y-6">
          <FloatingLabelInput
            type="text"
            name="nin"
            value={nin}
            onChange={handleNinChange}
            placeholder="National Identity Number (NIN)"
            error={error || ""}
          />
          <p className="text-xs text-gray-500 text-left">
            Your NIN is used to verify your identity and is required for account
            setup.
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={loading || !nin || nin.length !== 11}
          className="w-full mt-8 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Next"}
        </button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default NinScreen;
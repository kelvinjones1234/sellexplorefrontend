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

// interface BvnScreenProps {
//   userData: UserData;
//   updateUserData: (data: Partial<UserData>) => void;
//   goNext: () => void;
//   markStepComplete: (stepId: number) => void;
//   accessToken: string | null; // Add accessToken prop
// }

// const BvnScreen: React.FC<BvnScreenProps> = ({
//   userData,
//   updateUserData,
//   goNext,
//   markStepComplete,
//   accessToken,
// }) => {
//   const [bvn, setBvn] = useState(userData.bvn || "");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setBvn(userData.bvn || "");
//   }, [userData]);

//   const handleNext = async () => {
//     if (!accessToken) {
//       setError("Authentication required. Please log in.");
//       return;
//     }

//     if (!bvn) {
//       setError("Please enter your BVN");
//       return;
//     }

//     if (bvn.length !== 11) {
//       setError("BVN must be 11 digits");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await apiClient.submitBvn({ bvn });
//       if (!res.verified) {
//         setError(
//           `Verification Failed. The name provided did not match the name on record. Please confirm the name linked to your BVN and try again. Confidence: ${res.confidence}`
//         );
//         return;
//       }
//       updateUserData({ bvn });
//       markStepComplete(3); // Mark BVN step as complete
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

//   const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, ""); // Only allow digits
//     if (value.length <= 11) {
//       setBvn(value);
//       setError(null);
//     }
//   };

//   return (
//     <div className="bg-white flex items-center justify-center p-6">
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
//         <h3 className="text-xl font-semibold text-gray-900 mb-2">
//           Setup Payments
//         </h3>
//         <p className="text-gray-600 mb-6 text-sm">Verify your BVN</p>

//         {/* Input Fields */}
//         <div className="space-y-6">
//           <FloatingLabelInput
//             type="text"
//             name="bvn"
//             value={bvn}
//             onChange={handleBvnChange}
//             placeholder="Bank Verification Number (BVN)"
//             error={error || ""}
//           />
//           <p className="text-xs text-gray-500 text-left">
//             Your BVN is used to verify your identity and is required for account
//             setup.
//           </p>
//         </div>

//         {/* Next Button */}
//         <button
//           onClick={handleNext}
//           disabled={loading || !bvn || bvn.length !== 11}
//           className="w-full mt-8 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
//         >
//           {loading ? "Verifying..." : "Next"}
//         </button>
//         {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default BvnScreen;




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

interface BvnScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  goNext: () => void;
  markStepComplete: (stepId: number) => void;
}

const BvnScreen: React.FC<BvnScreenProps> = ({
  userData,
  updateUserData,
  goNext,
  markStepComplete,
}) => {
  const { isAuthenticated } = useAuth();
  const [bvn, setBvn] = useState(userData.bvn || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBvn(userData.bvn || "");
  }, [userData]);

  const handleNext = async () => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (!bvn) {
      setError("Please enter your BVN");
      return;
    }

    if (bvn.length !== 11) {
      setError("BVN must be 11 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.submitBvn({ bvn });
      if (!res.verified) {
        setError(
          `Verification Failed. The name provided did not match the name on record. Please confirm the name linked to your BVN and try again. Confidence: ${res.confidence}`
        );
        return;
      }
      updateUserData({ bvn });
      markStepComplete(3); // Mark BVN step as complete
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

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 11) {
      setBvn(value);
      setError(null);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center p-6">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Setup Payments
        </h3>
        <p className="text-gray-600 mb-6 text-sm">Verify your BVN</p>

        {/* Input Fields */}
        <div className="space-y-6">
          <FloatingLabelInput
            type="text"
            name="bvn"
            value={bvn}
            onChange={handleBvnChange}
            placeholder="Bank Verification Number (BVN)"
            error={error || ""}
          />
          <p className="text-xs text-gray-500 text-left">
            Your BVN is used to verify your identity and is required for account
            setup.
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={loading || !bvn || bvn.length !== 11}
          className="w-full mt-8 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Next"}
        </button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default BvnScreen;
// "use client";
// import { useState, useEffect } from "react";
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

// interface NameScreenProps {
//   userData: UserData;
//   updateUserData: (data: Partial<UserData>) => void;
//   goNext: () => void;
//   markStepComplete: (stepId: number) => void;
//   accessToken: string | null; // Add accessToken prop
// }

// const NameScreen: React.FC<NameScreenProps> = ({
//   userData,
//   updateUserData,
//   goNext,
//   markStepComplete,
//   accessToken,
// }) => {
//   const [firstName, setFirstName] = useState(userData.firstName || "");
//   const [lastName, setLastName] = useState(userData.lastName || "");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setFirstName(userData.firstName || "");
//     setLastName(userData.lastName || "");
//   }, [userData]);

//   const handleNext = async () => {
//     if (!accessToken) {
//       setError("Authentication required. Please log in.");
//       return;
//     }

//     if (!firstName || !lastName) {
//       setError("Please enter both first name and last name.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await apiClient.submitName({
//         first_name: firstName,
//         last_name: lastName,
//       });
//       updateUserData({
//         firstName,
//         lastName,
//       });

//       markStepComplete(2); // Mark name step as complete
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

//   return (
//     <div className="">
//       <div className="w-full flex justify-center">
//         <div className="p-6 text-center max-w-md w-full flex flex-col justify-center items-center">
//           {/* Icon and Title */}
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-10 h-10 text-green-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//           </div>
//           <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
//             Setup Payments
//           </h3>
//           <h4 className="text-lg font-medium text-[var(--color-text-secondary)] mb-4">
//             What is your Legal Name?
//           </h4>
//           <p className="text-[var(--color-text-primary)] mb-6 text-sm">
//             Your name on Government IDs
//           </p>

//           {/* Important Note */}
//           <div className="bg-yellow-50 p-4 rounded-lg text-left mb-6">
//             <div className="flex items-start gap-2">
//               <span className="text-yellow-600">⚠</span>
//               <div>
//                 <p className="text-sm font-medium text-gray-900 ml-2">Important!</p>
//                 <ul className="text-sm text-gray-600 list-disc list-inside ml-2">
//                   <li>Please enter your real name, not your business name.</li>
//                   <li>
//                     Ensure that your store name is correct, as it'll be used to
//                     create your account
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Input Fields */}
//           <div className="space-y-6 w-full">
//             <FloatingLabelInput
//               type="text"
//               name="firstName"
//               value={firstName}
//               onChange={(e) => {
//                 setFirstName(e.target.value);
//                 setError(null);
//               }}
//               placeholder="Enter First Name"
//               error={error && !firstName ? error : ""}
//             />
//             <FloatingLabelInput
//               type="text"
//               name="lastName"
//               value={lastName}
//               onChange={(e) => {
//                 setLastName(e.target.value);
//                 setError(null);
//               }}
//               placeholder="Enter Last Name (Surname)"
//               error={error && !lastName ? error : ""}
//             />
//           </div>

//           {/* Next Button */}
//           <button
//             onClick={handleNext}
//             disabled={loading || !firstName || !lastName}
//             className="w-full mt-8 px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50"
//           >
//             {loading ? "Submitting..." : "Next"}
//           </button>
//           {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NameScreen; 





"use client";
import { useState, useEffect } from "react";
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

interface NameScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  goNext: () => void;
  markStepComplete: (stepId: number) => void;
}

const NameScreen: React.FC<NameScreenProps> = ({
  userData,
  updateUserData,
  goNext,
  markStepComplete,
}) => {
  const { isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");
  }, [userData]);

  const handleNext = async () => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (!firstName || !lastName) {
      setError("Please enter both first name and last name.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.submitName({
        first_name: firstName,
        last_name: lastName,
      });
      updateUserData({
        firstName,
        lastName,
      });

      markStepComplete(2); // Mark name step as complete
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

  return (
    <div className="">
      <div className="w-full flex justify-center">
        <div className="p-6 text-center max-w-md w-full flex flex-col justify-center items-center">
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
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Setup Payments
          </h3>
          <h4 className="text-lg font-medium text-[var(--color-text-secondary)] mb-4">
            What is your Legal Name?
          </h4>
          <p className="text-[var(--color-text-primary)] mb-6 text-sm">
            Your name on Government IDs
          </p>

          {/* Important Note */}
          <div className="bg-yellow-50 p-4 rounded-lg text-left mb-6">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <div>
                <p className="text-sm font-medium text-gray-900 ml-2">Important!</p>
                <ul className="text-sm text-gray-600 list-disc list-inside ml-2">
                  <li>Please enter your real name, not your business name.</li>
                  <li>
                    Ensure that your store name is correct, as it'll be used to
                    create your account
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-6 w-full">
            <FloatingLabelInput
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError(null);
              }}
              placeholder="Enter First Name"
              error={error && !firstName ? error : ""}
            />
            <FloatingLabelInput
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setError(null);
              }}
              placeholder="Enter Last Name (Surname)"
              error={error && !lastName ? error : ""}
            />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={loading || !firstName || !lastName}
            className="w-full mt-8 px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl font-medium hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Next"}
          </button>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default NameScreen;
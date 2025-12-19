// "use client";
// import React, { useState, useEffect } from "react";
// import PaymentHomeScreen from "./PaymentHomeScreen";
// import NameScreen from "./NameScreen";
// import NinScreen from "./NinScreen";
// import BvnScreen from "./BvnScreen";
// import AddressScreen from "./AddressScreen";
// import InformationSummary from "./InformationSummary";
// import ProgressScreen from "./ProgressScreen";
// import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { apiClient } from "../api";
// import { useRouter } from "next/navigation";

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

// interface StepConfig {
//   id: number;
//   name: string;
//   hasInputs: boolean;
// }

// const stepConfigs: StepConfig[] = [
//   { id: 0, name: "welcome", hasInputs: false },
//   { id: 1, name: "progress", hasInputs: false },
//   { id: 2, name: "name", hasInputs: true },
//   { id: 3, name: "bvn", hasInputs: true },
//   { id: 4, name: "nin", hasInputs: true },
//   { id: 5, name: "address", hasInputs: true },
//   { id: 6, name: "summary", hasInputs: false },
// ];

// const Main = () => {
//   const [currentStep, setCurrentStep] = useState(0); // Always start at PaymentHomeScreen
//   const [userData, setUserData] = useState<UserData>({});
//   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
//   const { accessToken } = useAuth();
//   const router = useRouter();

//   // Set accessToken in apiClient when it changes
//   useEffect(() => {
//     if (accessToken) {
//       apiClient.setAccessToken(accessToken);
//     } else {
//       apiClient.setAccessToken(null);
//     }
//   }, [accessToken]);

//   // Fetch summary on mount to load existing data
//   useEffect(() => {
//     const loadData = async () => {
//       if (!accessToken) {
//         console.warn("No access token, skipping data fetch");
//         return;
//       }
//       try {
//         const summary = await apiClient.getSummary();
//         setUserData({
//           firstName: summary.first_name,
//           lastName: summary.last_name,
//           bvn: summary.bvn,
//           nin: summary.nin,
//           state: summary.state,
//           lga: summary.lga,
//           city: summary.city,
//           street: summary.street,
//         });

//         const completed: number[] = [];
//         if (summary.first_name && summary.last_name) completed.push(2);
//         if (summary.bvn_verified) completed.push(3);
//         if (summary.nin_verified) completed.push(4);
//         if (summary.state) completed.push(5);
//         setCompletedSteps(completed);

//         // Check if all input steps are completed (100% progress)
//         const inputStepIds = stepConfigs
//           .filter((step) => step.hasInputs)
//           .map((step) => step.id);
//         const isComplete = inputStepIds.every((id) => completed.includes(id));
//         if (isComplete) {
//           router.push("/dashboard/payment/wallet");
//           return;
//         }

//         // Jump to progress screen if any progress was made
//         if (completed.length > 0) {
//           setCurrentStep(1);
//         }
//       } catch (err: any) {
//         console.error("Failed to load summary:", err);
//         if (err.status === 401) {
//           alert("Authentication required. Please log in.");
//         }
//       }
//     };
//     loadData();
//   }, [accessToken, router]);

//   const goNext = () => {
//     if (currentStep < stepConfigs.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const getStarted = () => {
//     setCurrentStep(2);
//   };

//   const goPrev = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const updateUserData = (newData: Partial<UserData>) => {
//     setUserData((prev) => ({ ...prev, ...newData }));
//   };

//   const markStepComplete = (stepId: number) => {
//     setCompletedSteps((prev) => {
//       if (!prev.includes(stepId)) {
//         return [...prev, stepId];
//       }
//       return prev;
//     });
//   };

//   // Helper: check if current step has required data
//   const isStepReady = (stepId: number): boolean => {
//     switch (stepId) {
//       case 2: // Name step
//         return !!(userData.firstName && userData.lastName);
//       case 3: // BVN step
//         return !!userData.bvn;
//       case 4: // NIN step
//         return !!userData.nin;
//       case 5: // Address step
//         return !!(userData.state && userData.city && userData.street);
//       default:
//         return true; // Non-input steps are always considered ready
//     }
//   };

//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 0:
//         return <PaymentHomeScreen getStarted={getStarted} />;
//       case 1:
//         return (
//           <ProgressScreen goNext={goNext} completedSteps={completedSteps} />
//         );
//       case 2:
//         return (
//           <NameScreen
//             userData={userData}
//             updateUserData={updateUserData}
//             goNext={goNext}
//             markStepComplete={markStepComplete}
//             accessToken={accessToken}
//           />
//         );
//       case 3:
//         return (
//           <BvnScreen
//             userData={userData}
//             updateUserData={updateUserData}
//             goNext={goNext}
//             markStepComplete={markStepComplete}
//             accessToken={accessToken}
//           />
//         );
//       case 4:
//         return (
//           <NinScreen
//             userData={userData}
//             updateUserData={updateUserData}
//             goNext={goNext}
//             markStepComplete={markStepComplete}
//             accessToken={accessToken}
//           />
//         );
//       case 5:
//         return (
//           <AddressScreen
//             userData={userData}
//             updateUserData={updateUserData}
//             goNext={goNext}
//             markStepComplete={markStepComplete}
//             accessToken={accessToken}
//           />
//         );
//       case 6:
//         return (
//           <InformationSummary userData={userData} accessToken={accessToken} />
//         );
//       default:
//         return <PaymentHomeScreen getStarted={getStarted} />;
//     }
//   };

//   const currentStepConfig = stepConfigs[currentStep];
//   const inputSteps = stepConfigs.filter((step) => step.hasInputs);
//   const currentInputStepIndex = inputSteps.findIndex(
//     (step) => step.id === currentStep
//   );
//   const progress =
//     currentInputStepIndex >= 0
//       ? ((currentInputStepIndex + 1) / inputSteps.length) * 100
//       : 0;

//   return (
//     <div className="flex flex-col min-h-[calc(100vh-75px)]">
//       <header className="bg-[var(--color-bg)] py-3 px-4 sticky top-0 z-40">
//         <div className="flex items-center justify-between">
//           <h1 className="font-semibold">Get Verified</h1>
//           <div className="flex items-center gap-2">
//             <span className="text-yellow-500">⚡</span>
//             <span className="text-sm font-medium text-[var(--color-text-secondary)]">
//               Enable Payments
//             </span>
//             <ChevronDown className="w-4 h-4 text-gray-500" />
//           </div>
//         </div>
//       </header>
//       <main className="flex-1">{renderCurrentStep()}</main>
//       {currentStepConfig.hasInputs && (
//         <footer className="border-t px-4 py-3 mt-auto flex justify-between">
//           <div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-[var(--color-text-secondary)]">
//                 {currentInputStepIndex + 1} of {inputSteps.length} complete
//               </span>
//             </div>
//             <div className="w-full h-2 mt-2 bg-gray-200 rounded">
//               <div
//                 className="h-2 bg-green-500 rounded transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={goPrev}
//               disabled={currentStep === 0}
//               className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <button
//               onClick={goNext}
//               disabled={
//                 currentStep === stepConfigs.length - 1 ||
//                 !isStepReady(currentStep)
//               }
//               className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </footer>
//       )}
//     </div>
//   );
// };

// export default Main;





"use client";
import React, { useState, useEffect } from "react";
import PaymentHomeScreen from "./PaymentHomeScreen";
import NameScreen from "./NameScreen";
import NinScreen from "./NinScreen";
import BvnScreen from "./BvnScreen";
import AddressScreen from "./AddressScreen";
import InformationSummary from "./InformationSummary";
import ProgressScreen from "./ProgressScreen";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "../api";
import { useRouter } from "next/navigation";

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

interface StepConfig {
  id: number;
  name: string;
  hasInputs: boolean;
}

const stepConfigs: StepConfig[] = [
  { id: 0, name: "welcome", hasInputs: false },
  { id: 1, name: "progress", hasInputs: false },
  { id: 2, name: "name", hasInputs: true },
  { id: 3, name: "bvn", hasInputs: true },
  { id: 4, name: "nin", hasInputs: true },
  { id: 5, name: "address", hasInputs: true },
  { id: 6, name: "summary", hasInputs: false },
];

const Main = () => {
  const [currentStep, setCurrentStep] = useState(0); // Always start at PaymentHomeScreen
  const [userData, setUserData] = useState<UserData>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch summary on mount to load existing data
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        console.warn("No access token, skipping data fetch");
        return;
      }
      try {
        const summary = await apiClient.getSummary();
        setUserData({
          firstName: summary.first_name,
          lastName: summary.last_name,
          bvn: summary.bvn,
          nin: summary.nin,
          state: summary.state,
          lga: summary.lga,
          city: summary.city,
          street: summary.street,
        });

        const completed: number[] = [];
        if (summary.first_name && summary.last_name) completed.push(2);
        if (summary.bvn_verified) completed.push(3);
        if (summary.nin_verified) completed.push(4);
        if (summary.state) completed.push(5);
        setCompletedSteps(completed);

        // Check if all input steps are completed (100% progress)
        const inputStepIds = stepConfigs
          .filter((step) => step.hasInputs)
          .map((step) => step.id);
        const isComplete = inputStepIds.every((id) => completed.includes(id));
        if (isComplete) {
          router.push("/dashboard/payment/wallet");
          return;
        }

        // Jump to progress screen if any progress was made
        if (completed.length > 0) {
          setCurrentStep(1);
        }
      } catch (err: any) {
        console.error("Failed to load summary:", err);
        if (err.status === 401) {
          alert("Authentication required. Please log in.");
        }
      }
    };
    loadData();
  }, [router, isAuthenticated]); // Added isAuthenticated to dependencies

  const goNext = () => {
    if (currentStep < stepConfigs.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const getStarted = () => {
    setCurrentStep(2);
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  const markStepComplete = (stepId: number) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  };

  // Helper: check if current step has required data
  const isStepReady = (stepId: number): boolean => {
    switch (stepId) {
      case 2: // Name step
        return !!(userData.firstName && userData.lastName);
      case 3: // BVN step
        return !!userData.bvn;
      case 4: // NIN step
        return !!userData.nin;
      case 5: // Address step
        return !!(userData.state && userData.city && userData.street);
      default:
        return true; // Non-input steps are always considered ready
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <PaymentHomeScreen getStarted={getStarted} />;
      case 1:
        return (
          <ProgressScreen goNext={goNext} completedSteps={completedSteps} />
        );
      case 2:
        return (
          <NameScreen
            userData={userData}
            updateUserData={updateUserData}
            goNext={goNext}
            markStepComplete={markStepComplete}
          />
        );
      case 3:
        return (
          <BvnScreen
            userData={userData}
            updateUserData={updateUserData}
            goNext={goNext}
            markStepComplete={markStepComplete}
          />
        );
      case 4:
        return (
          <NinScreen
            userData={userData}
            updateUserData={updateUserData}
            goNext={goNext}
            markStepComplete={markStepComplete}
          />
        );
      case 5:
        return (
          <AddressScreen
            userData={userData}
            updateUserData={updateUserData}
            goNext={goNext}
            markStepComplete={markStepComplete}
          />
        );
      case 6:
        return <InformationSummary userData={userData} />;
      default:
        return <PaymentHomeScreen getStarted={getStarted} />;
    }
  };

  const currentStepConfig = stepConfigs[currentStep];
  const inputSteps = stepConfigs.filter((step) => step.hasInputs);
  const currentInputStepIndex = inputSteps.findIndex(
    (step) => step.id === currentStep
  );
  const progress =
    currentInputStepIndex >= 0
      ? ((currentInputStepIndex + 1) / inputSteps.length) * 100
      : 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-75px)]">
      <header className="bg-[var(--color-bg)] py-3 px-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Get Verified</h1>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⚡</span>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Enable Payments
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </header>
      <main className="flex-1">{renderCurrentStep()}</main>
      {currentStepConfig.hasInputs && (
        <footer className="border-t px-4 py-3 mt-auto flex justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {currentInputStepIndex + 1} of {inputSteps.length} complete
              </span>
            </div>
            <div className="w-full h-2 mt-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-500 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              disabled={
                currentStep === stepConfigs.length - 1 ||
                !isStepReady(currentStep)
              }
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Main;
// "use client";
// import { useState } from "react";
// import { apiClient } from "../api";
// import { useRouter } from "next/navigation"; // ✅ use next/navigation

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

// interface InformationSummaryProps {
//   userData: UserData;
//   accessToken: string | null; // Add accessToken prop
// }

// const InformationSummary: React.FC<InformationSummaryProps> = ({
//   userData,
//   accessToken,
// }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async () => {
//     if (!accessToken) {
//       alert("Authentication required. Please log in.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await apiClient.submitFinal();
//       console.log("Final submission:", res);

//       // Show success message
//       alert("Account setup completed successfully!");

//       // ✅ Redirect to wallet after alert closes
//       router.push("/dashboard/payment/wallet");
//     } catch (error: any) {
//       console.error("Submission error:", error);
//       if (error.status === 401) {
//         alert("Authentication required. Please log in.");
//       } else {
//         alert(
//           error.message ||
//             "An error occurred during submission. Please try again."
//         );
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = () => {
//     console.log("Edit requested");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center py-8 px-4">
//       {/* Success Icon */}
//       <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 mb-6">
//         <span className="text-green-600 text-3xl">✔</span>
//       </div>

//       {/* Heading */}
//       <h2 className="text-2xl font-semibold text-center">
//         Information Summary
//       </h2>
//       <p className="text-center mb-6 w-[300px]">
//         Here's a summary of the information you provided
//       </p>

//       {/* Form */}
//       <div className="w-full max-w-md space-y-6">
//         {/* Basic Information */}
//         <div className="p-4 border-t">
//           <h3 className="text-lg font-medium mb-2 flex items-center">
//             <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
//             Basic Information
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <p>
//               <strong>First Name</strong>
//               <br /> {userData.firstName || "Not provided"}
//             </p>
//             <p>
//               <strong>Last Name</strong>
//               <br /> {userData.lastName || "Not provided"}
//             </p>
//           </div>
//         </div>

//         {/* BVN Information */}
//         <div className="p-4 border-t">
//           <h3 className="text-lg font-medium mb-2 flex items-center">
//             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//             BVN Information
//           </h3>
//           <div className="grid grid-cols-1 gap-4">
//             <p>
//               <strong>BVN</strong> <br />
//               {userData.bvn
//                 ? `***-***-${userData.bvn.slice(-4)}`
//                 : "Not provided"}
//             </p>
//           </div>
//         </div>

//         {/* NIN Information */}
//         <div className="p-4 border-t">
//           <h3 className="text-lg font-medium mb-2 flex items-center">
//             <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
//             NIN Information
//           </h3>
//           <div className="grid grid-cols-1 gap-4">
//             <p>
//               <strong>NIN</strong>
//               <br />
//               {userData.nin
//                 ? `***-***-${userData.nin.slice(-4)}`
//                 : "Not provided"}
//             </p>
//           </div>
//         </div>

//         {/* Address Information */}
//         <div className="p-4 border-t">
//           <h3 className="text-lg font-medium mb-2 flex items-center">
//             <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
//             Address Information
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <p>
//               <strong>City</strong>
//               <br /> {userData.city || "Not provided"}
//             </p>
//             <p>
//               <strong>State</strong>
//               <br /> {userData.state || "Not provided"}
//             </p>
//             <p>
//               <strong>LGA</strong>
//               <br /> {userData.lga || "Not provided"}
//             </p>
//             <p className="col-span-2">
//               <strong>Street Address</strong>
//               <br /> {userData.street || "Not provided"}
//             </p>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between mt-6 gap-4">
//           <button
//             onClick={handleEdit}
//             className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
//           >
//             Edit
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className="flex-1 bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InformationSummary;






"use client";
import { useState } from "react";
import { apiClient } from "../api";
import { useRouter } from "next/navigation";
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

interface InformationSummaryProps {
  userData: UserData;
}

const InformationSummary: React.FC<InformationSummaryProps> = ({ userData }) => {
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Authentication required. Please log in.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.submitFinal();
      console.log("Final submission:", res);

      // Show success message
      alert("Account setup completed successfully!");

      // Redirect to wallet after alert closes
      router.push("/dashboard/payment/wallet");
    } catch (error: any) {
      console.error("Submission error:", error);
      if (error.status === 401) {
        alert("Authentication required. Please log in.");
      } else {
        alert(
          error.message ||
            "An error occurred during submission. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    console.log("Edit requested");
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Success Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 mb-6">
        <span className="text-green-600 text-3xl">✔</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-center">
        Information Summary
      </h2>
      <p className="text-center mb-6 w-[300px]">
        Here's a summary of the information you provided
      </p>

      {/* Form */}
      <div className="w-full max-w-md space-y-6">
        {/* Basic Information */}
        <div className="p-4 border-t">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>First Name</strong>
              <br /> {userData.firstName || "Not provided"}
            </p>
            <p>
              <strong>Last Name</strong>
              <br /> {userData.lastName || "Not provided"}
            </p>
          </div>
        </div>

        {/* BVN Information */}
        <div className="p-4 border-t">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            BVN Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <p>
              <strong>BVN</strong> <br />
              {userData.bvn
                ? `***-***-${userData.bvn.slice(-4)}`
                : "Not provided"}
            </p>
          </div>
        </div>

        {/* NIN Information */}
        <div className="p-4 border-t">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            NIN Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <p>
              <strong>NIN</strong>
              <br />
              {userData.nin
                ? `***-***-${userData.nin.slice(-4)}`
                : "Not provided"}
            </p>
          </div>
        </div>

        {/* Address Information */}
        <div className="p-4 border-t">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Address Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>City</strong>
              <br /> {userData.city || "Not provided"}
            </p>
            <p>
              <strong>State</strong>
              <br /> {userData.state || "Not provided"}
            </p>
            <p>
              <strong>LGA</strong>
              <br /> {userData.lga || "Not provided"}
            </p>
            <p className="col-span-2">
              <strong>Street Address</strong>
              <br /> {userData.street || "Not provided"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={handleEdit}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformationSummary;


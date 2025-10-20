"use client";
import { useState, useEffect } from "react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { apiClient } from "../api";

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

interface AddressScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  goNext: () => void;
  markStepComplete: (stepId: number) => void;
  accessToken: string | null; // Add accessToken prop
}

const AddressScreen: React.FC<AddressScreenProps> = ({
  userData,
  updateUserData,
  goNext,
  markStepComplete,
  accessToken,
}) => {
  const [state, setState] = useState<string>(userData.state || "FCT");
  const [lga, setLga] = useState<string>(userData.lga || "Bwari");
  const [city, setCity] = useState<string>(userData.city || "Abuja");
  const [street, setStreet] = useState<string>(
    userData.street || "BEHIND ANGLICAN CHURCH AJEGUNLE ROAD MPAPE"
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setState(userData.state || "FCT");
    setLga(userData.lga || "Bwari");
    setCity(userData.city || "Abuja");
    setStreet(userData.street || "");
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (!state || !lga || !city || !street) {
      setError("Please fill in all address fields.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.submitAddress({
        state,
        lga,
        city,
        street,
      });
      updateUserData({
        state,
        lga,
        city,
        street,
      });

      markStepComplete(5); // Mark address step as complete
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
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Success Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 mb-6">
        <span className="text-green-600 text-3xl">✔</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-center">Final Step</h2>
      <p className="text-gray-600 text-center mb-2">What's Your Address?</p>
      <span className="text-sm text-gray-500 mb-6">
        Your residential address
      </span>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* State */}
        <FloatingLabelSelect
          name="state"
          value={state}
          onChange={(val) => {
            setState(val as string);
            setError(null);
          }}
          placeholder="Select State"
          options={[
            { value: "FCT", label: "FCT" },
            { value: "Lagos", label: "Lagos" },
            { value: "Kano", label: "Kano" },
            { value: "Rivers", label: "Rivers" },
            { value: "Ogun", label: "Ogun" },
          ]}
        />

        {/* LGA + City */}
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelSelect
            name="lga"
            value={lga}
            onChange={(val) => {
              setLga(val as string);
              setError(null);
            }}
            placeholder="Select LGA"
            options={[
              { value: "Bwari", label: "Bwari" },
              { value: "AMAC", label: "AMAC" },
              { value: "Kuje", label: "Kuje" },
              { value: "Gwagwalada", label: "Gwagwalada" },
              { value: "Abaji", label: "Abaji" },
            ]}
          />
          <FloatingLabelInput
            name="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError(null);
            }}
            placeholder="Your City"
          />
        </div>

        {/* Street Address */}
        <FloatingLabelInput
          name="street"
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
            setError(null);
          }}
          placeholder="Your street address"
        />

        {/* Continue Button */}
        <button
          type="submit"
          disabled={loading || !state || !lga || !city || !street}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Continue"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddressScreen;
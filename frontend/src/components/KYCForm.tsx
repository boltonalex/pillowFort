import { useState, useCallback } from "react";
import { useAuth } from "../context/useAuth";

export default function KYCForm() {
  const { setIsKYCOpen, updateKYC, userData } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: userData?.email || "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    postcode: "",
    newsletter: false,
  });

  const [idFile, setIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIdFile(e.target.files[0]);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.postcode) {
      setError("Please complete all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    const formattedDOB = `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`;

    try {
      await updateKYC({
        ...formData,
        dob: formattedDOB,
        idFile,
      });
      setIsKYCOpen(false);
    } catch (err) {
      console.error("KYC Submission Failed:", err);
      setError("Failed to submit KYC. Please try again.");
    }
    setLoading(false);
  };

  const renderOptions = (count: number, offset = 1) =>
    [...Array(count)].map((_, i) => (
      <option key={i} value={i + offset}>
        {i + offset}
      </option>
    ));

  return (
    <div className="p-8" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-3xl font-semibold text-gray-900 mb-2 text-center">Identity Verification</h2>
      <p className="text-gray-600 text-center mb-6 font-normal text-sm">
        As a <span className="font-bold">Financial Conduct Authority (FCA) regulated</span> service, we are required to verify your identity. This helps protect your account, prevent fraud, and comply with financial regulations.
      </p>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">What email would you like to use?</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-lg w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">What's your name and address?</h3>
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
            <select name="title" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange}>
              <option value="">Select</option>
              <option>Mr</option>
              <option>Ms</option>
              <option>Mrs</option>
              <option>Dr</option>
            </select>
            <input type="text" name="firstName" placeholder="First name" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last name" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange} required />
          </div>
          <input type="text" name="postcode" placeholder="Postcode" className="mt-4 p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange} required />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Date of birth</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <select name="dobDay" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange}>
              <option value="">Day</option>
              {renderOptions(31)}
            </select>
            <select name="dobMonth" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange}>
              <option value="">Month</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <input type="number" name="dobYear" placeholder="Year" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange} required />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Photo ID</h3>
          <input type="file" accept=".jpg,.png,.pdf" className="w-full p-3 border border-gray-300 rounded-lg" onChange={handleFileChange} required />
          {idFile && <p className="text-sm text-gray-500 mt-1">Selected: {idFile.name}</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Permission</h3>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="newsletter" onChange={handleChange} className="w-5 h-5" />
            <span>Please send me the newsletter and keep me up to date on relevant promotions.</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="cursor-pointer bg-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-pink-600 transition">
            {loading ? "Submitting..." : "Create my account"}
          </button>
        </div>
      </form>
    </div>
  );
}
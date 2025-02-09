import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function KYCForm() {
  const { isKYCOpen, setIsKYCOpen, updateKYC, userData } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: userData?.email || "",
    dob: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    postcode: "",
    newsletter: false,
  });

  const [idFile, setIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    console.log({ formData })
    const formattedDOB = `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`;

    setFormData({
      ...formData,
      dob: formattedDOB,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIdFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.postcode) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
        idFile,
      };

      await updateKYC(submissionData);
      setIsKYCOpen(false);
    } catch (error) {
      console.error("KYC Submission Failed:", error);
      setError("Failed to submit KYC. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 ${isKYCOpen ? "visible" : "hidden"}`}
      onClick={() => setIsKYCOpen(false)}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
          Identity Verification
        </h2>
        <p className="text-gray-600 text-center mb-6 font-normal text-sm">
          As a <span className='font-bold'>Financial Conduct Authority (FCA) regulated</span> service, we are required to verify your identity. This helps protect your account, prevent fraud, and comply with financial regulations.
        </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What email would you like to use?</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={formData.email || userData?.email || ""}
                onChange={handleChange}
                required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What's your name and address?</h3>
            <div className="grid grid-cols-3 gap-4">
              <select name="title" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange}>
                <option>Select</option>
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
            <div className="grid grid-cols-3 gap-4">
              <select name="dobDay" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange}>
                <option>Day</option>
                {[...Array(31)].map((_, i) => <option key={i}>{i + 1}</option>)}
              </select>
              <select name="dobMonth" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange}>
                <option>Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <input type="text" name="dobYear" placeholder="Year" className="p-3 border border-gray-300 rounded-lg w-full" onChange={handleChange} required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Photo ID</h3>
            <input
              type="file"
              accept=".jpg,.png,.pdf"
              className="w-full p-3 border border-gray-300 rounded-lg"
              onChange={handleFileChange}
              required
            />
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
    </div>
  );
}
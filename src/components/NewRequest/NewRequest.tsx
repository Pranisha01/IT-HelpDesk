import React, { useState } from "react";
import toast from "react-hot-toast";
import requestsService, {
  type Category,
  type Priority,
} from "../../services/RequestsService";
import { useNavigate } from "react-router-dom";

export default function NewRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [requester, setRequester] = useState("");
  const [category, setCategory] = useState("Software");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !requester || !description) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const newRequest = await requestsService.createRequest({
      title,
      requester,
      category: category as Category,
      priority: priority as Priority,
      description,
    });

    setLoading(false);

    if (!newRequest) {
      const errorMsg = "Failed to create request. Try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Show success toast
    toast.success("Request created successfully!");

    // Redirect to ListPage
    navigate("/requests");
  }

  return (
    <div className="p-4 sm:p-6 max-w-full md:max-w-2xl mx-auto bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white shadow rounded-md p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-800 text-center">
          Create New Request
        </h1>

        {error && (
          <p className="text-red-600 mb-2 sm:mb-4 font-semibold text-center text-sm sm:text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Requester */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Requester *
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Priority *
            </label>
            <select
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Category *
            </label>
            <select
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Hardware</option>
              <option>Software</option>
              <option>Network</option>
              <option>Access</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded-md text-sm"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 text-sm sm:text-base"
          >
            {loading ? "Creating..." : "Create Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

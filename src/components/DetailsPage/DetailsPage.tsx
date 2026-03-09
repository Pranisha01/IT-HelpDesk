import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import requestsService from "../../services/RequestsService";

type RequestStatus = "Open" | "In Progress" | "Resolved" | "Closed";

type Priority = "Low" | "Medium" | "High" | "Urgent";

type Category = "Hardware" | "Software" | "Network" | "Access";

interface Request {
  id: string | number;
  title: string;
  status: RequestStatus;
  priority: Priority;
  category: Category;
  requester: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function DetailsPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    priority: "",
    category: "",
    description: "",
  });

  const statusFlow: Record<RequestStatus, string | null> = {
    Open: "In Progress",
    "In Progress": "Resolved",
    Resolved: "Closed",
    Closed: null,
  };

  useEffect(() => {
    async function fetchDetails() {
      // Wait for 2 seconds before loading data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await requestsService.getRequest(id ?? "");
      setRequest(data);
      setLoading(false);
      if (data) {
        setEditFields({
          priority: data.priority,
          category: data.category,
          description: data.description,
        });
      }
      console.log("Fetched request:", data);
    }
    fetchDetails();
  }, [id]);

  function handleEditClick() {
    setEditMode(true);
  }

  function handleEditFieldChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEditSave() {
    if (!request) return;
    setUpdating(true);
    const updated = await requestsService.updateRequest(request.id, {
      priority: editFields.priority as Priority,
      category: editFields.category as Category,
      description: editFields.description,
    });
    if (updated) {
      setRequest(updated);
      setEditMode(false);
    }
    setUpdating(false);
  }

  function handleEditCancel() {
    if (request) {
      setEditFields({
        priority: request.priority,
        category: request.category,
        description: request.description,
      });
    }
    setEditMode(false);
  }

  async function handleStatusUpdate() {
    if (!request) return;

    const nextStatus = statusFlow[request.status];
    console.log("nextStatus", nextStatus);
    if (!nextStatus) return;

    setUpdating(true);

    try {
      const updated = await requestsService.updateRequestStatus({
        id: request.id,
        status: nextStatus as RequestStatus,
      });
      console.log("Status update response:", updated);

      if (updated) {
        setRequest(updated);
        console.log("Status updated successfully to:", nextStatus);
      } else {
        console.error("Failed to update status: No response from server");
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating status. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <img src="/images/loading.png" alt="Loading..." />
        <h2 className="text-center text-blue-700 text-lg">Loading...</h2>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center mt-16 bg-blue-50 p-6 rounded">
        <p className="text-red-600 text-lg font-semibold">Request not found.</p>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full md:max-w-3xl mx-auto bg-blue-50 min-h-screen">
      <Link
        to="/"
        className="text-blue-700 hover:underline mb-2 sm:mb-4 inline-block text-sm sm:text-base font-semibold"
      >
        ← Back to List
      </Link>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-blue-800">
          {request.title}
        </h1>

        <div className="space-y-2 text-gray-700 text-sm sm:text-base">
          <p>
            <strong>Status:</strong> {request.status}
          </p>
          {editMode ? (
            <>
              <div className="flex flex-col gap-2">
                <label>
                  <strong>Priority:</strong>
                  <select
                    name="priority"
                    value={editFields.priority}
                    onChange={handleEditFieldChange}
                    className="ml-0 sm:ml-2 border rounded px-2 py-1 w-full sm:w-auto"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </label>
                <label>
                  <strong>Category:</strong>
                  <select
                    name="category"
                    value={editFields.category}
                    onChange={handleEditFieldChange}
                    className="ml-0 sm:ml-2 border rounded px-2 py-1 w-full sm:w-auto"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                    <option value="Access">Access</option>
                  </select>
                </label>
                <label>
                  <strong>Description:</strong>
                  <textarea
                    name="description"
                    value={editFields.description}
                    onChange={handleEditFieldChange}
                    className="ml-0 sm:ml-2 border rounded px-2 py-1 w-full"
                    rows={3}
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 w-full sm:w-auto"
                  onClick={handleEditSave}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 w-full sm:w-auto"
                  onClick={handleEditCancel}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Priority:</strong> {request.priority}
              </p>
              <p>
                <strong>Category:</strong> {request.category}
              </p>
              <p>
                <strong>Requester:</strong> {request.requester}
              </p>
              <p>
                <strong>Description:</strong> {request.description}
              </p>
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full sm:w-auto"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              </div>
            </>
          )}
          <p>
            <strong>Created:</strong>{" "}
            {new Date(request.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {new Date(request.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Status update button */}
        {statusFlow[request.status] && (
          <button
            disabled={updating}
            onClick={handleStatusUpdate}
            className="mt-4 sm:mt-6 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:bg-gray-400 w-full sm:w-auto"
          >
            {updating ? "Updating..." : `Mark as ${statusFlow[request.status]}`}
          </button>
        )}

        {/* When Closed */}
        {!statusFlow[request.status] && (
          <p className="mt-4 text-green-600 font-medium text-sm sm:text-base">
            ✔ This request is fully closed.
          </p>
        )}
      </div>
    </div>
  );
}

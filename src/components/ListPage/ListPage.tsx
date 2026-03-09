import requestsService from "../../services/RequestsService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ListPage() {
  const BASE_URL = "https://69a7f1e337caab4b8c602ab2.mockapi.io/api";

  type Request = {
    id: string | number;
    title: string;
    priority: string;
    status: string;
  };

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 5; // show 5 per page

  useEffect(() => {
    fetch(BASE_URL + "/requests")
      .then((res) => res.json())
      .then((requestsData) => {
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      })
      .catch((err) => {
        console.error("Failed to fetch requests:", err);
        setRequests([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //when using json data file instead of API
  // useEffect(() => {
  //   fetch("/db.json")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setRequests(data.requests || []);
  //       console.log("Loaded requests from /db.json:", data.requests);
  //     });
  // }, []);

  // Filter requests by status and priority
  const filteredRequests = requests.filter((req: Request) => {
    const statusMatch = !status || req.status === status;
    const priorityMatch = !priority || req.priority === priority;
    const searchMatch =
      !search || req.title?.toLowerCase().includes(search.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  // Pagination logic for filtered requests
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * limit,
    page * limit,
  );
  const filteredTotal = filteredRequests.length;

  // Delete handler
  async function handleDelete(id: string | number) {
    if (window.confirm("Are you sure you want to delete this request?")) {
      // remove from UI
      setRequests((prev) => prev.filter((r) => r.id !== id));
      // Call backend API
      try {
        await requestsService.deleteRequest(id);
      } catch (error) {
        console.error("Failed to delete request from server.", error);
      }
    }
  }

  return (
    <div className="bg-blue-100 min-h-screen w-full flex items-center justify-center">
      <div className="p-4 sm:p-6 max-w-full md:max-w-4xl bg-blue-50 rounded-lg shadow w-full mx-2 sm:mx-4 md:mx-auto">
        <h1
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-800 text-center cursor-pointer hover:text-blue-950"
          onClick={() => setPage(1)}
        >
          Service Requests
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          {/* Status Filter */}

          <select
            className="border px-3 py-2 rounded-md w-full sm:w-auto"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Filter */}

          <select
            className="border px-3 py-2 rounded-md w-full sm:w-auto"
            value={priority}
            onChange={(e) => {
              setPage(1);
              setPriority(e.target.value);
            }}
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search title..."
            className="border px-3 py-2 rounded-md w-full sm:w-64 flex-1"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-6 text-blue-600 font-semibold">
            Loading requests...
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-sm sm:text-base rounded-md">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Priority</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-red-500 font-semibold"
                      >
                        No requests found
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((req) => (
                      <tr key={req?.id} className="hover:bg-blue-50">
                        <td className="p-3 border">{req?.title}</td>
                        <td className="p-3 border">{req?.priority}</td>
                        <td className="p-3 border">{req?.status}</td>
                        <td className="p-3 border">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center">
                            <Link
                              to={`/requests/${req?.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-semibold"
                            >
                              View
                            </Link>
                            {req.status === "Closed" && (
                              <button
                                className="text-red-600 hover:text-red-800 ml-0 sm:ml-2 text-sm sm:text-base font-semibold"
                                onClick={() => handleDelete(req.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 sm:mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 w-full sm:w-auto"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ◀ Prev
              </button>

              <span className="font-medium text-sm sm:text-base">
                Page {page} of {Math.ceil(filteredTotal / limit) || 1}
              </span>

              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 w-full sm:w-auto"
                disabled={page * limit >= filteredTotal}
                onClick={() => setPage(page + 1)}
              >
                Next ▶
              </button>
            </div>

            {/* Create Button */}
            <div className="mt-4 sm:mt-6 flex justify-end">
              <Link
                to="/new"
                className="block w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center transition-all"
              >
                + New Request
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

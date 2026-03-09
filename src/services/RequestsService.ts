// All json-server operations for "requests" are here

import axios, { type AxiosInstance } from "axios";

export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Status = "Open" | "In Progress" | "Resolved" | "Closed";
export type Category = "Hardware" | "Software" | "Network" | "Access";

export interface HelpdeskRequest {
  id: string | number;
  title: string;
  requester: string;
  category: Category;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  slaHours: number;
  assignee?: string;
  description: string;
  attachments: string[];
}

export interface ListArgs {
  page?: number;
  limit?: number;
  sort?: keyof HelpdeskRequest | "createdAt" | "priority";
  order?: "asc" | "desc";
  status?: Status | "";
  priority?: Priority | "";
  q?: string; // search
}

export interface ListResult {
  items: HelpdeskRequest[];
  total: number;
}

export interface CreateRequestInput {
  title: string;
  requester: string;
  category: Category;
  priority: Priority;
  description: string;
}

export interface UpdateStatusInput {
  id: string | number;
  status: Status;
}

export interface User {
  id: string | number;
  username: string;
  name: string;
  role: "employee" | "admin" | string;
}
// ----------------------------------------------------------------------

/**
 * A small helper to compose URLSearchParams for json-server list endpoints.
 * json-server supports: _page, _limit, _sort, _order + any ?field=value filter + q (full-text).
 */
function buildListParams(args: ListArgs = {}): URLSearchParams {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    status = "",
    priority = "",
    q = "",
  } = args;

  const p = new URLSearchParams();
  p.set("_page", String(page));
  p.set("_limit", String(limit));
  p.set("_sort", String(sort));
  p.set("_order", order);

  if (status) p.set("status", status);
  if (priority) p.set("priority", priority);
  if (q) p.set("q", q);

  return p;
}

/**
 * Read x-total-count safely from Axios response headers.
 */
function readTotalCount(
  headers: Record<string, string | number | boolean | undefined>,
): number {
  const raw = headers["x-total-count"];
  const n = typeof raw === "string" ? Number(raw) : Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export class RequestsService {
  private http: AxiosInstance;

  constructor(baseURL = "https://69a7f1e337caab4b8c602ab2.mockapi.io/api") {
    this.http = axios.create({ baseURL });
  }

  //login
  async login(username: string, password: string): Promise<User | null> {
    try {
      const res = await this.http.get<User[]>("/users", {
        params: { username, password },
      });
      // console.log("res.data", res.data);
      return res.data.length ? res.data[0] : null;
    } catch (error) {
      console.log("json-server :: login :: error", error);
      return null;
    }
  }

  // CRUD operations

  //  Create a new request (POST )

  async createRequest(
    input: CreateRequestInput,
  ): Promise<HelpdeskRequest | null> {
    try {
      const payload: Omit<HelpdeskRequest, "id"> = {
        title: input.title,
        requester: input.requester,
        category: input.category,
        priority: input.priority,
        status: "Open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slaHours: 24,
        assignee: undefined,
        description: input.description,
        attachments: [],
      };
      const res = await this.http.post<HelpdeskRequest>("/requests", payload);
      console.log("res.data", res.data);
      return res.data;
    } catch (error) {
      console.log("json-server :: createRequest :: error", error);
      return null;
    }
  }

  // Update a request (PUT/PATCH).

  async updateRequest(
    id: string | number,
    put: Partial<Omit<HelpdeskRequest, "id" | "createdAt">>,
  ): Promise<HelpdeskRequest | null> {
    try {
      const res = await this.http.put<HelpdeskRequest>(`/requests/${id}`, {
        ...put,
        updatedAt: new Date().toISOString(),
      });
      return res.data;
    } catch (error) {
      console.log("json-server :: updateRequest :: error", error);
      return null;
    }
  }

  //Happy-path status update only (Open -> In Progress -> Resolved -> Closed)

  async updateRequestStatus({
    id,
    status,
  }: UpdateStatusInput): Promise<HelpdeskRequest | null> {
    try {
      const res = await this.http.put<HelpdeskRequest>(`/requests/${id}`, {
        status,
        updatedAt: new Date().toISOString(),
      });
      console.log(res.data, "response data");
      return res.data;
    } catch (error) {
      console.log("json-server :: updateRequestStatus :: error", error);
      return null;
    }
  }

  //Delete a request (DELETE /requests/:id)

  async deleteRequest(id: string | number): Promise<boolean> {
    try {
      await this.http.delete(`/requests/${id}`);
      return true;
    } catch (error) {
      console.log("json-server :: deleteRequest :: error", error);
      return false;
    }
  }

  //Get a single request by id (GET /requests/:id)

  async getRequest(id: number | string): Promise<HelpdeskRequest | null> {
    try {
      const res = await this.http.get<HelpdeskRequest>(`/requests/${id}`);
      console.log("res.data", res.data);
      return res.data;
    } catch (error) {
      console.log("json-server :: getRequest :: error", error);
      return null;
    }
  }

  //List requests with filters/sort/pagination (GET /requests)
  //not used yet (ListPage)
  async listRequests(args: ListArgs = {}): Promise<ListResult> {
    try {
      const params = buildListParams(args);
      const res = await this.http.get<HelpdeskRequest[]>("/requests", {
        params,
      });
      console.log(res, "response");
      return {
        items: res.data,
        total: readTotalCount(
          res.headers as Record<string, string | number | boolean | undefined>,
        ),
      };
    } catch (error) {
      console.log("json-server :: listRequests :: error", error);
      return { items: [], total: 0 };
    }
  }
}

const requestsService = new RequestsService();
export default requestsService;

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import DetailsPage from "./DetailsPage";
import * as requestsService from "../../services/RequestsService";

jest.mock("../../services/RequestsService");

const mockRequest = {
  id: "1",
  title: "Laptop not connecting to WiFi",
  status: "Open" as const,
  priority: "High",
  category: "Hardware",
  requester: "John Doe",
  description: "My laptop is unable to connect to the office WiFi network.",
  createdAt: "2026-02-20T10:00:00Z",
  updatedAt: "2026-02-20T10:00:00Z",
};

describe("DetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially and then displays details", async () => {
    (requestsService.default.getRequest as jest.Mock).mockResolvedValue(
      mockRequest,
    );

    render(
      <MemoryRouter initialEntries={["/requests/1"]}>
        <DetailsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(mockRequest.title)).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText(mockRequest.status)).toBeInTheDocument();
    expect(screen.getByText(/Priority:/)).toBeInTheDocument();
    expect(screen.getByText(/Requester:/)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(mockRequest.requester)),
    ).toBeInTheDocument();
    expect(screen.getByText(/Description:/)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(mockRequest.description)),
    ).toBeInTheDocument();
  });

  it("shows loading then renders request details with different status", async () => {
    const inProgressRequest = {
      ...mockRequest,
      id: "2",
      status: "In Progress" as const,
      priority: "Medium",
    };

    (requestsService.default.getRequest as jest.Mock).mockResolvedValue(
      inProgressRequest,
    );

    render(
      <MemoryRouter initialEntries={["/requests/2"]}>
        <DetailsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText("In Progress")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(inProgressRequest.title)).toBeInTheDocument();
  });

  it("shows request not found message when request is null", async () => {
    (requestsService.default.getRequest as jest.Mock).mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={["/requests/999"]}>
        <DetailsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(
      () => {
        expect(screen.getByText(/Request not found/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });

  it("can enter edit mode after loading completes", async () => {
    (requestsService.default.getRequest as jest.Mock).mockResolvedValue(
      mockRequest,
    );

    render(
      <MemoryRouter initialEntries={["/requests/1"]}>
        <DetailsPage />
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(mockRequest.title)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    await waitFor(() => {
      const prioritySelect = screen.getByDisplayValue(
        mockRequest.priority,
      ) as HTMLSelectElement;
      expect(prioritySelect.tagName).toBe("SELECT");
    });
  });

  it("can update status of a request", async () => {
    const updatedRequest = {
      ...mockRequest,
      status: "In Progress" as const,
    };

    (requestsService.default.getRequest as jest.Mock).mockResolvedValue(
      mockRequest,
    );
    (
      requestsService.default.updateRequestStatus as jest.Mock
    ).mockResolvedValue(updatedRequest);

    render(
      <MemoryRouter initialEntries={["/requests/1"]}>
        <DetailsPage />
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(mockRequest.title)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    const statusElements = screen.getAllByText(mockRequest.status);
    expect(statusElements.length).toBeGreaterThan(0);

    const statusUpdateButton = screen.getByText(/Mark as In Progress/);
    fireEvent.click(statusUpdateButton);

    await waitFor(
      () => {
        expect(screen.getByText("In Progress")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(requestsService.default.updateRequestStatus).toHaveBeenCalledWith({
      id: mockRequest.id,
      status: "In Progress",
    });
  });

  test("snapshot for DetailsPage", async () => {
    const container = render(<DetailsPage />);
    expect(container).toMatchSnapshot();
  });
});

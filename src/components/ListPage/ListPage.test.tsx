import { render, screen } from "@testing-library/react";
import ListPage from "./ListPage";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../services/RequestsService");

describe("ListPage", () => {
  it("renders requests table and filters", async () => {
    render(
      <MemoryRouter>
        <ListPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Service Requests")).toBeInTheDocument();
  });

  it("renders filters", async () => {
    render(
      <MemoryRouter>
        <ListPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("option", { name: "All Status" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "All Priority" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search title...")).toBeInTheDocument();
  });

  it("renders 'No requests found' when there are no requests", async () => {
    render(
      <MemoryRouter>
        <ListPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("No requests found")).toBeInTheDocument();
  });

  test("snapshot for ListPage", async () => {
    const container = render(
      <MemoryRouter>
        <ListPage />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});

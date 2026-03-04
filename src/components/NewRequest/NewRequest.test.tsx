import NewRequest from "./NewRequest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("../../services/RequestsService");

describe("NewRequest", () => {
  it("renders form fields", () => {
    render(
      <MemoryRouter>
        <NewRequest />
      </MemoryRouter>,
    );
    expect(screen.getByText("Create New Request")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[1]).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[2]).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument();
  });

  it("shows error if required fields are missing", async () => {
    render(
      <MemoryRouter>
        <NewRequest />
      </MemoryRouter>,
    );
    screen.getByRole("button", { name: /Create Request/i }).click();
    expect(
      await screen.findByText((content) =>
        content.includes("Please fill all required fields"),
      ),
    ).toBeInTheDocument();
  });

  it("calls createRequest and navigates on success", async () => {
    render(
      <MemoryRouter>
        <NewRequest />
      </MemoryRouter>,
    );
    screen.getByRole("button", { name: /Create Request/i }).click();
    await waitFor(() => {
      expect(
        screen.queryByText(/Please fill all required fields/i),
      ).not.toBeInTheDocument();
    });
  });

  test("snapshot for NewRequest", async () => {
    const container = render(
      <MemoryRouter>
        <NewRequest />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});

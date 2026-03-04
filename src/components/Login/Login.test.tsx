import { render, screen, fireEvent, waitFor } from "@testing-library/react"; //waitFor, fireEvent
import { MemoryRouter } from "react-router-dom"; //, MemoryRouter
import "@testing-library/jest-dom";
import Login from "./Login";
import { Provider } from "react-redux";
import store from "../../store/store";
import * as requestsService from "../../services/RequestsService";

jest.mock("../../services/RequestsService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockUser = {
  id: "1",
  username: "testuser",
  email: "test@example.com",
};

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form with username and password fields", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("shows error message on invalid login", async () => {
    (requestsService.default.login as jest.Mock).mockResolvedValue(null);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const form = screen
      .getByRole("button", { name: /Login/i })
      .closest("form") as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const usernameInput = inputs[0] as HTMLInputElement;
    const passwordInput = inputs[1] as HTMLInputElement;
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid username or password"),
      ).toBeInTheDocument();
    });
  });

  it("clears error message when user signs in successfully", async () => {
    (requestsService.default.login as jest.Mock).mockResolvedValue(mockUser);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const form = screen
      .getByRole("button", { name: /Login/i })
      .closest("form") as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const usernameInput = inputs[0] as HTMLInputElement;
    const passwordInput = inputs[1] as HTMLInputElement;
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(requestsService.default.login).toHaveBeenCalledWith(
        "testuser",
        "password123",
      );
    });

    expect(
      screen.queryByText("Invalid username or password"),
    ).not.toBeInTheDocument();
  });

  it("calls login service with correct credentials", async () => {
    (requestsService.default.login as jest.Mock).mockResolvedValue(mockUser);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const form = screen
      .getByRole("button", { name: /Login/i })
      .closest("form") as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const usernameInput = inputs[0] as HTMLInputElement;
    const passwordInput = inputs[1] as HTMLInputElement;
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(requestsService.default.login).toHaveBeenCalledWith(
        "testuser",
        "password123",
      );
    });
  });

  it("prevents form submission when username is empty", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const form = screen
      .getByRole("button", { name: /Login/i })
      .closest("form") as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const usernameInput = inputs[0] as HTMLInputElement;
    const passwordInput = inputs[1] as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.required).toBe(true);
    expect(usernameInput.value).toBe("");
  });

  it("prevents form submission when password is empty", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const form = screen
      .getByRole("button", { name: /Login/i })
      .closest("form") as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const usernameInput = inputs[0] as HTMLInputElement;
    const passwordInput = inputs[1] as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    expect(passwordInput.required).toBe(true);
    expect(passwordInput.value).toBe("");
  });

  it("handles form submission with valid credentials", async () => {
    (requestsService.default.login as jest.Mock).mockResolvedValue(mockUser);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const form = screen
      .getByRole("button", { name: /Login/i })
      .closest("form") as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const usernameInput = inputs[0] as HTMLInputElement;
    const passwordInput = inputs[1] as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(requestsService.default.login).toHaveBeenCalledWith(
        "testuser",
        "password123",
      );
    });
  });

  test("snapshot for Login", async () => {
    const container = render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});

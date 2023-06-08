import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ProfileTable from "main/components/Profile/ProfileTable"
import commonsFixtures from "fixtures/commonsFixtures";


describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileTable commons={[]} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileTable commons={[]} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileTable commons={[]} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileTable commons={commonsFixtures.threeCommons} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "Cow Price", 'Milk Price', 'Starting Balance', 'Starting Date', 'Degradation Rate', 'Carrying Capacity'];
    const expectedFields = ["id", "name", "cowPrice", "milkPrice", "startingBalance", "startingDate", "degradationRate", "carryingCapacity"];
    const testId = "ProfileTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("4");
  });
});

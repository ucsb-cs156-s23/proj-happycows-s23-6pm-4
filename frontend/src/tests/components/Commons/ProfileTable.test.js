import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ProfileTable from "main/components/Commons/ProfileTable"
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import commonsFixtures from "fixtures/commonsFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ProfileTable tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "ProfileTable";

    beforeEach(()=>{
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    });

  test("renders without crashing for empty table", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileTable commons={[]}  />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileTable commons={commonsFixtures.threeCommons} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ['id','Name','Cow Price','Milk Price','Starting Balance','Starting Date','Degradation Rate','Show Leaderboard?','Carrying Capacity','Visit'];

    expectedHeaders.forEach((headerText) => {
        if (headerText === 'Visit') {
            const buttonColumn = screen.getByRole('columnheader', { name: 'Visit' });
            const buttons = buttonColumn.parentElement.querySelectorAll('.button-column button');
            buttons.forEach((button) => {
            expect(button).toBeInTheDocument();
        });
        } else {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        }
      });

  });

  test("what happens when you click visit", async () => {

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ProfileTable commons={commonsFixtures.threeCommons} />
            </MemoryRouter>
        </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5");
  
    const visitButton = screen.getByTestId(`${testId}-cell-row-0-col-Visit-button`);
    expect(visitButton).toBeInTheDocument();

    fireEvent.click(visitButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/play/5'));
    });

    test("renders one common without crashing", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfileTable commons={commonsFixtures.threeCommons} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5");
    });

    test("renders three commons without crashing for admin user", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfileTable commons={commonsFixtures.threeCommons} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("5");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("1");
    });


});

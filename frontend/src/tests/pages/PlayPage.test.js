import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import PlayPage from "main/pages/PlayPage";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("PlayPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            "id": 5,
            "name": "Seths Common",
            "day": 5,
            "startingDate": "2022-03-05T15:50:10",
            "startingBalance": 1200.10,
            "totalPlayers": 50,
            "cowPrice": 15,
            "milkPrice": 10,
            "degradationRate": .5,
            "showLeaderboard": true,
            "carryingCapacity": 100,
        });
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, {
            "id": 1,
            "totalWealth": 1000,
            "cowHealth": 98.0,
            "numOfCows": 5
        });

    });

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

    });

    test("click buy button", async () => {
        axiosMock.onPut("/api/usercommons/buy").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("buy-cow-button")).toBeInTheDocument();
        const buyCowButton = screen.getByTestId("buy-cow-button");
        fireEvent.click(buyCowButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

        expect(axiosMock.history.put[0].params).toEqual({ commonsId: 1 });
        expect(mockToast).toBeCalledWith(`Cow bought!`);

    });

    test("click sell button", async () => {
        axiosMock.onPut("/api/usercommons/sell").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const sellCowButton = screen.getByTestId("sell-cow-button");
        fireEvent.click(sellCowButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
        
        expect(axiosMock.history.put[0].params).toEqual({ commonsId: 1 });
        expect(mockToast).toBeCalledWith(`Cow sold!`);

    });

    test("Test accessing the backend for userCommonsProfits", async () => {
        axiosMock.onGet("/api/profits/all/commonsid", { params: { commonsId: 1} }).reply(200, [{
            "id": 1,
            "userCommons": {
              "id": 1,
              "commonsId": 1,
              "userId": 1,
              "username": "Phill Conrad",
              "totalWealth": 400,
              "numOfCows": 6,
              "cowHealth": 0
            },
            "amount": 58.2,
            "timestamp": "2023-05-15T20:50:00.043225",
            "numCows": 6,
            "avgCowHealth": 97
        }]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        
        expect(await screen.findByTestId("ProfitsTable-cell-row-0-col-Amount")).toBeInTheDocument();
        
        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-Amount")).toHaveTextContent(/58.20/);
        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-date")).toHaveTextContent(/2023-05-15/);
        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-avgCowHealth")).toHaveTextContent(/97/);
        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-numCows")).toHaveTextContent(/6/);

    });

    test("Make sure CommonsPlay, CommonsOverview, ManageCows, FarmStats, and Profits show up", async () => {        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Welcome Farmer/)).toBeInTheDocument();
        expect(await screen.findByText(/Announcements/)).toBeInTheDocument();
        expect(await screen.findByText(/Manage Cows/)).toBeInTheDocument();
        expect(await screen.findByText(/Your Farm Stats/)).toBeInTheDocument();
        expect(await screen.findByText(/Profits/)).toBeInTheDocument();

    });
});

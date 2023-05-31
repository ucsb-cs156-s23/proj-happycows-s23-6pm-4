import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import commonsFixtures from "fixtures/commonsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import PlayPage from "main/pages/PlayPage";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));

describe("PlayPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/usercommons").reply(200, userCommonsFixtures.oneUserCommons);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, userCommonsFixtures);
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, commonsFixtures.oneCommons);
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.sevenCommons);
        axiosMock.onGet("/api/profits/all/commonsid").reply(200, []);
        axiosMock.onPut("/api/usercommons/sell").reply(200, userCommonsFixtures.oneUserCommons);
        axiosMock.onPut("/api/usercommons/buy").reply(200, userCommonsFixtures.oneUserCommons);
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

    test("click buy and sell buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("buy-a-cow-button")).toBeInTheDocument();

        const buyMaxCowsButton = screen.getByTestId("buy-max-cows-button");
        fireEvent.click(buyMaxCowsButton);
        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
        const buyTenCowsButton = screen.getByTestId("buy-10-cows-button");
        fireEvent.click(buyTenCowsButton);
        await waitFor(() => expect(axiosMock.history.put.length).toBe(2));
        const buyCowButton = screen.getByTestId("buy-a-cow-button");
        fireEvent.click(buyCowButton);
        await waitFor(() => expect(axiosMock.history.put.length).toBe(3));

        const sellCowButton = screen.getByTestId("sell-a-cow-button");
        fireEvent.click(sellCowButton);
        await waitFor(() => expect(axiosMock.history.put.length).toBe(4));
        const sellTenCowsButton = screen.getByTestId("sell-10-cows-button");
        fireEvent.click(sellTenCowsButton);
        await waitFor(() => expect(axiosMock.history.put.length).toBe(5));
        const sellAllCowsButton = screen.getByTestId("sell-all-cows-button");
        fireEvent.click(sellAllCowsButton);
        await waitFor(() => expect(axiosMock.history.put.length).toBe(6));
    });
    
    test("Make sure that both the Announcements and Welcome Farmer components show up", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Announcements/)).toBeInTheDocument();
        expect(await screen.findByText(/Welcome Farmer/)).toBeInTheDocument();
    });
});

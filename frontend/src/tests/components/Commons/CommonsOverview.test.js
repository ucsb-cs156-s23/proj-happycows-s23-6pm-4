import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import commonsFixtures from "fixtures/commonsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import leaderboardFixtures from "fixtures/leaderboardFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import PlayPage from "main/pages/PlayPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    }),
    useNavigate: () => mockNavigate
}));

describe("CommonsOverview tests", () => {

    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        render(
            <CommonsOverview commons={commonsFixtures.oneCommons[0]} />
        );
    });

    test("Redirects to the LeaderboardPage for an admin when you click visit", async () => {
        apiCurrentUserFixtures.adminUser.user.commons = commonsFixtures.oneCommons[0];
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/commons", {params: {id:1}}).reply(200, commonsFixtures.oneCommons);
        axiosMock.onGet("/api/leaderboard/all").reply(200, leaderboardFixtures.threeUserCommonsLB);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(axiosMock.history.get.length).toEqual(5);
        });
        expect(await screen.findByTestId("user-leaderboard-button")).toBeInTheDocument();
        const leaderboardButton = screen.getByTestId("user-leaderboard-button");
        fireEvent.click(leaderboardButton);
        //expect(mockNavigate).toBeCalledWith({ "to": "/leaderboard/1" });
    });

    test("No LeaderboardPage for an ordinary user when commons has showLeaderboard = false", async () => {
        const ourCommons = {
            ...commonsFixtures.oneCommons,
            showLeaderboard : false
        };
        apiCurrentUserFixtures.userOnly.user.commons = commonsFixtures.oneCommons[0];
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons", {params: {id:1}}).reply(200, ourCommons);
        axiosMock.onGet("/api/leaderboard/all").reply(200, leaderboardFixtures.threeUserCommonsLB);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(axiosMock.history.get.length).toEqual(3);
        });
        expect(() => screen.getByTestId("user-leaderboard-button")).toThrow();
    });
 
    test("contains the correct content", async () => {
        render(
            <CommonsOverview commons = {commonsFixtures.oneCommons[0]} />
        );

        await waitFor (() => {
            expect(screen.getByText(/Today is day 5!/)).toBeInTheDocument();
        }); 

        expect(screen.getByText(/Total Players: 50/)).toBeInTheDocument();
        expect(screen.getByText(/Current milk price: \$10/)).toBeInTheDocument();

    });
});
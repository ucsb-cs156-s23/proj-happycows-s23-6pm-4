import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import commonsFixtures from "fixtures/commonsFixtures";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import ManageCows from "main/components/Commons/ManageCows";

describe("ManageCows tests", () => {

    test("renders without crashing", () => {
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} onBuy={(userCommons) => { console.log("onBuy called:",userCommons); }} onSell={ (userCommons) => { console.log("onSell called:",userCommons); }} />
        );
    });

    test("buying and selling cows", async () => {
        const mockBuy = jest.fn();
        const mockSell = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {commonsFixtures.oneCommons[0]} onBuy={mockBuy} onSell={mockSell} />
        );

        const buyMaxButton = screen.getByTestId("buy-max-cows-button");
        const buyTenButton = screen.getByTestId("buy-10-cows-button");
        const buyOneButton = screen.getByTestId("buy-a-cow-button");
        const sellOneButton = screen.getByTestId("sell-a-cow-button");
        const sellTenButton = screen.getByTestId("sell-10-cows-button");
        const sellAllButton = screen.getByTestId("sell-all-cows-button");
        
        fireEvent.click(buyMaxButton);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled());
        fireEvent.click(buyTenButton);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled());
        fireEvent.click(buyOneButton);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled());
        fireEvent.click(sellOneButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled());
        fireEvent.click(sellTenButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled());
        fireEvent.click(sellAllButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled());
        
    });

    test("cow warning appears when cow sell price is scaled", async () => {
        const mockBuy = jest.fn();
        const mockSell = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneRealUserCommons} commons = {commonsFixtures.threeCommons[0]} onBuy={mockBuy} onSell={mockSell} />
        );

        expect(await screen.findByText(/Note: Unhealthy cows can't be sold for full price!/)).toBeInTheDocument();
    });

    test("cow warning is hidden when cow sell price is constant", async () => {
        const mockBuy = jest.fn();
        const mockSell = jest.fn();
        
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneRealUserCommons} commons = {commonsFixtures.threeCommons[1]} onBuy={mockBuy} onSell={mockSell} />
        );

        expect(screen.queryByText(/Note: Unhealthy cows can't be sold for full price!/)).not.toBeInTheDocument();
    });

    test("milk warning appears when milk sell price is scaled", async () => {
        const mockBuy = jest.fn();
        const mockSell = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneRealUserCommons} commons = {commonsFixtures.threeCommons[0]} onBuy={mockBuy} onSell={mockSell} />
        );

        expect(await screen.findByText(/Note: Unhealthy cows don't produce as much milk!/)).toBeInTheDocument();
    });

    test("milk warning is hidden when milk sell price is constant", async () => {
        const mockBuy = jest.fn();
        const mockSell = jest.fn();
        
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneRealUserCommons} commons = {commonsFixtures.threeCommons[1]} onBuy={mockBuy} onSell={mockSell} />
        );

        expect(screen.queryByText(/Note: Unhealthy cows don't produce as much milk!/)).not.toBeInTheDocument();
    });

});
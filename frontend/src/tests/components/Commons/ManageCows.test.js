import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import ManageCows from "main/components/Commons/ManageCows";

describe("ManageCows tests", () => {
    test("renders without crashing", () => {
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} onBuy={(userCommons) => { console.log("onBuy called:",userCommons); }} onSell={ (userCommons) => { console.log("onSell called:",userCommons); }} />
        );
    });

    test("buying and selling a cow", async () => {
        const mockBuy = jest.fn();
        const mockSell = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} onBuy={mockBuy} onSell={mockSell} />
        );

        const buy10Button = screen.getByTestId("buy-10-cows-button");
        const buyButton = screen.getByTestId("buy-cow-button");
        const sellButton = screen.getByTestId("sell-cow-button");
        const sell10Button = screen.getByTestId("sell-10-cows-button");
        const sellAllButton = screen.getByTestId("sell-all-cows-button");
        
        fireEvent.click(buy10Button);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled() );

        fireEvent.click(buyButton);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled() );

        fireEvent.click(sellButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled() );

        fireEvent.click(sell10Button);
        fireEvent.click(sellAllButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled() );
        
    });

});
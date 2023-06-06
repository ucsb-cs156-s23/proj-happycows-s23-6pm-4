import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import ManageCows from "main/components/Commons/ManageCows";

describe("ManageCows tests", () => {
    test("renders without crashing", () => {
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} onBuy={(userCommons) => { console.log("onBuy called:",userCommons); }} onSell={ (userCommons) => { console.log("onSell called:",userCommons); }} />
        );
    });

    test("buy a cow", async () => {
        const mockSell = jest.fn();
        const mockBuy = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {userCommonsFixtures.oneUserCommons[0].commons} onBuy={mockBuy} onSell={mockSell} />
        );

        const buyButton = screen.getByTestId("buy-cow-button");
      
        fireEvent.click(buyButton);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled() );   
    });

    test("buy 10 cows", async () => {
        const mockSell = jest.fn();
        const mockBuy = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {userCommonsFixtures.oneUserCommons[0].commons} onBuy={mockBuy} onSell={mockSell} />
        );

        const buy10Button = screen.getByTestId("buy-10-cows-button");
        fireEvent.click(buy10Button);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled() );        
    });


    test("buy max cows", async () => {
        const mockSell = jest.fn();
        const mockBuy = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {userCommonsFixtures.oneUserCommons[0].commons} onBuy={mockBuy} onSell={mockSell} />
        );

        const buyMaxButton = screen.getByTestId("buy-max-cows-button");
        fireEvent.click(buyMaxButton);
        await waitFor( ()=>expect(mockBuy).toHaveBeenCalled() ); 
    });

    test("sell one cow", async () => {
        const mockSell = jest.fn();
        const mockBuy = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {userCommonsFixtures.oneUserCommons[0].commons} onBuy={mockBuy} onSell={mockSell} />
        );

        const sellButton = screen.getByTestId("sell-cow-button");
        fireEvent.click(sellButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled() );        
    });

    test("sell 10 cows", async () => {
        const mockSell = jest.fn();
        const mockBuy = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {userCommonsFixtures.oneUserCommons[0].commons} onBuy={mockBuy} onSell={mockSell} />
        );

        const sell10Button = screen.getByTestId("sell-10-cows-button");
        
        fireEvent.click(sell10Button);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled() );
        
    });

    test("sell all cows", async () => {
        const mockSell = jest.fn();
        const mockBuy = jest.fn();

        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} commons = {userCommonsFixtures.oneUserCommons[0].commons} onBuy={mockBuy} onSell={mockSell} />
        );

        const sellAllButton = screen.getByTestId("sell-all-cows-button");
        
        fireEvent.click(sellAllButton);
        await waitFor( ()=>expect(mockSell).toHaveBeenCalled() );
        
    });

});
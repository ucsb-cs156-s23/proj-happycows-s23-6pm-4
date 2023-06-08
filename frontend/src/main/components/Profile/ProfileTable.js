import React from "react";
import OurTable from "main/components/OurTable";

export default function CommonsTable({ commons }) {

    const columns = [
        {
            Header: 'id',
            accessor: 'id',

        },
        {
            Header:'Name',
            accessor: 'name',
        },
        {
            Header:'Cow Price',
            accessor: row => row.cowPrice,
            id: 'cowPrice'
        },
        {
            Header:'Milk Price',
            accessor: row => row.milkPrice,
            id: 'milkPrice'
        },
        {
            Header:'Starting Balance',
            accessor: row => row.startingBalance,
            id: 'startingBalance'
        },
        {
            Header:'Starting Date',
            accessor: row => String(row.startingDate).slice(0,10),
            id: 'startingDate'
        },
        {
            Header:'Degradation Rate',
            accessor: row => row.degradationRate,
            id: 'degradationRate'
        },
        {
            Header:'Show Leaderboard?',
            id: 'showLeaderboard',
            accessor: (row, _rowIndex) => String(row.showLeaderboard)
        },
        {
            Header: 'Cows',
            accessor: 'totalCows'
        },
        {
            Header: 'Carrying Capacity',
            accessor: row => row.carryingCapacity,
            id: 'carryingCapacity'
        }
    ];

    const testid = "ProfileTable";

    return <OurTable
        data={commons}
        columns={columns}
        testid={testid}
    />;
};

import React from "react";
import OurTable from "main/components/OurTable";
import { useNavigate } from "react-router-dom";

export default function ProfileTable({ commons }) {

    const navigate = useNavigate();

    const columns = [
        {
            Header:'id',
            accessor: 'id',
        },
        {
            Header:'Name',
            accessor: 'name',
        },
        {
            Header:'Cow Price',
            accessor: 'cowPrice',
        },
        {
            Header:'Milk Price',
            accessor: 'milkPrice',
        },
        {
            Header:'Starting Balance',
            accessor: 'startingBalance',
        },
        {
            Header:'Starting Date',
            accessor: 'startingDate',
        },
        {
            Header:'Degradation Rate',
            accessor: 'degradationRate',
        },
        {
            Header:'Show Leaderboard?',
            id: 'showLeaderboard', // needed for tests
            accessor: (row) => String(row.showLeaderboard) // hack needed for boolean values to show up
        },
        {
            Header:'Carrying Capacity',
            accessor: 'carryingCapacity',
        },
    ];

    const testid = "ProfileTable";

    return <OurTable
        data={commons}
        columns={columns}
        testid={testid}
    />;
};

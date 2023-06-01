import React from "react";
import OurTable, {ButtonColumn} from "main/components/OurTable";
// import { useBackendMutation } from "main/utils/useBackend";
// import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/commonsUtils"
import { useNavigate } from "react-router-dom";
// import { hasRole } from "main/utils/currentUser";

export default function ProfileTable({ commons }) {

    const navigate = useNavigate();

    const visitCallback = (cell) => {
        navigate(`/play/${cell.row.values["id"]}`)
    }

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

    const buttonColumn = [
        ...columns,
        ButtonColumn("Visit",
"primary", visitCallback, testid)
    ];

    const columnsToDisplay = buttonColumn;

    return <OurTable
        data={commons}
        columns={columnsToDisplay}
        testid={testid}
    />;
};

import React from "react";
import { Container, CardGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import Background from "../../assets/PlayPageBackground.png";

export default function PlayPage() {

  const { commonsId } = useParams();
  const { data: currentUser } = useCurrentUser();

  // Stryker disable all 
  const { data: userCommons } =
    useBackend(
      [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`],
      {
        method: "GET",
        url: "/api/usercommons/forcurrentuser",
        params: {
          commonsId: commonsId
        }
      }
    );
  // Stryker enable all 

  // Stryker disable all 
  const { data: commons } =
    useBackend(
      [`/api/commons?id=${commonsId}`],
      {
        method: "GET",
        url: "/api/commons",
        params: {
          id: commonsId
        }
      }
    );
  // Stryker enable all 

  // Stryker disable all 
  const { data: userCommonsProfits } =
    useBackend(
      [`/api/profits/all/commonsid?commonsId=${commonsId}`],
      {
        method: "GET",
        url: "/api/profits/all/commonsid",
        params: {
          commonsId: commonsId
        }
      }
    );
  // Stryker enable all 

  const onSuccessBuy = () => {
    toast(`Cows bought!`);
  }
  const onSuccessSell = () => {
    toast(`Cows sold!`);
  }

  const onBuy = (userCommons, numToBuy) => {
    mutationBuy.mutate({userCommons, numToBuy})
  };
  const onSell = (userCommons, numToSell) => {
    mutationSell.mutate({userCommons, numToSell})
  };

  const objectToAxiosParamsBuy = ({newUserCommons, numToBuy}) => ({
    url: "/api/usercommons/buy",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId,
      numCows: numToBuy
    }
  });
  const mutationBuy = useBackendMutation(
    objectToAxiosParamsBuy,
    { onSuccess: onSuccessBuy },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );

  const objectToAxiosParamsSell = ({newUserCommons, numToSell}) => ({
    url: "/api/usercommons/sell",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId,
      numCows: numToSell
    }
  });
  const mutationSell = useBackendMutation(
    objectToAxiosParamsSell,
    { onSuccess: onSuccessSell },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );


  return (
    <div style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
      <BasicLayout >
        <Container >
          {!!currentUser && <CommonsPlay currentUser={currentUser} />}
          {!!commons && <CommonsOverview commons={commons} currentUser={currentUser} />}
          <br />
          {!!userCommons &&
            <CardGroup >
              <ManageCows userCommons={userCommons} commons={commons} onBuy={onBuy} onSell={onSell} />
              <FarmStats userCommons={userCommons} />
              <Profits userCommons={userCommons} profits={userCommonsProfits} />
            </CardGroup>
          }
        </Container>
      </BasicLayout>
    </div>
  )
}
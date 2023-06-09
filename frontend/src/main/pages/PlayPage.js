import { CardGroup, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser } from "main/utils/currentUser";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import Background from "../../assets/PlayPageBackground.png";

export default function PlayPage() {

  const { commonsId } = useParams();
  const { data: currentUser } = useCurrentUser();

  const { data: userCommons } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`],
      { // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/usercommons/forcurrentuser",
        params: {
          commonsId: commonsId
        }
      }
    );

  const { data: commons } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/commons?id=${commonsId}`],
      { // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/commons",
        params: {
          id: commonsId
        }
      }
    );

  const { data: userCommonsProfits } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/profits/all/commonsid?commonsId=${commonsId}`],
      { // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: "/api/profits/all/commonsid",
        params: {
          commonsId: commonsId
        }
      }
    );

  const onSuccessBuy = () => {
    toast(`Cow bought!`);
  }

  const objectToAxiosParamsBuy = (newUserCommons) => ({
    url: "/api/usercommons/buy",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId,
      numCows: 1
    }
  });

  const mutationbuy = useBackendMutation(
    objectToAxiosParamsBuy,
    { onSuccess: onSuccessBuy },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );

  const onBuy = (userCommons) => {
    mutationbuy.mutate(userCommons)
  };

  const onSuccessSell = () => {
    toast(`Cow sold!`);
  }

  const objectToAxiosParamsSell = (newUserCommons) => ({
    url: "/api/usercommons/sell",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId,
      numCows: 1
    }
  });

  const mutationsell = useBackendMutation(
    objectToAxiosParamsSell,
    { onSuccess: onSuccessSell },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );

  const onSell = (userCommons) => {
    mutationsell.mutate(userCommons)
  };

  return (
    <div style={
      // Stryker disable next-line all : no need to unit test CSS
      { backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
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
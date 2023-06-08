import ProfileTable from "main/components/Profile/ProfileTable";
import RoleBadge from "main/components/Profile/RoleBadge";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser } from "main/utils/currentUser";
import { useBackend } from 'main/utils/useBackend';
import { useState } from "react";

import { Col, Row } from "react-bootstrap";

export default function ProfilePage () {

    const [commonsJoined, setCommonsJoined] = useState([]);
    const { data: currentUser } = useCurrentUser();

    const { data: commons, error: _error, status: _status } =
    useBackend(
      ["/api/usercommons/allforcurrentuser"],
      { method: "GET", url: "/api/usercommons/allforcurrentuser" },
      []
    );

    // useEffect(
    // () => {
    //     // Stryker disable next-line OptionalChaining : too many cases to test for too little value
    //     if (currentUser?.root?.user?.commons) {
    //     setCommonsJoined(currentUser.root.user.commons);
    //     }
    // }, [currentUser]
    // );

    if (!currentUser.loggedIn) {
        return (
            <p>Not logged in.</p>
        )
    }

    return (
        <BasicLayout>
            <Row className="align-items profile-header mb-5 text-center text-md-left">
                <Col md={2}>
                    <img
                        src={currentUser.root.user.pictureUrl}
                        alt="Profile"
                        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                    />
                    <h2>{currentUser.root.user.fullName}</h2>
                    <p className="lead text-muted">{currentUser.root.user.email}</p>
                    <RoleBadge role={"ROLE_USER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_MEMBER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_ADMIN"} currentUser={currentUser}/>
                </Col>
                <Col md>
                    <ProfileTable commons={commons} />
                </Col>
            </Row>
        </BasicLayout>
    )
}

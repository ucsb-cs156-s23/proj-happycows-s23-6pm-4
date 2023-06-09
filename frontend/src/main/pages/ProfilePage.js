import React from "react";
import { Row, Col } from "react-bootstrap";
import RoleBadge from "main/components/Profile/RoleBadge";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import ReactJson from "react-json-view";
const ProfilePage = () => {

    const { data: currentUser } = useCurrentUser();

    if (!currentUser.loggedIn) {
        return (
            <p>Not logged in.</p>
        )
    }

    const { email, pictureUrl, fullName } = currentUser.root.user;
    return (
        <BasicLayout>
            <Row className="profile-header mb-5">
                <Col md={3} className="text-center">
                    <img
                        src={pictureUrl}
                        alt="Profile"
                        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                    />
                    <h2>{fullName}</h2>
                    <p className="lead text-muted">{email}</p>
                    <RoleBadge role={"ROLE_USER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_MEMBER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_ADMIN"} currentUser={currentUser}/>
                </Col>
                <Col className="text-md-left">
                    <ReactJson src={currentUser.root.user.commons} />
                </Col>
            </Row>
        </BasicLayout>
    );
};

export default ProfilePage;

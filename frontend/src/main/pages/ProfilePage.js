import React from "react";
import { Row, Col } from "react-bootstrap";
import RoleBadge from "main/components/Profile/RoleBadge";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ProfileTable from "main/components/Commons/ProfileTable";

export default function ProfilePage () {

    const { data: currentUser } = useCurrentUser();

    if (!currentUser.loggedIn) {
        return (
            <p>Not logged in.</p>
        )
    }

    const { email, pictureUrl, fullName } = currentUser.root.user;

    // Getting all the commons the user has joined
    // originally from HomePage.js

    let commonsJoined = currentUser.root.user.commons;

    return (
        <BasicLayout>
            {/* Profile Header */}
            <Row className="align-items profile-header mb-5 text-center text-md-left">
                <Col md={2}>
                    {/* Profile Picture */}
                    <img
                        src={pictureUrl}
                        alt="Profile"
                        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                    />
                    <h2>{fullName}</h2>
                    <p className="lead text-muted">{email}</p>
                    {/* Profile Info and Badges */}
                    <RoleBadge role={"ROLE_USER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_MEMBER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_ADMIN"} currentUser={currentUser}/>
                </Col>
                {/* Profile Data */}
                <Col md>
                    <ProfileTable commons={commonsJoined} />
                </Col>
            </Row>
        </BasicLayout>
    )
}

// commonsplus.commons.whateverneeded

// export default ProfilePage;

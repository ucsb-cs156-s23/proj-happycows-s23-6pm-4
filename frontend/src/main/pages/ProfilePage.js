import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import RoleBadge from "main/components/Profile/RoleBadge";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ProfileTable from "main/components/Commons/ProfileTable";

export default function ProfilePage () {

    const [commonsJoined, setCommonsJoined] = useState([]);
    const { data: currentUser } = useCurrentUser();

    if (!currentUser.loggedIn) {
        return (
            <p>Not logged in.</p>
        )
    }

    const { email, pictureUrl, fullName, commons } = currentUser.root.user;

    useEffect(
    () => {
        if (commons) {
        setCommonsJoined(commons);
        }
    }, [commons]
    );

    return (
        <BasicLayout>
            <Row className="align-items profile-header mb-5 text-center text-md-left">
                <Col md={2}>
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
                <Col md>
                    <ProfileTable commons={commonsJoined} />
                </Col>
            </Row>
        </BasicLayout>
    )
}

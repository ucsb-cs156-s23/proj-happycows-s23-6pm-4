import React from "react";
import { Row, Card, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { calculateDays } from "main/utils/dateUtils";

export default function CommonsOverview({ commons, currentUser }) {

    let navigate = useNavigate();
    // Stryker disable next-line all
    const leaderboardButtonClick = () => { navigate("/leaderboard/" + commons.id) };
    const showLeaderboard = (hasRole(currentUser, "ROLE_ADMIN") || commons.showLeaderboard );

    const today = new Date();
    commons.day = calculateDays(commons.startingDate,today);

    return (
        <Card data-testid="CommonsOverview">
            <Card.Header as="h5">Announcements</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Title>Today is day {commons.day}! </Card.Title>
                        <Card.Text>Total Players: {commons.totalPlayers}</Card.Text>
                        <Card.Text>Current milk price: ${commons.milkPrice}</Card.Text>
                    </Col>
                    <Col>
                        {showLeaderboard &&
                        (<Button variant="outline-success" data-testid="user-leaderboard-button" onClick={leaderboardButtonClick}>
                            Leaderboard
                        </Button>)}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}; 
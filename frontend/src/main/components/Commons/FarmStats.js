import React from "react";
import { Card } from "react-bootstrap";
import Health from "./../../../assets/Health.png";
import Cash from "./../../../assets/Cash.png";

const FarmStats = ({userCommons}) => {
    return (
        <Card>
        <Card.Header as="h5">Your Farm Stats</Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Text>
                <img className="icon small" src={Cash} alt="Cash"></img>
            </Card.Text>
            <Card.Text className="bigger-text">
                Total Wealth: ${userCommons.totalWealth}
            </Card.Text>
            <Card.Text>
                <img className="icon small" src={Health} alt="Health"></img> 
            </Card.Text>
            <Card.Text  className="bigger-text">
                Cow Health: {Math.round(userCommons.cowHealth*100)/100}%
            </Card.Text>
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 
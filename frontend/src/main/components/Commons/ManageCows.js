import { Button, Card, Col, Row } from "react-bootstrap";
import cowHead from "./../../../assets/CowHead.png";

// add parameters 
const ManageCows = ({userCommons,commons, onBuy, onSell}) =>  {
    // update cowPrice from fixture
    return (
        <Card>
        <Card.Header as="h5">Manage Cows</Card.Header>
        <Card.Body>
            {/* change $10 to info from fixture */}
            <Card.Title>Market Cow Price: ${commons?.cowPrice}</Card.Title>
            <Card.Title>Number of Cows: {userCommons.numOfCows}</Card.Title>
                <Row>
                    <Col>
                        <Card.Text>
                            <img alt="Cow Icon" className="icon" src={cowHead}></img>
                        </Card.Text>
                    </Col>
                    <Col>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onBuy(userCommons, 10)}} data-testid={"buy-10-cows-button"}>Buy ten cows</Button>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onBuy(userCommons, Math.floor(userCommons.totalWealth / commons.cowPrice))}} data-testid={"buy-max-cows-button"}>Buy max cows</Button>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onBuy(userCommons, 1)}} data-testid={"buy-cow-button"}>Buy cow</Button>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onSell(userCommons, 1)}} data-testid={"sell-cow-button"}>Sell cow</Button>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onSell(userCommons, 10)}} data-testid={"sell-10-cows-button"}>Sell ten cows</Button>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onSell(userCommons, userCommons.numOfCows)}} data-testid={"sell-all-cows-button"}>Sell all cows</Button>
                        <br/>
                    </Col>
                </Row>
                    Note: Buying cows buys at current cow price, but selling cows sells at current cow price
                    times the average health of cows as a percentage! 
        </Card.Body>
        </Card>
    ); 
}; 

export default ManageCows; 
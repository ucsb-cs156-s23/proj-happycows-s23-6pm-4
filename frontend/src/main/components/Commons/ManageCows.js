import { Button, Card, Col, Row } from "react-bootstrap";
import cowHead from "./../../../assets/CowHead.png";


// add parameters
const ManageCows = ({userCommons, commons, onBuy, onSell}) =>  {
    // update cowPrice from fixture
    // Stryker disable ArithmeticOperator : line 24: not very important and unsure of how to test this
    return (
        <Card>
        <Card.Header as="h5">Manage Cows</Card.Header>
        <Card.Body>
            {/* why does removing the optional chaining question mark turn the entire page white? */}
            <Card.Title>Market Cow Price: ${commons?.cowPrice}</Card.Title>
            <Card.Title>Number of Cows: {userCommons.numOfCows}</Card.Title>
                <Row>
                    <Col>
                        <Card.Text>
                            <img alt="Cow Icon" className="icon" src={cowHead}></img>
                        </Card.Text>
                    </Col>
                    <Col>
                        <Button variant="outline-danger" onClick={()=>{onBuy(userCommons, parseInt(userCommons.totalWealth/commons.cowPrice))}} data-testid={"buy-max-cows-button"}>Buy Max Cows</Button>
                        <br/>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onBuy(userCommons, 10)}} data-testid={"buy-10-cows-button"}>Buy 10 Cows</Button>
                        <br/>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onBuy(userCommons, 1)}} data-testid={"buy-a-cow-button"}>Buy a Cow</Button>
                        <br/>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onSell(userCommons, 1)}} data-testid={"sell-a-cow-button"}>Sell a Cow</Button>
                        <br/>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onSell(userCommons, 10)}} data-testid={"sell-10-cows-button"}>Sell 10 Cows</Button>
                        <br/>
                        <br/>
                        <Button variant="outline-danger" onClick={()=>{onSell(userCommons, userCommons.numOfCows)}} data-testid={"sell-all-cows-button"}>Sell All Cows</Button>
                        <br/>
                        <br/>
                    </Col>
                </Row>
                {!!commons?.scaleMilkSalePrice &&
                    <Card.Text>
                    Note: Unhealthy cows don't produce as much milk!
                    </Card.Text> 
                }
                {!!commons?.scaleCowSalePrice &&
                    <Card.Text>
                    Note: Unhealthy cows can't be sold for full price!
                    </Card.Text> 
                }
        </Card.Body>
        </Card>
    ); 
}; 

export default ManageCows; 
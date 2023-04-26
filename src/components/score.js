import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useDispatch, useSelector } from "react-redux";

function Score() {

    const dispatch = useDispatch();

    const {
        errors,
        hits,
    } = useSelector((state) => state.animals);
  
    return (
        <Container fluid className={'pt-3'}>
            <Row>
                <Col className='col-6 offset-3 text-center'>
                    <h2>Aciertos: {hits} - Errores: {errors}</h2>
                </Col>
            </Row>
        </Container>
    );
  }
  
  export default Score;
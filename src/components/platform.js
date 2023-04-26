import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useForm } from "react-hook-form";


import { getAnimals, selectImage, hideNoMatch, setPlayer } from '../redux/slices/Animals';

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';

function Platform() {

    const { register, getValues } = useForm();

    const dispatch = useDispatch();

    const {
        cards,
        selectedImage,
        player,
        isFinish,
    } = useSelector((state) => state.animals);

    const [displayCards, setDisplayCards] = useState([]);
    const [locked, setLocked] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('');

    useEffect(() => {
        dispatch(getAnimals());
        setLocked(true);
        const player = localStorage.getItem('currentUser') || null;
        if (player !== null) {
            setLocked(false);
            dispatch(setPlayer(player));
        }
    }, []);

    useEffect(() => {
        setDisplayCards(cards);
        renderCards()
    }, [cards]);

    const [emptyImg, __] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Question_mark_alternate.svg/591px-Question_mark_alternate.svg.png');

    const onClickImg = (event, animalidx) => {

        let card = cards.find((x) => x.idx === animalidx);

        if (card.isMatch || locked) {
            event.preventDefault();
        } else {
            dispatch(selectImage(animalidx));
        }

        if (selectedImage != null) {
            setLocked(true);
            setTimeout(() => {
                dispatch(hideNoMatch());
                setLocked(false);
            }, 1200);
        }
    }

    const onFinish = (e) => {
        e.preventDefault();
        const player = getValues("currentuser")
        if (player !== '') {
            setLocked(false);
            dispatch(setPlayer(player));
            localStorage.setItem('currentUser', player); 
        }
    }

    const renderCards = () => {
        return (
        <Row>
            { displayCards.length > 0 &&
                displayCards.map((animal, index) => {
                    return (
                        <Col xs={12} sm={6} md={4} lg={3} xl={2} className='col-2 text-center pt-2 pb-2' key={animal.idx}>
                            <img src={ animal.isMatch || animal.isVisible ? animal.url : emptyImg } width={'auto'} height={'180px'} onClick={ (e) => onClickImg(e, animal.idx) }/>
                        </Col>
                    )
                })
            }
        </Row>
        )
    }
  
    return (
        <Container fluid className={'pt-3'}>
            { 
                player === null && 
                <>
                    <Row>
                        <Col className='col-6 offset-3 pt-3 pb-3'>
                            <Alert variant='danger'>
                                Debe ingresar su <b>Usuario</b> para iniciar el juego
                            </Alert>
                        </Col>
                        <Col className='col-2 offset-5 pt-3 pb-3'>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control type="text" {...register("currentuser")} />
                                    <Form.Text className="text-muted">
                                        * sera usado en los registros del Juego.
                                    </Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="button" onClick={(e) => onFinish(e)}>
                                    iniciar
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </>
            }
            { 
                isFinish &&
                <>
                    <Row>
                        <Col className='col-6 offset-3 pt-3 pb-3'>
                            <Alert variant='success'>
                                Felicidades <b>{ player }</b>, has finalizado el juego
                            </Alert>
                        </Col>
                    </Row>
                </>
            }
            { renderCards() }
        </Container>
    );
  }
  
  export default Platform;
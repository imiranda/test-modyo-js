import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const MAX_ITEMS = 9;

const initialState = {
    loading: false,
    error: false,
    cards: [],
    selectedImage: null,
    hits: 0,
    errors: 0,
    player: null,
    isFinish: false,
};

const slice = createSlice({
    name: "animals",
    initialState,
    reducers: {
        startLoading(state) {
            state.loading = true;
        },
        hasError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        cards(state, action) {
            state.loading = false;
            state.cards = action.payload;
        },
        selectImage(state, action) {

            state.loading = false;
            let cards = JSON.parse(JSON.stringify(state.cards));

            let card = cards.find((x) => x.idx === action.payload);
            card.isVisible = true;
            const i = cards.findIndex((x) => x.idx === action.payload);
            cards[i] = card;
            state.cards = cards;

            if (state.selectedImage === null) {
                
                state.selectedImage = card.uuid;
                
            } else {
                if (state.selectedImage === card.uuid) {
                    state.hits++;
                    cards.forEach(function(i, index) {
                        if (cards[index].uuid === card.uuid) {
                            cards[index].isMatch = true;
                        }
                    });
                    state.cards = cards;

                    if (state.hits === MAX_ITEMS) {
                        state.isFinish = true;
                    }
                }
                else {
                    state.errors++;
                }
                state.selectedImage = null;
            }
        },
        hideNoMatch(state) {
            state.loading = false;
            let cards = JSON.parse(JSON.stringify(state.cards));
            cards = cards.map((animal) => {
                return { ...animal, isVisible: animal.isMatch }
            });
            state.cards = cards;
        },
        incrementHits(state, action) {
            state.loading = false;
            state.hits++;
        },
        incrementError(state, action) {
            state.loading = false;
            state.errors++;
        },
        changePlayer(state, action) {
            state.loading = false;
            state.player = action.payload;
        },
    },
});

export default slice.reducer;

export function getAnimals() {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const url = `https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20`;
        const response = await axios.get(url);
        let result = response.data.entries.sort(function() {return 0.5 - Math.random()}).slice(0, MAX_ITEMS).map((animal) => {
            return { ...animal.fields.image, isMatch: false, isVisible: false }
        });
        result = result.concat(result).map((animal, index) => {
            return { ...animal, idx: index }
        });
        result = result.sort(function() {return 0.5 - Math.random()});
        dispatch(slice.actions.cards(result));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    };
}

export function selectImage(key) {
    return async (dispatch) => {        
        dispatch(slice.actions.selectImage(key));
    }
}

export function hideNoMatch(key) {
    return async (dispatch) => {        
        dispatch(slice.actions.hideNoMatch(key));
    }
}

export function addError() {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {            
            dispatch(slice.actions.incrementError());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addHit() {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {            
            dispatch(slice.actions.incrementHits());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setPlayer(player = '') {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {            
            dispatch(slice.actions.changePlayer(player));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
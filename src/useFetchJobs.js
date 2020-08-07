import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_DATA: 'get-data',
    ERROR: 'error',
    UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
};

const BASE_URL = 'https://api.allorigins.win/raw?url=https://jobs.github.com/positions.json';

// dispatch whatever we pass through it populated inside this action variable
// state is whatever current state of app
function reducer(state, action) {
    const { MAKE_REQUEST, GET_DATA, ERROR, UPDATE_HAS_NEXT_PAGE } = ACTIONS;
    switch (action.type) {
        case MAKE_REQUEST:
            return { loading: true, jobs: [] }
        case GET_DATA:
            return { ...state, loading: false, jobs: action.payload.jobs }
        case ERROR:
            return { ...state, loading: false, error: action.payload.error }
        case UPDATE_HAS_NEXT_PAGE:
            return { ...state, hasNextPage: action.payload.hasNextPage }
        default:
            return state;
    };
};

export default function useFetchJobs(params, page) {
    // reducer function is gonna triggered by dispatch every time.
    const [state, dispatch] = useReducer(reducer, {
        jobs: [],
        loading: true
    });

    useEffect(()=> {
        const cancelToken1 = axios.CancelToken.source();
        dispatch({ type: ACTIONS.MAKE_REQUEST });
        axios.get(BASE_URL, {
            cancelToken: cancelToken1.token,
            params: {
                markdown: true, 
                page, 
                ...params
            }
        }).then( res => dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } }) )
        .catch( err => {
            if(axios.isCancel(err)) return;
            dispatch({ type: ACTIONS.ERROR, payload: { error: err } });
        } );

        const cancelToken2 = axios.CancelToken.source();
        axios.get(BASE_URL, {
            cancelToken: cancelToken2.token,
            params: {
                markdown: true, 
                page: page + 1, 
                ...params
            }
        }).then( res => dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0 } }) )
        .catch( err => {
            if(axios.isCancel(err)) return;
            dispatch({ type: ACTIONS.ERROR, payload: { error: err } });
        } );

        return () => {
            cancelToken1.cancel();
            cancelToken2.cancel();
        }
    }, [params, page]);

    return state;
    // return {
    //     jobs: [],
    //     loading: false,
    //     error: false,
    // };
};
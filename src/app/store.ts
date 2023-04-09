import { configureStore } from '@reduxjs/toolkit'
import combinationsReducer from "../features/combinations/combinationsSlice";


export default configureStore({
    reducer: {

        combinations: combinationsReducer,

    },
});

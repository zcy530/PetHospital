import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLoginReducer, userRegisterReducer } from './reducers/userReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const userRegisterInfoFromStorage = localStorage.getItem('userRegisterInfo')
  ? JSON.parse(localStorage.getItem('userRegisterInfo'))
  : null

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
    userRegisterInfo: { userRegisterInfo: userRegisterInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
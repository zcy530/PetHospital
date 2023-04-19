import axios from "axios"

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: 'USER_LOGIN_REQUEST'
        })

        const config = {
            headers: {
                'content-Type': 'application/json'
                
            }
        }

        const remember = false
        const  data  = await axios.patch(
            'https://47.120.14.174:443/petHospital/user/login',
            { email, password ,remember },
            config
        )

        dispatch({
            type: 'USER_LOGIN_SUCCESS',
            payload: data,
        })


        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: 'USER_LOGIN_FAIL',
            payload:
               error.response && error.response.data.message
               ? error.response.data.message
               : error.message
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: 'USER_LOGIN_OUT' })
}

export const register = (email, password, role, userClass) => async (dispatch) => {
    try {
        dispatch({
            type: 'USER_REGISTER_REQUEST'
        })

        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(
            'https://47.120.14.174:443/petHospital/user/register',
            { email, password, role, userClass },
            config
        )

        dispatch({
            type: 'USER_REGISTER_SUCCESS',
            payload: data,
        })
        console.log({email, password, role, userClass})
        localStorage.setItem('userRegisterInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: 'USER_REGISTER_FAIL',
            payload:
               error.response && error.response.data.message
               ? error.response.data.message
               : error.message
        })
    }
}
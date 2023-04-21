import Notification from 'rc-notification'
import './notice.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const noticeStyle = {
    default:{
        left: '50px',
        right: '50px',
    }
}
const Notif = (() => {
    let notification = null;
    const pop = (config) => {
        const {message, showIcon, closeIcon} = config;
        notification.notice({
            content : <div className='notice'>
                <div className='notice-icon'>
                    <CheckCircleIcon color = "success"/>
                </div>
                <div className='notice-content'>
                    {message}
                </div>
            </div>
        });
    } 
    const config = (config) => {
        const {duration, container, placement, closeIcon} = config;
        Notification.newInstance({
            getContainer: container,
            duration: duration || 2,
            style: noticeStyle[placement],
            closeIcon: closeIcon

        }, notice => notification = notice);
    }
    if(notification) return{
        pop,
        config
    }
    Notification.newInstance({}, notice => {notification = notice})
    return {
        pop,
        config
    }
})()

export default Notif;
import React from "react"
import ListPeopleIcon from "../../assets/picture/login-bg.png";
import {logout} from '../../pages/Doctor/funciton'


import "./style.css"


const Header = () => {
    const userInfo = JSON.parse(localStorage?.getItem('user-info') || "{}") || {};
    console.log('userInfo', userInfo);
    const onLogOut = async () => {
        await logout()
    }

    const onNavigateDasboard = () => {
        window.location.pathname = userInfo?.isPatient ? '/patientview' : '/dashboard';
    }

    const title = userInfo?.isPatient ? 'Thông tin bệnh nhân' : 'OMS SYSTEM';

    return (
        <div className="header !z-0">
            <div className="logo-header" onClick={onNavigateDasboard}>{title}</div>
            <div className="flex" style={{gap: "10px", alignItems: "center", fontWeight: "bold", color: "white"}}>
                <span>Welcome</span>
                <span className="cursor-pointer" onClick={() => window.location.pathname = '/setting'}>{userInfo?.fullName}</span>
                <img src={userInfo?.avatar ? userInfo?.avatar : ListPeopleIcon} alt="" style={{borderRadius: "100px", height: "30px", width: "30px", cursor: "pointer"}}/>
                <span className="cursor-pointer hover:underline text-sm" onClick={onLogOut}>Đăng xuất</span>
            </div>

        </div>
    )

}


export default Header;
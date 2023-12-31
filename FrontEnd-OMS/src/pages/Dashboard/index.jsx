import React, { useEffect, useLayoutEffect, useState } from "react";
import ListIcon from "../../assets/icon/list.svg";
import ListPeopleIcon from "../../assets/icon/list-people.svg";
import SettingIcon from "../../assets/icon/setting.svg";
import { getDetailUser } from '../Doctor/funciton'

import "./style.css"


const Dashboard = () => {
    const userInfo = JSON.parse(localStorage?.getItem('user-info') || "{}") || {};
    const token = localStorage.getItem('user-token');
    const onChangePage = (url) => {
        window.location.href = url
    }

    console.log('mounted');
    
    const option = [
        { label: "Quản lý nhân viên", path: "/doctor", icon: ListPeopleIcon, isShow: (userInfo?.role === 'TK' || userInfo?.isAdmin)},
        { label: "Quản lý bệnh nhân", path: "/patient", icon: ListIcon, isShow: true },
        { label: "Cài Đăt", path: "/setting", icon: SettingIcon, isShow: true},
    ]

    const onGetFullInfo = async () => {
        const rs = await getDetailUser(userInfo?._id);
        console.log('rs', rs);
        localStorage?.setItem('user-info', JSON.stringify(rs?.data));
    }

    useEffect(() => {
        if(!token) {
            window.location.pathname = '/login'
        } else {
            onGetFullInfo()
        }
    }, [token]);

    return (
        <div className="flex dashboard-page" style={{height: "100vh", justifyContent: "center", alignItems: "center"}}>
            <div className="flex sub-page " style={{justifyContent: "center", alignItems: "center", gap: "80px", flexWrap: "wrap", margin: "auto"}}>
                {option.map((item) => {
                    return (
                        item.isShow ? (
                            <div className="item-label flex flex-col" onClick={() => onChangePage(item.path)} style={{alignItems: "center", gap: "20px", cursor: "pointer"}}>
                                <img src={item.icon} alt="" style={{width: "80px", height: "80px" , }}/>
                                <span className="" style={{fontSize: "28px"}}>
                                    {item.label}
                                </span>
                            </div>
                        ) : ''
                    )
                })}
            
            </div>
        </div>
    )

}



export default Dashboard;
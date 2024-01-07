import React, { useEffect, useLayoutEffect, useState } from "react";
import Modal from '../../components/Modal';
import Input from "../../components/Input";
import { login, checkAuth } from './function'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

import './styles.css'

const Login = () => {

    const [state, setState] = useState({
        username: '',
        password: '',
        isOpenModalCheck: false,
        emailCheck: '',
        codeCheck: '',
        forceUpdate: 1
    });

    const iw = window.innerWidth;
    const checkIsLogin = localStorage.getItem('user-token');

    const onChangeValue = (value, type) => {
        state[type] = value;
        setState({ ...state });
    }

    const onSubmitLogin = async () => {
        if (!(state.password && state.username)) {
            alert('Please Fill Up Value');
            return;
        }
        const res = await login(state);
        // if(res?.data?.status === 200) { 
        if (res?.data.status === 200) {
            setState(prev => ({ ...prev, isOpenModalCheck: true, emailCheck: res?.data.data?.email }));
        } else {
            alert(res?.data?.message);
        }
    }

    const onCheckAuth = async () => {
        const rs = await checkAuth(state.codeCheck);
        if (rs?.data?.status === 200) {
            console.log('rs', rs);
            onSetToken({ user: rs?.data?.data, token: rs?.data?.data?.token });
            window.location.pathname = '/dashboard';
            alert(rs?.data?.message);
        }
    }

    const onResendCode = async () => {
        await onSubmitLogin();
        alert('Your code was be resend')
    }

    const onSetToken = (data) => {
        const { token, user } = data;
        if (!token) return;
        localStorage.setItem("user-token", token);
        localStorage.setItem("user-info", JSON.stringify(user));
    }

    useLayoutEffect(() => {
        if (checkIsLogin) {
            window.location.pathname = '/dashboard';
        }
    }, [checkIsLogin])

    return (
        <>
            {/* <iframe src='public/scene1.html'/> */}
            {iw < 600 && (
                <>
                     <div className="tablet-login-page relative">
                        <div className="flex flex-col items-center top-1/2 translate-y-[50%] absolute left-[50%] transform translate-x-[-50%] text-[#001dfc]  text-[30px] font-semibold w-full">
                            <span className="">
                                OUTPATIENTS
                            </span>
                            <span className=" ">
                                MANGEMENT SYSTEM
                            </span>
                        </div>

                        <div className="modal !w-[350px] !h-[250px] flex items-center justify-center absolute top-1/2 translate-y-[80%] left-[50%] transform translate-x-[-50%]">
                            <div className="flex items-center">
                                <div className="flex flex-col gap-2 w-full px-10">
                                    <Input className="input-valid bg-white rounded-full !h-12" style={{ width: "100%" }} placeHolder="Username" onChangeValue={(value) => onChangeValue(value, "username")} />
                                    <Input className="input-valid bg-white rounded-full !h-12" type='password' style={{ width: "100%" }} placeHolder="Password" onChangeValue={(value) => onChangeValue(value, "password")} />
                                    <Button onClick={onSubmitLogin} variant="gradient" className="!bg-blue-500 w-[280px] h-12 rounded-full" style={{ background: "rgba(93,224,230,1)" }}>
                                    Đăng nhập
                                </Button>
                                </div>
                            </div>
                          
                            <div className="section-col" style={{ alignSelf: 'end', marginTop: '20px', }}>
                                <Dialog open={state.isOpenModalCheck} handler={onSubmitLogin}>
                                    <DialogHeader className="flex justify-center items-center">Mã xác nhận đã gửi về email {state?.emailCheck}</DialogHeader>
                                    <DialogBody divider>
                                        <Input className='!h-10 !border-1 !border-solid !border-black !w-full' onChangeValue={(value) => onChangeValue(value, "codeCheck")} />
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            variant="text"
                                            color="blue"
                                            onClick={onResendCode}
                                            className="mr-1"
                                        >
                                            <span>Gửi lại mã</span>
                                        </Button>
                                        <Button variant="gradient" color="green" onClick={onCheckAuth}>
                                            <span>Xác nhận</span>
                                        </Button>
                                    </DialogFooter>
                                </Dialog>
                            </div>
                        </div>


                    </div>
                </>
            )}
            {
                (iw > 600 && iw < 1250) && (
                    <div className="tablet-login-page relative">
                        <div className="flex flex-col items-center top-1/2 translate-y-[50%] absolute left-[50%] transform translate-x-[-50%] text-[#001dfc]  text-[40px] font-semibold w-full">
                            <span className="">
                                OUTPATIENTS
                            </span>
                            <span className=" ">
                                MANGEMENT SYSTEM
                            </span>
                        </div>

                        <div className="modal !w-[650px] !h-[250px] flex items-center justify-center absolute top-1/2 translate-y-[80%] left-[50%] transform translate-x-[-50%]">
                            <div className="flex items-center">
                                <div className="flex flex-col gap-2 w-full px-10">
                                    <Input className="input-valid bg-white rounded-full !h-12" style={{ width: "300px" }} placeHolder="Username" onChangeValue={(value) => onChangeValue(value, "username")} />
                                    <Input className="input-valid bg-white rounded-full !h-12" type='password' style={{ width: "300px" }} placeHolder="Password" onChangeValue={(value) => onChangeValue(value, "password")} />
                                </div>
                            </div>
                            <Button onClick={onSubmitLogin} variant="gradient" className="!bg-blue-500 w-[250px] h-12 rounded-full mr-12" style={{ background: "rgba(93,224,230,1)" }}>
                                    Đăng nhập
                                </Button>
                            <div className="section-col" style={{ alignSelf: 'end', marginTop: '20px', }}>
                                <Dialog open={state.isOpenModalCheck} handler={onSubmitLogin}>
                                    <DialogHeader className="flex justify-center items-center">Mã xác nhận đã gửi về email {state?.emailCheck}</DialogHeader>
                                    <DialogBody divider>
                                        <Input className='!h-10 !border-1 !border-solid !border-black !w-full' onChangeValue={(value) => onChangeValue(value, "codeCheck")} />
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            variant="text"
                                            color="blue"
                                            onClick={onResendCode}
                                            className="mr-1"
                                        >
                                            <span>Gửi lại mã</span>
                                        </Button>
                                        <Button variant="gradient" color="green" onClick={onCheckAuth}>
                                            <span>Xác nhận</span>
                                        </Button>
                                    </DialogFooter>
                                </Dialog>
                            </div>
                        </div>


                    </div>
                )
            }

            {
                (iw >= 1250) && (
                    <div className="login-page flex flex-col" style={{ justifyContent: "space-around", alignItems: "center" }}>
                        <div className="flex flex-col absolute top-[10%]">
                            <span className="big-label flex" style={{ justifyContent: "center" }}>
                                OUTPATIENTS
                            </span>
                            <span className="big-label">
                                MANGEMENT SYSTEM
                            </span>

                        </div>
                        <Modal
                            className='absolute !top-[60%] left-[25%]'
                            visible={true}
                            content={(
                                <div className="form-login section-col" style={{ justifyContent: 'space-evenly' }}>

                                    <div className="flex flex-row" style={{ gap: "45px" }}>
                                        <div className="flex flex-col" style={{ gap: "12px" }}>
                                            <div className="section-row">
                                                <Input className="input-valid bg-white rounded-full !h-12" style={{ width: "300px" }} placeHolder="Username" onChangeValue={(value) => onChangeValue(value, "username")} />
                                            </div>
                                            <div className="section-row">
                                                <Input className="input-valid bg-white rounded-full !h-12" type='password' style={{ width: "300px" }} placeHolder="Password" onChangeValue={(value) => onChangeValue(value, "password")} />
                                            </div>
                                        </div>
                                        <div className="section-col" style={{ alignSelf: 'end', marginTop: '20px', }}>
                                            <Button onClick={onSubmitLogin} variant="gradient" className="!bg-blue-500 w-[280px] rounded-full" style={{ background: "rgba(93,224,230,1)" }}>
                                                Đăng nhập
                                            </Button>
                                            <Dialog open={state.isOpenModalCheck} handler={onSubmitLogin}>
                                                <DialogHeader className="flex justify-center items-center">Mã xác nhận đã gửi về email {state?.emailCheck}</DialogHeader>
                                                <DialogBody divider>
                                                    <Input className='!h-10 !border-1 !border-solid !border-black !w-full' onChangeValue={(value) => onChangeValue(value, "codeCheck")} />
                                                </DialogBody>
                                                <DialogFooter>
                                                    <Button
                                                        variant="text"
                                                        color="blue"
                                                        onClick={onResendCode}
                                                        className="mr-1"
                                                    >
                                                        <span>Gửi lại mã</span>
                                                    </Button>
                                                    <Button variant="gradient" color="green" onClick={onCheckAuth}>
                                                        <span>Xác nhận</span>
                                                    </Button>
                                                </DialogFooter>
                                            </Dialog>
                                            <span style={{ color: "white" }} className="label-type-1 link">Forgot password ?</span>
                                        </div>

                                    </div>


                                </div>
                            )}
                        />
                    </div>
                )
            }
        </>
    )
}

export default Login;
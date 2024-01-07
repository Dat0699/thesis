import React, { useEffect, useRef, useState } from "react";
// import { getlistDoctor, getDetailPatient } from './function'
import DoctorModal from './DoctorModal'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import ReactPaginate from 'react-paginate';
import SelectFalcuty from "../../components/SelectFalcuty";
import SelectRole from "../../components/SelectRole";

import "./style.css"
import { getListtDoctorFaculty, getDetailUser } from './funciton'

const TABLE_HEAD = ["Họ và tên", "Email", "Số điện thoại", "Ngày vào làm", "Chỉnh sửa"];
const iw = window.innerWidth

const DoctorPage = () => {
    const userInfo = JSON.parse(localStorage?.getItem('user-info') || "{}") || {};

    console.log('userInfo?.role', userInfo?.role);
    const isAddRole = ["TN", "TK"].indexOf(userInfo?.role) >= 0;
    const [state, setState] = useState({
        listDoctor: [],
        debounce: false,
        detailPatient: {}
    })

    const [open, setOpen] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);


    const handleGetListDoctor = async (search = '', pageNumber = 0, faculty = '', role = '') => {
        const rs = await getListtDoctorFaculty({ search, pageNumber, faculty, role });
        if (rs?.message) {
            console.log(' rs.data', rs.data);
            const isData = rs.data?.data?.length >= 0;
            setState({ ...state, listDoctor: isData ? rs.data?.data : [], pageSetting: { pageLength: rs.data?.pageLength, totalLength: rs.data?.totalLength, pageNumber: rs.data?.pageNumber } })
        }
        if (rs?.message == 'No user found') {
            setState({ ...state, listDoctor: [] })

        }
    }

    useEffect(() => {
        handleGetListDoctor()
    }, []);

    let throttleSearch;
    const onSearch = async (value) => {
        if (throttleSearch) {
            clearTimeout(throttleSearch);
        }
        throttleSearch = setTimeout(async () => {
            // state.search = value.target.value;
            await handleGetListDoctor(value.target.value, state.pageSetting.pageNumber - 1, state?.faculty);
        }, 350);
    }

    const onSelectDoctor = async (patient) => {
        if (!patient?._id && !patient) return;
        const rs = await getDetailUser((patient?._id || patient));
        if (rs?.status === 200 || rs?.data?._id) {
            setState({ ...state, detailDoctor: rs?.data });
        }
    }

    const onCloseModal = () => {
        setState({ ...state, detailDoctor: {} });
    }

    const onChangePage = async (e) => {
        await handleGetListDoctor(state?.search, e?.selected);
    }

    const onChangeFalucty = async (value) => {
        state.falcuty = value;
        await handleGetListDoctor(state?.search, state.pageSetting.pageNumber - 1, value)
    }

    const onChangeRole = async (value) => {
        state.role = value;
        await handleGetListDoctor(state?.search, state.pageSetting.pageNumber - 1, state?.falcuty, value)
    }

    return (
        <Card className="h-full table-patient">
            <CardHeader floated={false} shadow={false} className={`rounded-none relative smallHeaderPatient`}>
                <div className="flex items-center justify-between gap-1 mb-3 w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <Typography variant="h5" color="blue-gray">
                            Danh sách bác sĩ
                        </Typography>
                        {iw < 1250 && (
                            <>
                                {userInfo?.isAdmin && (
                                    <SelectFalcuty onChange={onChangeFalucty} className='' />
                                )}
        
                                {userInfo?.isAdmin && (
                                    <SelectRole onChange={onChangeRole} />
                                )}
                            </>
                        )}
                        {iw < 1250 && (
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <DoctorModal reloadlistDoctor={handleGetListDoctor} detailDoctor={state.detailDoctor} onCloseModal={onCloseModal} disabled={!isAddRole} />
                            </div>
                        )}
                    </div>
                    {iw >= 1250 && (
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <DoctorModal reloadlistDoctor={handleGetListDoctor} detailDoctor={state.detailDoctor} onCloseModal={onCloseModal} disabled={!isAddRole} />
                        </div>
                    )}  
                </div>
                <div className="w-full max-w-[500px] flex gap-12 h-36 flex-wrap">
                    <Input
                        onChange={onSearch}
                        label="Tìm kiếm"
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                </div>
            </CardHeader>
            {iw > 1250 && (
                <thead className="w-full z-[80] flex justify-start gap-[200px] fixed top-[32%] doctorHeader " style={{ background: 'grey' }}>
                    {TABLE_HEAD?.map((head) => (
                        <th
                            key={head}
                            className="border-blue-gray-100 p-4"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                            >
                                {head}
                            </Typography>
                        </th>
                    ))}
                </thead>
            )}
            <CardBody className="overflow-scroll px-0 body-table-patient">
                <div className="w-full !max-w-[500px] flex gap-12 h-28 z-[99] absolute top-[87px] left-[575px]">
                    {userInfo?.isAdmin && (
                        <SelectFalcuty onChange={onChangeFalucty} className='absolute' />
                    )}

                    {userInfo?.isAdmin && (
                        <SelectRole onChange={onChangeRole} />
                    )}
                </div>

                <table className="mt-[-10px] w-full min-w-max table-auto text-left">
                    <tbody>
                        {state?.listDoctor?.map(
                            ({ email, fullName, birthDate, phoneNumber, _id, age, avatar, createdAt }, index) => {
                                const isLast = index === state.listDoctor.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                console.log('createdAt', createdAt);
                                createdAt = createdAt?.match(/\d{1,4}\-\d{1,2}\-\d{1,2}/g)?.[0] || "";

                                return (
                                    <tr key={_id} style={{position: 'relative'}}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={avatar} alt={fullName} size="sm" />
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {fullName}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        {
                                            iw > 500 && (
                                                <td className={classes}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                            style={{left: '23%', position: 'absolute'}}
                                                        >
                                                            {email}
                                                        </Typography>
                                                    </div>
                                                </td>
                                            )
                                        }
                                        {iw > 1250 && (
                                            <>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                        style={{left: '42%', position: 'absolute'}}
                                                    >
                                                        {phoneNumber}
                                                    </Typography>
                                                </td>

                                                <td className={classes}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                            style={{left: '68%', position: 'absolute'}}
                                                        >
                                                            {new Date(createdAt).toLocaleDateString('en-GB')}
                                                        </Typography>
                                                    </div>
                                                </td>
                                            </>
                                        )}

                                        <td className={classes} style={{right: '4%', position: 'absolute', top: '-5px'}}>
                                            <Tooltip content="Chỉnh sửa" >
                                                <IconButton variant="text" onClick={() => onSelectDoctor(_id)} >
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4 h-20 items-center">
                <ReactPaginate
                    // onPageActive={onPageActive}
                    className="flex gap-16 p-6 rounded-md w-full justify-center paginate"
                    breakLabel="..."
                    nextLabel="Kế >"
                    onPageChange={onChangePage}
                    // pageRangeDisplayed={0}
                    pageCount={Math.floor(state?.pageSetting?.totalLength / state?.pageSetting?.pageLength) + 1}
                    previousLabel="< Trước"
                    disableInitialCallback
                />
            </CardFooter>
        </Card>
    )
}

export default DoctorPage;
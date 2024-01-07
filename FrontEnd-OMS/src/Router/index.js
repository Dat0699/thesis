import Login from '../pages/Login'
import DoctorPage from '../pages/Doctor';
import PatientPage from '../pages/Patient';
import Dashboard from '../pages/Dashboard';
import Setting from '../pages/Setting';
import PatientLogin from '../pages/PatientLogin';
import PatientView from '../pages/PatientView';

let path = window.location.pathname;

// if(window.location.pathname !== "/login") {
//     window.location.pathname = "/login"
// }

const RouteConfig = {
    '/login' : Login,
    '/doctor': DoctorPage,
    '/patient': PatientPage,
    '/dashboard': Dashboard,
    "/setting": Setting,
    '/welcome': PatientLogin,
    '/patientview': PatientView
}[path]  


export const RenderingPage = () => {
    return RouteConfig ? <RouteConfig/> : ""
}


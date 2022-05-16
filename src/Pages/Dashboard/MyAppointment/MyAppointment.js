import React, { useEffect, useState } from 'react';
import auth from '../../../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';


const MyAppointment = () => {
    const [user] = useAuthState(auth);
    const [appointments, setAppointments] = useState([]);
    const navaigate = useNavigate()

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/booking?patientEmail=${user.email}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        signOut(auth);
                        localStorage.removeItem('accessToken')
                        navaigate('/login')
                    }
                    return res.json();
                })
                .then(data => setAppointments(data))
        }
    }, [user])

    return (
        <div>
            <h2 className='text-center mt-5 mb-5'>My Appointment {appointments?.length}</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Treatement</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            appointments.map((appointment, index) =>
                                <tr key={appointment._id}>
                                    <th>{index + 1}</th>
                                    <td>{appointment.patientName}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.slot}</td>
                                    <td>{appointment.treatment}</td>
                                </tr>
                            )
                        }
                    </tbody>

                </table>

            </div>
        </div>
    );
};

export default MyAppointment;
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const Navigate = useNavigate()
    const handleEmailChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/auth/register`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                confirmPassword,
                phone
            }),
        });
        const dataRes = await fetchData.json();
        if (fetchData.ok) {
            if (dataRes.message === 'มีชื่อผู้ใช้อยู่แล้ว') {
                return toast.error(dataRes.message);
            }
            toast.success(dataRes.message);
            setTimeout(() => {
                Navigate('/login')
            }, 2500);
        }else{
            toast.error(dataRes.message);
        }
    };
    return (
        <div className='p-4 flex flex-col min-h-screen'>
            <div className='flex items-center justify-around'>
                <div className='min-w-[45vh] md:min-w-[50vh]  lg:min-w-[75vh] p-4 bg-white rounded-md border shadow-md mt-20 flex flex-col justify-center'>
                    <h1 className='text-center font-bold text-2xl'>ลงทะเบียน เช็คยอดหวย</h1>
                    <form onSubmit={handleSubmit} className='mt-4'>
                        <div className='mb-4'>
                            <div className='input-container '>
                                <label htmlFor='username'>ชื่อผู้ใช้</label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    value={username}
                                    onChange={handleEmailChange}
                                    className='p-2 border md:p-4 lg:p-2 w-full focus:outline-none  rounded-md '
                                    required
                                    placeholder='username'
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <div className='input-container '>
                                <label htmlFor='phone'>เบอร์</label>
                                <input
                                    type='text'
                                    id='phone'
                                    name='phone'
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className='p-2 border md:p-4 lg:p-2 w-full focus:outline-none  rounded-md '
                                    required
                                    placeholder='username'
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <div className='input-container'>
                                <label htmlFor='password'>รหัสผ่าน</label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className='p-2 border md:p-4 lg:p-2 w-full focus:outline-none  rounded-md '
                                    required
                                    placeholder='password'
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <div className='input-container'>
                                <label htmlFor='confirmPassword'>ยืนยันรหัสผ่าน</label>
                                <input
                                    type='password'
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className='p-2 border md:p-4 lg:p-2 w-full focus:outline-none  rounded-md '
                                    required
                                    placeholder='confirm password'
                                />
                            </div>
                        </div>
                        <div className=''>
                            <button
                                type='submit'
                                className='mt-4  underline bg-indigo-900 hover:bg-indigo-950 text-white rounded-md px-3 py-2 mr-4 w-full'
                            >
                                ลงทะเบียน
                            </button>

                        </div>
                    </form>
                    <Link to={'/login'}
                        className='mt-4 underline bg-slate-400 hover:bg-slate-500 text-white text-center rounded-md px-3 py-2 mr-4 w-full'
                    >
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register
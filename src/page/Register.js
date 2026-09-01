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
        } else {
            toast.error(dataRes.message);
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
            <div className="card w-full max-w-md">
                <div className="card-body">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-lg font-bold text-white">
                        88
                    </div>
                    <h1 className="mt-4 text-center text-xl font-bold">ลงทะเบียน</h1>
                    <p className="muted mt-1 text-center">ระบบเช็คยอดหวย</p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="label" htmlFor="username">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleEmailChange}
                                className="input"
                                required
                                placeholder="username"
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="phone">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="input"
                                required
                                placeholder="0812345678"
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="password">รหัสผ่าน</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="input"
                                required
                                placeholder="password"
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="input"
                                required
                                placeholder="confirm password"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">ลงทะเบียน</button>
                    </form>
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="muted text-xs">หรือ</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <Link to={'/login'} className="btn-ghost w-full">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register

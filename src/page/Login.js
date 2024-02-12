import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate()
  const handleEmailChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const dataRes = await fetchData.json();
    if (dataRes.message === 'เข้าสู่ระบบสำเร็จ') {
      localStorage.setItem("user", JSON.stringify(dataRes));
      toast.success(dataRes.message)
      setTimeout(() => {
        Navigate('/home');
      }, 100); // Adjust the delay as needed
    } else {
      toast.error(dataRes.message)
    }
  };
  return (
    <div className='p-4 flex flex-col min-h-screen'>
      <div className='flex items-center justify-around'>
        <div className='min-w-[45vh] md:min-w-[50vh]  lg:min-w-[75vh] p-4 bg-white rounded-md border shadow-md mt-20 flex flex-col justify-center'>
          <h1 className='text-center font-bold text-2xl'>เข้าสู่ระบบ เช็คยอดหวย</h1>
          <form onSubmit={handleSubmit} className='mt-4'>
            <div className='mb-4'>
              <div className='input-container '>
                <label htmlFor='email'>ชื่อผู้ใช้</label>
                <input
                  type='text'
                  id='username'
                  name='email'
                  value={username}
                  onChange={handleEmailChange}
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
            <div className=''>
              <button
                type='submit'
                className='mt-4  underline bg-indigo-900 hover:bg-indigo-950 text-white rounded-md px-3 py-2 mr-4 w-full'
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
          <Link to={'/register'}
            className='mt-4 underline bg-slate-400 hover:bg-slate-500 text-white text-center rounded-md px-3 py-2 mr-4 w-full'
          >
            ลงทะเบียน
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
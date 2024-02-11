import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WebHeader = () => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    const [modallogout, setModalLogout] = useState(false)
    const handleShowMenu = () => {
        setModalLogout(preve => !preve);
    }
    const Navigate = useNavigate()
    const handleLogout = (e) => {
        localStorage.removeItem("user");
        toast.success("Your are logout")
        setTimeout(() => {
            Navigate("/login")
        }, 1000);
    }
    return (
        <div className='border rounded-r-md rounded-l-md shadow-md bg-lime-100 flex justify-between p-3'>
            <div></div>
            <div>ระบบเช็คยอดหวย</div>
            <div onClick={handleShowMenu} className='text-end px-4 cursor-pointer'>{storedUserData.data ? storedUserData.data.username : "โหลดข้อมูลล้มเหลว"}</div>
            {
                modallogout ?
                    <div onClick={handleLogout} className='fixed bg-red-500 rounded-md right-4 top-10'>
                        <p className='px-3 py-1 cursor-pointer text-white'>Logout</p>
                    </div> :
                    ""
            }
        </div>
    )
}

export default WebHeader
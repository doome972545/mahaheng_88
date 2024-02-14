import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

const Modal = ({ show, onClose, data }) => {
    const [priceUpper, setPriceUpper] = useState('')
    const [priceLower, setPriceLower] = useState('')
    const handleChangePriceUpper = (e) => {
        setPriceUpper(e.target.value);
    };
    const handleChangePriceLower = (e) => {
        setPriceLower(e.target.value);
    };
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    var num = data.num
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.type === 'two') {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/updatetwo/${storedUserData.data.id}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    num,
                    priceUpper,
                    priceLower,
                }),
            });
            const dataRes = await fetchData.json();
            toast.success(dataRes.message)
        } else {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/updatethree/${storedUserData.data.id}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    num,
                    priceUpper,
                    priceLower,
                }),
            });
            const dataRes = await fetchData.json();
            toast.success(dataRes.message)
        }
        setPriceUpper('')
        setPriceLower('')
        window.location.reload();
    };
    if (!show) return null;
    return (
        <div className='h-screen' >
            <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center'>
                <div className='bg-white min-w-[50vh] max-h-[50vh] mt-14 rounded-md'>
                    <div className='flex justify-end'>
                        <div></div>
                        <h2 className='text-center text-2xl mb-3 mr-14'>แก้ไขข้อมูล</h2>
                        <button onClick={onClose} className=' text-lg bg-red-500 text-white px-3 my-1 mr-2 rounded-md'>กลับ</button>
                    </div>
                    <div className='ml-4 flex gap-2 mb-4'>
                        <div className='flex gap-2 text-xl'>
                            <p>เลข:</p>
                            <p>{data.num}</p>
                        </div>
                        <div className='flex gap-2 text-xl'>
                            <p>บน:</p>
                            <p>{data.priceUpper}</p>
                        </div>
                        <div className='flex gap-2 text-xl'>
                            <p>ล่าง:</p>
                            <p>{data.priceLower}</p>
                        </div>

                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col'>
                            <p className='ml-4 text-xl mb-3'>บน:</p>
                            <input type="text" className='border-2 mx-4 mb-4 rounded-md shadow-md p-2' value={priceUpper} onChange={handleChangePriceUpper} />
                            <p className='ml-4 text-xl mb-3'>ล่าง:</p>
                            <input type="text" className='border-2 mx-4 mb-4 rounded-md shadow-md p-2' value={priceLower} onChange={handleChangePriceLower} />
                            {
                                priceUpper || priceLower ?
                                    <div className='mx-auto my-auto'>
                                        <button className='bg-green-500 text-white px-3 py-2 rounded-md '>ยืนยันการแก้ไข</button>
                                    </div>
                                    : ""
                            }
                            <MdDelete />
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Modal
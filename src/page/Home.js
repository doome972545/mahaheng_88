import React, { useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import FormNum from '../components/FormNum';
const Home = () => {
    const limit = JSON.parse(localStorage.getItem("limitvalue"));
    if (limit === undefined) {
        console.log("object")
    }
    const limitint = parseInt(limit)
    const [listTwo, setListTwo] = useState(null);
    const [listThree, setListThree] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [EditData, setEditData] = useState({})
    const [sumtwo, setSumTwo] = useState();
    const [sumthree, setSumThree] = useState();
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    const handleEdit = (id, priceLower, priceUpper, num, type) => {
        setEditData({
            id,
            num,
            priceUpper,
            priceLower,
            type
        })
        if (setShowModal === false) {
            setEditData('')
        }
        setShowModal(true)
    }
    const fecthListTwo = async () => {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/list_two/${storedUserData.data.id}`, {
                method: 'GET',
            });

            if (!fetchData.ok) {
                throw new Error('not found data');
            }

            const dataRes = await fetchData.json();
            setListTwo(dataRes)
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    const fecthListThree = async () => {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/list_three/${storedUserData.data.id}`, {
                method: 'GET',
            });

            if (!fetchData.ok) {
                throw new Error('not found data');
            }

            const dataRes = await fetchData.json();
            setListThree(dataRes)
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    const sumTwo = async () => {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/sumTwo/${storedUserData.data.id}`, {
                method: 'GET',
            });
            if (!fetchData.ok) {
                throw new Error('not found data')
            }
            const dataRes = await fetchData.json();
            setSumTwo(dataRes[0])
        } catch (e) {
            console.error(e)
        }
    }
    const sumThree = async () => {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/sumThree/${storedUserData.data.id}`, {
                method: 'GET',
            });
            if (!fetchData.ok) {
                throw new Error('not found data')
            }
            const dataRes = await fetchData.json();
            setSumThree(dataRes[0])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        sumTwo();
        sumThree();
        fecthListTwo();
        fecthListThree()
    }, []); // Empty dependency array means this effect runs once after the initial render


    const deleteTwo = async (e) => {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/deletetwo/${storedUserData.data.id}`, {
                method: 'DELETE',
            });

            if (!fetchData.ok) {
                throw new Error('not found data');
            }

            const dataRes = await fetchData.json();
            if (fetchData.ok) {
                toast.success(dataRes.message)
                window.location.reload();
            } else {
                toast.error(dataRes.message)
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    const deleteThree = async (e) => {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/deletethree/${storedUserData.data.id}`, {
                method: 'DELETE',
            });

            if (!fetchData.ok) {
                throw new Error('not found data');
            }

            const dataRes = await fetchData.json();
            if (fetchData.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    return (
        <div className='grid grid-cols-2 m-4 justify-between gap-4'>
            <FormNum></FormNum>
            <div className='border min-w-[50%] bg-teal-100 rounded-md shadow-lg' >
                <div className='grid grid-cols-2 mx-4 my-3 gap-2'>
                    <div className=''>
                        <button className='ml-4 mb-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' onClick={deleteTwo}>ล้างข้อมูลเลข 2 ตัว</button>
                        <h1 className='text-center'>เลข 2 ตัว </h1>
                        <div className='flex gap-3 ml-4'>
                            <p className='flex gap-3' > ยอดรวม บน:{sumtwo ? <p className='text-red-600'>{sumtwo.Upper}</p>
                                : <p>0</p>} บาท</p>
                            <p className='flex gap-3' > ยอดรวม ล่าง:{sumtwo ? <p className='text-red-600'>{sumtwo.Lower}</p>
                                : <p>0</p>} บาท</p>
                        </div>
                        <div className='overflow-y-auto h-[80vh] px-4 mt-4 '>
                            <table class="table-auto w-full bg-white ">
                                <thead>
                                    <tr>
                                        <th className='border border-slate-300 text-center'>เลข</th>
                                        <th className='border border-slate-300 text-center'>บน</th>
                                        <th className='border border-slate-300 text-center'>ล่าง</th>
                                        <th className='border border-slate-300 text-center'>แก้ไข</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTwo && listTwo.length > 0 ? (
                                        listTwo.map((el, index) => (
                                            <tr key={index} className='border'>
                                                <td class="border border-slate-300 text-center text-lg">{el.num}</td>
                                                <td class={`border border-slate-300 text-center text-lg ${el.priceUpper > limitint ? 'text-red-500' : ""}`}>{el.priceUpper}</td>
                                                <td class={`border border-slate-300 text-center text-lg ${el.priceLower > limitint ? 'text-red-500' : ""}`}>{el.priceLower}</td>
                                                <td class={` text-center flex justify-center text-2xl cursor-pointer`} onClick={(() => handleEdit(el.id, el.priceLower, el.priceUpper, el.num, 'two'))} ><CiEdit /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colspan="5" class="text-center bg-red-200">ไม่มีการบันทึกข้อมูล</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className=''>
                        <button className='ml-4 mb-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' onClick={deleteThree}>ล้างข้อมูลเลข 3 ตัว</button>
                        <h1 className='text-center'>เลข 3 ตัว</h1>
                        <div className='flex gap-3 ml-4'>
                            <p className='flex gap-3' > ยอดรวม บน:{sumthree ? <p className='text-red-600'>{sumthree.Upper}</p>
                                : <p>0</p>} บาท</p>
                            <p className='flex gap-3' > ยอดรวม ล่าง:{sumthree ? <p className='text-red-600'>{sumthree.Lower}</p>
                                : <p>0</p>} บาท</p>
                        </div>
                        <div className='overflow-y-auto h-[80vh] px-4 mt-4 '>
                            <table class="table-auto w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className='border border-slate-300 text-center'>เลข</th>
                                        <th className='border border-slate-300 text-center'>บน</th>
                                        <th className='border border-slate-300 text-center'>ล่าง</th>
                                        <th className='border border-slate-300 text-center'>แก้ไข</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listThree && listThree.length > 0 ? (
                                        listThree.map((el, index) => (
                                            <tr key={index} className='border'>
                                                <td class="border border-slate-300 text-center text-lg">{el.num}</td>
                                                <td class={`border border-slate-300 text-center text-lg ${el.priceUpper > limitint ? 'text-red-500' : ""}`}>{el.priceUpper}</td>
                                                <td class={`border border-slate-300 text-center text-lg ${el.priceLower > limitint ? 'text-red-500' : ""}`}>{el.priceLower}</td>
                                                <td class={` text-center flex justify-center text-2xl cursor-pointer`} onClick={(() => handleEdit(el.id, el.priceLower, el.priceUpper, el.num, 'two'))} ><CiEdit /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colspan="5" class="text-center bg-red-200">ไม่มีการบันทึกข้อมูล</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} data={EditData} />
        </div>
    );
}

export default Home
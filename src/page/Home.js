import React, { useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import FormNum from '../components/FormNum';
const Home = () => {
    const limit = JSON.parse(localStorage.getItem("limitvalue"));
    if (limit === undefined){
        console.log("object")
    }
    const limitint = parseInt(limit)
    const [listTwo, setListTwo] = useState(null);
    const [listThree, setListThree] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [EditData, setEditData] = useState({})
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
    useEffect(() => {
        fecthListTwo();
        fecthListThree()
    }, []); // Empty dependency array means this effect runs once after the initial render
    return (
        <div className='grid grid-cols-2 m-4 justify-between gap-4'>
            <FormNum></FormNum>
            <div className='border min-w-[50%] bg-teal-100 rounded-md shadow-lg' >
                <div className='grid grid-cols-2 mx-4 my-3 gap-2'>
                    <div className=''>
                        <h1 className='text-center'>เลข 2 ตัว</h1>
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
                        <h1 className='text-center'>เลข 3 ตัว</h1>
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
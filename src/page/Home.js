import React, { useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import FormNum from '../components/FormNum';
import { MdDelete } from "react-icons/md";
import { getDatabase, onValue, ref } from 'firebase/database';
import app from '../config/firebase';
const Home = () => {
    const db = getDatabase(app);

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
    const UserId = storedUserData.data.id
    const [notifyTwo, setNotify] = useState({ dataArray: [] }); // Initialize with an object having dataArray property

    // Fetch user data upon component mount
    useEffect(() => {
        async function fetchUserData() {
            const userRef = ref(db, 'notify/two/' + UserId);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setNotify(data || { dataArray: [] }); // Ensure data or initialize with an empty array
            });
        }
        fetchUserData();
    }, []);
    const [notifyThree, setNotifyThree] = useState({ dataArray: [] }); // Initialize with an object having dataArray property

    // Fetch user data upon component mount
    useEffect(() => {
        async function fetchUserData() {
            const userRef = ref(db, 'notify/three/' + UserId);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setNotifyThree(data || { dataArray: [] }); // Ensure data or initialize with an empty array
            });
        }
        fetchUserData();
    }, []);
    const UpTwo = parseInt(notifyTwo.priceUpper)
    const LowTwo = parseInt(notifyTwo.priceLower)
    const UpThree = parseInt(notifyThree.priceUpper)
    const LowThree = parseInt(notifyThree.priceLower)
    return (
        <div className='grid grid-cols-2 m-4 justify-between gap-4'>
            <FormNum></FormNum>
            <div className='border min-w-[50%] bg-teal-100 rounded-md shadow-lg' >
                <div className='mx-4 my-3 bg-white rounded-md shadow-md'>
                    <h1 className='text-center'>อัพเดทล่าสุด</h1>

                    <div className=' flex flex-col lg:flex-row justify-between m-3'>
                        {
                            notifyTwo ?
                                <div className='flex gap-16 lg:gap-20 shadow-lg border rounded-md p-3'>
                                    <div>
                                        <p>เลข</p>
                                        {
                                            notifyTwo ? (
                                                // Use .map to iterate and render data from each object in 'notifyTwo'
                                                notifyTwo.dataArray.map((el, index) => (
                                                    <div key={index}>
                                                        <p>{el}</p>
                                                        {/* Render other data from 'el' */}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-red-500">No recent data</p>
                                            )
                                        }
                                    </div>
                                    <div>
                                        <p>บน</p>
                                        {
                                            notifyTwo ? <p>{notifyTwo.priceUpper}</p> : ""
                                        }
                                    </div>
                                    <div>
                                        <p>ล่าง</p>
                                        {
                                            notifyTwo ? <p>{notifyTwo.priceLower}</p> : ""
                                        }
                                        <p className='text-end '>
                                            <p>ยอดรวม</p>
                                            {
                                                notifyTwo ?
                                                    <>
                                                        {
                                                            notifyTwo.priceUpper && notifyTwo.priceLower ?
                                                                <p>{notifyTwo.priceUpper} x {notifyTwo.priceLower} บาท</p>
                                                                :
                                                                <>
                                                                    {
                                                                        notifyTwo.priceUpper ?
                                                                            <p>บน {notifyTwo.priceUpper} บาท</p>
                                                                            :
                                                                            <>
                                                                                {
                                                                                    notifyTwo.priceLower ?
                                                                                        <p>ล่าง {notifyTwo.priceLower} บาท</p>
                                                                                        : ""
                                                                                }
                                                                            </>
                                                                    }
                                                                </>
                                                        }
                                                    </>
                                                    : ''
                                            }
                                            <p className='flex gap-2'>รวม <p className='text-red-600'>{UpTwo + LowTwo || UpTwo || LowTwo || 0}</p> บาท</p>
                                        </p>
                                    </div>
                                </div>
                                : <p className='text-center text-red-500'>ไม่มีข้อมูลล่าสุด</p>
                        }
                        {

                            notifyThree ?
                                <div className='flex gap-16 lg:gap-20 shadow-lg border rounded-md p-3 '>
                                    <div className=''>
                                        <p>เลข</p>
                                        {
                                            notifyThree ? (
                                                // Use .map to iterate and render data from each object in 'notifyThree'
                                                notifyThree.dataArray.map((el, index) => (
                                                    <div key={index}>
                                                        <p>{el}</p>
                                                        {/* Render other data from 'el' */}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-red-500">No recent data</p>
                                            )
                                        }
                                    </div>
                                    <div>
                                        <p>บน</p>
                                        {
                                            notifyThree ? <p>{notifyThree.priceUpper}</p> : ""
                                        }
                                    </div>
                                    <div>
                                        <p>ล่าง</p>
                                        {
                                            notifyThree ? <p>{notifyThree.priceLower}</p> : ""
                                        }
                                        <p className='text-end '>
                                            <p>ยอดรวม</p>
                                            {
                                                notifyThree ?
                                                    <>
                                                        {
                                                            notifyThree.priceUpper && notifyThree.priceLower ?
                                                                <p>{notifyThree.priceUpper} x {notifyThree.priceLower} บาท</p>
                                                                :
                                                                <>
                                                                    {
                                                                        notifyThree.priceUpper ?
                                                                            <p>บน {notifyThree.priceUpper} บาท</p>
                                                                            :
                                                                            <>
                                                                                {
                                                                                    notifyThree.priceLower ?
                                                                                        <p>ล่าง {notifyThree.priceLower} บาท</p>
                                                                                        : ""
                                                                                }
                                                                            </>
                                                                    }
                                                                </>
                                                        }
                                                    </>
                                                    : ''
                                            }
                                            <p className='flex gap-2'>รวม <p className='text-red-600'>{UpThree + LowThree || UpThree || LowThree || 0}</p> บาท</p>
                                        </p>
                                    </div>
                                </div>
                                : <p className='text-center text-red-500'>ไม่มีข้อมูลล่าสุด</p>
                        }
                    </div>

                </div>
                <div className='grid grid-cols-2 mx-4 my-3 gap-2'>
                    <div className=''>
                        <h1 className='text-center'>เลข 2 ตัว </h1>
                        <div className='flex gap-3 ml-4'>
                            <p className='flex gap-3' > ยอดรวม {sumtwo ? <p className='text-red-600'>{sumtwo.Upper + sumtwo.Lower}</p>
                                : <p>0</p>} บาท</p>
                        </div>
                        <div className='overflow-y-auto h-[80vh] px-4 mt-4 '>
                            <table class="table-auto w-full bg-white ">
                                <thead>
                                    <tr>
                                        <th className='border border-slate-300 text-center'>เลข</th>
                                        <th className='border border-slate-300 text-center'>บน</th>
                                        <th className='border border-slate-300 text-center'>ล่าง</th>
                                        <th className='border border-slate-300 text-center'>actions</th>
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
                                                <td></td>
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
                        <button className='ml-4 mb-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' onClick={deleteTwo}>ล้างข้อมูลเลข 2 ตัว</button>
                    </div>
                    <div className=''>
                        <h1 className='text-center'>เลข 3 ตัว</h1>
                        <div className='flex gap-3 ml-4'>
                            <p className='flex gap-3' > ยอดรวม{sumthree ? <p className='text-red-600'>{sumthree.Upper + sumthree.Lower}</p>
                                : <p>0</p>} บาท</p>
                        </div>
                        <div className='overflow-y-auto h-[80vh] px-4 mt-4 '>
                            <table class="table-auto w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className='border border-slate-300 text-center'>เลข</th>
                                        <th className='border border-slate-300 text-center'>บน</th>
                                        <th className='border border-slate-300 text-center'>ล่าง</th>
                                        <th className='border border-slate-300 text-center'>actions</th>
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

                        <button className='ml-4 mb-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' onClick={deleteThree}>ล้างข้อมูลเลข 3 ตัว</button>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} data={EditData} />
        </div>
    );
}

export default Home
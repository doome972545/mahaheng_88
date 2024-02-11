import React, { useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
const Home = () => {
    const [selectItem, setSelectItem] = useState()
    const [inputValue, setInputValue] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const [priceUpper, setPriceUpper] = useState();
    const [priceLower, setPriceLower] = useState();
    const [listTwo, setListTwo] = useState(null);
    const [listThree, setListThree] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [EditData, setEditData] = useState({})
    const [limitValue, setLimitValue] = useState()
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    const limit = JSON.parse(localStorage.getItem("limitvalue"));
    const limitint = parseInt(limit)
    const handlelimitvalChange = (event) => {
        const inputValue = event.target.value;
        setLimitValue(inputValue);
    };
    const handlePriceUpperChange = (event) => {
        const inputPrice = event.target.value;
        setPriceUpper(inputPrice);
    };
    const handlePriceLowerChange = (event) => {
        const inputPrice = event.target.value;
        setPriceLower(inputPrice);
    };
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        // Split the input value into an array when there are spaces
        const dataArray = value.split(/\s+/);
        const uniqueDataArray = [...new Set(dataArray)];
        setDataArray(uniqueDataArray);
    };
    const handleSubmitValue = () => {
        window.location.reload();
        localStorage.setItem("limitvalue", JSON.stringify(limitValue));
    }
    const handleSubmitDeleteValue = () => {
        window.location.reload();
        localStorage.removeItem("limitvalue");
    }
    const handleSubmit = async (event) => {
        if (selectItem === 'two') {
            try {
                fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/savetwo/${storedUserData.data.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dataArray,
                        priceUpper,
                        priceLower,
                    }),
                });
            } catch (error) {
                console.error('Error:', error.message);
            }
        } else if (selectItem === 'three') {
            try {
                fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/savethree/${storedUserData.data.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dataArray,
                        priceUpper,
                        priceLower,
                    }),
                });

            } catch (error) {
                console.error('Error:', error.message);
            }
        } else {
            event.preventDefault();
            toast.error('กรุณาเลือกจำนวนหวยก่อน')
        }
    };
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
    const deleteTwo = async (e) => {
        window.location.reload();
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
            } else {
                toast.error(dataRes.message)
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    const deleteThree = async (e) => {
        window.location.reload();
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/deletethree/${storedUserData.data.id}`, {
                method: 'DELETE',
            });

            if (!fetchData.ok) {
                throw new Error('not found data');
            }

            const dataRes = await fetchData.json();
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
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
    return (
        <div className='grid grid-cols-2 m-4 justify-between gap-4'>
            <div className='border rounded-md shadow-lg bg-yellow-50 min-w-[50%]' >
                <h1 className='text-center my-2 text-2xl '>ใส่ตัวเลข</h1>
                <div className='flex gap-2 mx-4'>
                    <button
                        className={`border rounded-md px-2 py-1 ${selectItem === 'two' ? 'bg-red-500' : 'bg-green-400 hover:bg-green-500'
                            }`}
                        onClick={() => setSelectItem('two')}
                    >
                        2ตัว
                    </button>

                    <button
                        className={`border rounded-md px-2 py-1 ${selectItem === 'three' ? 'bg-red-500' : 'bg-green-400 hover:bg-green-500'
                            }`}
                        onClick={() => setSelectItem('three')}
                    >
                        3ตัว
                    </button>
                        <p className='mx-auto my-auto text-lg flex gap-2'>จำนวนเงินที่กำหนดใว้ {limitint?limitint:<p className='text-red-500'> ไม่การกำหนดจำนวนเงิน </p>} บาท</p>
                </div>
                <form onSubmit={handleSubmit} className='mx-4'>
                    <div className='mb-4'>
                        <label htmlFor='inputValue' className='text-2xl font-bold mb-4'>
                            เลข
                        </label>
                        <input
                            type='text'
                            id='inputValue'
                            value={inputValue}
                            onChange={handleInputChange}
                            className='mt-1 p-2 border rounded-md w-full'
                        />
                        <h1 className='text-2xl font-bold mb-4'>บน</h1>

                        <input
                            type='text'
                            id='priceInput'
                            value={priceUpper}
                            onChange={handlePriceUpperChange}
                            className='mt-1 p-2 border rounded-md w-full'
                        />
                        <h1 className='text-2xl font-bold mb-4'>ล่าง</h1>

                        <input
                            type='text'
                            id='priceInput'
                            value={priceLower}
                            onChange={handlePriceLowerChange}
                            className='mt-1 p-2 border rounded-md w-full'
                        />
                    </div>
                    <div>
                        <p className='mb-2 flex gap-2'>หวย
                            {
                                selectItem === 'two' ? <p> 2 ตัว</p> : ""
                            }
                            {
                                selectItem === 'three' ? <p> 3 ตัว</p> : ""
                            }
                        </p>
                        <p className='mb-2'>{inputValue}</p>

                        {
                            priceUpper && priceLower ? <p className='mb-2'>{priceUpper} x {priceLower} บาท</p> :
                                <>
                                    {
                                        priceUpper ? <p className='mb-2'>บน {priceUpper} บาท</p> : ""
                                    }
                                    {
                                        priceLower ? <p className='mb-2'>ล่าง {priceLower} บาท</p> : ""
                                    }
                                </>
                        }
                    </div>
                    <button type='submit' className='mb-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'>
                        ตกลง
                    </button>
                </form>
                <button className='ml-4 mb-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' onClick={deleteTwo}>ล้างข้อมูลเลข 2 ตัว</button>
                <button className='ml-4 mb-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600' onClick={deleteThree}>ล้างข้อมูลเลข 3 ตัว</button>
                <div className='ml-4'>
                    <h1 className='text-lg font-bold mb-4'>กำหนดจำนวนที่จำกัด</h1>
                    <input className='border rounded-md' type='text'
                        id='inputValue'
                        value={limitValue}
                        onChange={handlelimitvalChange}
                    ></input>
                    <button onClick={handleSubmitValue} className='bg-lime-500 px-2 py-1 rounded-md mx-3'>กำหนด</button>
                    <button onClick={handleSubmitDeleteValue} className='bg-red-400 px-2 py-1 rounded-md '>ลบ</button></div>
            </div>
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
                                                <td class={` text-center flex justify-center text-2xl cursor-pointer`} onClick={(() => handleEdit(el.id, el.priceLower, el.priceUpper, el.num, 'three'))} ><CiEdit /></td>
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
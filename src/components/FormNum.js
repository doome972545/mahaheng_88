import React, { useState } from 'react'
import toast from 'react-hot-toast';

const FormNum = () => {
    const limit = JSON.parse(localStorage.getItem("limitvalue"));
    const limitint = parseInt(limit)
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    const [selectItem, setSelectItem] = useState()
    const [inputValue, setInputValue] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const [priceUpper, setPriceUpper] = useState();
    const [priceLower, setPriceLower] = useState();
    const [limitValue, setLimitValue] = useState()
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
        event.preventDefault();
        try {
            if (selectItem === 'two') {
                const saveVal = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/savetwo/${storedUserData.data.id}`, {
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

                if (saveVal.ok) {
                    toast.success("ssssss")
                    window.location.reload();
                }
            } else if (selectItem === 'three') {
                const saveValThree = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/api/num/savethree/${storedUserData.data.id}`, {
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
                // Proceed with the next steps after the second fetch
                if (saveValThree.ok) {
                    window.location.reload();
                }
            } else {
                event.preventDefault();
                toast.error('กรุณาเลือกจำนวนหวยก่อน');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };


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
        <div>
            <div className='border rounded-md shadow-lg bg-yellow-50 min-w-[50%] pb-4' >
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
                    <p className='mx-auto my-auto text-lg flex gap-2'>จำนวนเงินที่กำหนดใว้ {limitint ? limitint : <p className='text-red-500'> ไม่การกำหนดจำนวนเงิน </p>} บาท</p>
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
        </div>
    )
}

export default FormNum
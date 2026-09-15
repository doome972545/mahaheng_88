import React, {  useState } from 'react'
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

const Modal = ({ show, onClose, data, onSaved }) => {
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
        const endpoint = data.type === "two" ? "updatetwo" : "updatethree";
        try {
            const fetchData = await fetch(
                `${process.env.REACT_APP_SERVER_DOMIN}/api/num/${endpoint}/${storedUserData.data.id}`,
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ num, priceUpper, priceLower }),
                },
            );
            const dataRes = await fetchData.json();
            if (!fetchData.ok) {
                toast.error(dataRes.message || "แก้ไขข้อมูลไม่สำเร็จ");
                return;
            }
            toast.success(dataRes.message);
            setPriceUpper("");
            setPriceLower("");
            // onSaved before onClose so the refetch is already in flight when
            // the dialog unmounts
            onSaved();
            onClose();
        } catch (error) {
            console.error("Error:", error.message);
            toast.error("แก้ไขข้อมูลไม่สำเร็จ");
        }
    };
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center">
            <div className="card w-full max-w-md">
                <div className="card-head">
                    <h2 className="card-title">แก้ไขข้อมูล</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="ปิด"
                    >
                        <IoClose />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 px-5 py-4 text-center">
                    <div>
                        <p className="muted text-xs">เลข</p>
                        <p className="mt-0.5 font-semibold tabular-nums">{data.num || "—"}</p>
                    </div>
                    <div>
                        <p className="muted text-xs">บน</p>
                        <p className="mt-0.5 font-semibold tabular-nums">{data.priceUpper || "—"}</p>
                    </div>
                    <div>
                        <p className="muted text-xs">ล่าง</p>
                        <p className="mt-0.5 font-semibold tabular-nums">{data.priceLower || "—"}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="card-body space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label" htmlFor="editUpper">บน</label>
                            <input
                                type="text"
                                id="editUpper"
                                inputMode="numeric"
                                className="input"
                                placeholder="0"
                                value={priceUpper}
                                onChange={handleChangePriceUpper}
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="editLower">ล่าง</label>
                            <input
                                type="text"
                                id="editLower"
                                inputMode="numeric"
                                className="input"
                                placeholder="0"
                                value={priceLower}
                                onChange={handleChangePriceLower}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button type="button" onClick={onClose} className="btn-ghost">ยกเลิก</button>
                        <button type="submit" className="btn-primary" disabled={!priceUpper && !priceLower}>
                            บันทึกการแก้ไข
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';

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

    const username = storedUserData.data ? storedUserData.data.username : "โหลดข้อมูลล้มเหลว";
    const initial = username && username.length ? username.charAt(0).toUpperCase() : "?";

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                        88
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight">ระบบเช็คยอดหวย</p>
                        <p className="muted text-xs leading-tight">สรุปยอด 2 ตัว / 3 ตัว</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={handleShowMenu}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                            {initial}
                        </span>
                        {username}
                        <FiChevronDown className={`transition ${modallogout ? "rotate-180" : ""}`} />
                    </button>
                    {modallogout ? (
                        <div className="absolute right-0 top-full z-40 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                            >
                                <FiLogOut /> ออกจากระบบ
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </header>
    )
}

export default WebHeader

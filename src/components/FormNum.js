import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import app, { authReady, firebaseEnabled } from "../config/firebase";
import { getDatabase, ref, set, remove } from "firebase/database";

const permutationsOf = (digits) => {
  if (digits.length <= 1) return [digits.join("")];
  return digits.flatMap((digit, index) => {
    const rest = [...digits.slice(0, index), ...digits.slice(index + 1)];
    return permutationsOf(rest).map((tail) => digit + tail);
  });
};

const expandReverse = (numbers) => [
  ...new Set(numbers.flatMap((number) => permutationsOf([...number]))),
];

const FormNum = ({ limitint, onLimitChange, onSaved }) => {
  const db = firebaseEnabled ? getDatabase(app) : null;
  const storedUserData = JSON.parse(localStorage.getItem("user"));
  const [selectItem, setSelectItem] = useState();
  const [inputValue, setInputValue] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [priceUpper, setPriceUpper] = useState("");
  const [priceLower, setPriceLower] = useState("");
  const [limitValue, setLimitValue] = useState("");
  const [confirmTwo, setConfirmTwo] = useState(false);
  const [confirmThree, setConfirmThree] = useState(false);
  const [reverseNum, setReverseNum] = useState(false);
  const username = storedUserData.data.username;
  const UserId = storedUserData.data.id;
  const createTwoNotify = async (numbers) => {
    if (!db) return;
    const user = await authReady;
    if (!user) return;
    try {
      await set(ref(db, "notify/two/" + UserId), {
        username,
        dataArray: numbers,
        priceUpper,
        priceLower,
      });
    } catch (e) {
      console.error("RTDB set failed:", e.message);
      toast.error("อัพเดตข้อมูลเรียลไทม์ไม่สำเร็จ");
    }
  };
  const createThreeNotify = async (numbers) => {
    if (!db) return;
    const user = await authReady;
    if (!user) return;
    try {
      await set(ref(db, "notify/three/" + UserId), {
        username,
        dataArray: numbers,
        priceUpper,
        priceLower,
      });
    } catch (e) {
      console.error("RTDB set failed:", e.message);
      toast.error("อัพเดตข้อมูลเรียลไทม์ไม่สำเร็จ");
    }
  };
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
    const dataArray = value.split(/\s+/).filter(Boolean);
    const uniqueDataArray = [...new Set(dataArray)];
    setDataArray(uniqueDataArray);
  };
  const selectPlain = (item) => {
    setSelectItem(item);
    setReverseNum(false);
  };
  const selectReverse = (item) => {
    setSelectItem(item);
    setReverseNum(true);
  };
  const toggleReverse = useCallback(() => {
    const nextReverse = !reverseNum;
    setReverseNum(nextReverse);
    toast(nextReverse ? "เปิดโหมดกลับเลข" : "ปิดโหมดกลับเลข", { icon: "🔁" });
  }, [reverseNum]);
  useEffect(() => {
    const handleShortcut = (event) => {
      if (!event.ctrlKey || event.code !== "Space") return;
      event.preventDefault();
      toggleReverse();
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [toggleReverse]);
  const handleSubmitValue = () => {
    localStorage.setItem("limitvalue", JSON.stringify(limitValue));
    onLimitChange(parseInt(limitValue));
    setLimitValue("");
    toast.success("กำหนดจำนวนเงินแล้ว");
  };
  const handleSubmitDeleteValue = () => {
    localStorage.removeItem("limitvalue");
    onLimitChange(NaN);
    setLimitValue("");
    toast.success("ลบการกำหนดจำนวนเงินแล้ว");
  };
  // the page reload used to wipe these; without it the previous numbers stay in
  // the box and get submitted again on the next click. selectItem stays on
  // purpose so many rows of the same type can be entered in a row.
  const resetForm = () => {
    setInputValue("");
    setDataArray([]);
    setPriceUpper("");
    setPriceLower("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectItem === "two") {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          toast.error("กรุณากรอกข้อมูลให้ถูกต้อง");
          return;
        }
        for (let index = 0; index < dataArray.length; index++) {
          const element = dataArray[index];
          if (!/^\d+$/.test(element) || element.length !== 2) {
            toast.error("กรุณากรอกข้อมูลให้ถูกต้อง");
            return;
          }
        }

        const numbersTwo = reverseNum ? expandReverse(dataArray) : dataArray;
        await createTwoNotify(numbersTwo);
        const saveVal = await fetch(
          `${process.env.REACT_APP_SERVER_DOMIN}/api/num/savetwo/${storedUserData.data.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dataArray: numbersTwo,
              priceUpper,
              priceLower,
            }),
          },
        );
        if (saveVal.ok) {
          toast.success("บันทึกข้อมูล");
          resetForm();
          onSaved();
        }
      } else if (selectItem === "three") {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          toast.error("กรุณากรอกข้อมูลให้ถูกต้อง");
          return;
        }
        for (let index = 0; index < dataArray.length; index++) {
          const element = dataArray[index];

          if (!/^\d+$/.test(element) || element.length !== 3) {
            toast.error("กรุณากรอกข้อมูลให้ถูกต้อง");
            return;
          }
        }
        const numbersThree = reverseNum ? expandReverse(dataArray) : dataArray;
        await createThreeNotify(numbersThree);
        const saveValThree = await fetch(
          `${process.env.REACT_APP_SERVER_DOMIN}/api/num/savethree/${storedUserData.data.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dataArray: numbersThree,
              priceUpper,
              priceLower,
            }),
          },
        );
        // Proceed with the next steps after the second fetch
        if (saveValThree.ok) {
          toast.success("บันทึกข้อมูล");
          resetForm();
          onSaved();
        }
      } else {
        event.preventDefault();
        toast.error("กรุณาเลือกจำนวนหวยก่อน");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const deleteTwo = async (e) => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/deletetwo/${storedUserData.data.id}`,
        {
          method: "DELETE",
        },
      );

      if (!fetchData.ok) {
        throw new Error("not found data");
      }

      const dataRes = await fetchData.json();
      if (fetchData.ok) {
        toast.success(dataRes.message);
        if (db && (await authReady)) {
          try {
            await remove(ref(db, "notify/two/" + UserId));
          } catch (e) {
            console.error("RTDB remove failed:", e.message);
          }
        }
        setConfirmTwo(false);
        onSaved();
      } else {
        toast.error(dataRes.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const deleteThree = async (e) => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/deletethree/${storedUserData.data.id}`,
        {
          method: "DELETE",
        },
      );

      if (!fetchData.ok) {
        throw new Error("not found data");
      }

      const dataRes = await fetchData.json();
      if (fetchData.ok) {
        toast.success(dataRes.message);
        if (db && (await authReady)) {
          try {
            await remove(ref(db, "notify/three/" + UserId));
          } catch (e) {
            console.error("RTDB remove failed:", e.message);
          }
        }
        setConfirmThree(false);
        onSaved();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const previewNumbers = reverseNum ? expandReverse(dataArray) : dataArray;

  const summaryPrice =
    priceUpper && priceLower
      ? `${priceUpper} x ${priceLower} บาท`
      : priceUpper
        ? `บน ${priceUpper} บาท`
        : priceLower
          ? `ล่าง ${priceLower} บาท`
          : "—";

  return (
    <>
      {confirmTwo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-5 text-center">
            <p className="text-base font-semibold">ยืนยันการล้างข้อมูล</p>
            <p className="muted mt-1">ข้อมูลเลข 2 ตัวทั้งหมดจะถูกลบ และกู้คืนไม่ได้</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmTwo(false)}
                className="btn-ghost"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => deleteTwo()}
                className="btn-danger"
              >
                ล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {confirmThree ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-5 text-center">
            <p className="text-base font-semibold">ยืนยันการล้างข้อมูล</p>
            <p className="muted mt-1">ข้อมูลเลข 3 ตัวทั้งหมดจะถูกลบ และกู้คืนไม่ได้</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmThree(false)}
                className="btn-ghost"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => deleteThree()}
                className="btn-danger"
              >
                ล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="card overflow-hidden">
        <div className="card-head">
          <h2 className="card-title">ใส่ตัวเลข</h2>
          {limitint ? (
            <span className="chip bg-emerald-50 text-emerald-700">
              ลิมิต {limitint} บาท
            </span>
          ) : (
            <span className="chip bg-slate-100 text-slate-500">
              ยังไม่กำหนดลิมิต
            </span>
          )}
        </div>
        <div className="card-body space-y-5">
          <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => selectPlain("two")}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                selectItem === "two" && !reverseNum
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              2 ตัว
            </button>
            <button
              type="button"
              onClick={() => selectPlain("three")}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                selectItem === "three" && !reverseNum
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              3 ตัว
            </button>
            <button
              type="button"
              onClick={() => selectReverse("two")}
              title="2 ตัวกลับ (Ctrl + Space สลับโหมดกลับเลข)"
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                selectItem === "two" && reverseNum
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              2 กลับ
            </button>
            <button
              type="button"
              onClick={() => selectReverse("three")}
              title="3 ตัวกลับ (Ctrl + Space สลับโหมดกลับเลข)"
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                selectItem === "three" && reverseNum
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              3 กลับ
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="inputValue">
                  เลข
                </label>
                <button
                  type="button"
                  onClick={toggleReverse}
                  aria-pressed={reverseNum}
                  title="สลับโหมดกลับเลข (Ctrl + Space)"
                  className={`chip ${
                    reverseNum
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  กลับเลข {reverseNum ? "เปิด" : "ปิด"}
                </button>
              </div>
              <input
                type="text"
                id="inputValue"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                className="input"
                placeholder="เช่น 12 34 56"
              />
              <p className="muted mt-1.5 text-xs">
                คั่นแต่ละเลขด้วยช่องว่าง · กด Ctrl + Space เพื่อสลับโหมดกลับเลข
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="priceUpper">
                  บน
                </label>
                <input
                  type="text"
                  id="priceUpper"
                  inputMode="numeric"
                  value={priceUpper}
                  onChange={handlePriceUpperChange}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="label" htmlFor="priceLower">
                  ล่าง
                </label>
                <input
                  type="text"
                  id="priceLower"
                  inputMode="numeric"
                  value={priceLower}
                  onChange={handlePriceLowerChange}
                  className="input"
                  placeholder="0"
                />
              </div>
            </div>

            {inputValue || priceUpper || priceLower ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="muted">ประเภท</span>
                  <span className="font-semibold tabular-nums">
                    {selectItem === "two"
                      ? "2 ตัว"
                      : selectItem === "three"
                        ? "3 ตัว"
                        : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="muted">เลข</span>
                  <span className="font-semibold tabular-nums">
                    {inputValue || "—"}
                  </span>
                </div>
                {reverseNum && previewNumbers.length ? (
                  <div className="flex items-start justify-between gap-3">
                    <span className="muted shrink-0">
                      กลับเลข ({previewNumbers.length})
                    </span>
                    <span className="text-right font-semibold tabular-nums">
                      {previewNumbers.join(" ")}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <span className="muted">ราคา</span>
                  <span className="font-semibold tabular-nums">
                    {summaryPrice}
                  </span>
                </div>
              </div>
            ) : null}

            <button type="submit" className="btn-primary w-full">
              บันทึกข้อมูล
            </button>
          </form>

          <div className="border-t border-slate-100 pt-5">
            <p className="label">กำหนดจำนวนเงินที่จำกัด</p>
            <div className="flex gap-2">
              <input
                className="input"
                type="text"
                id="limitValue"
                inputMode="numeric"
                placeholder="0"
                value={limitValue}
                onChange={handlelimitvalChange}
              />
              <button
                type="button"
                onClick={handleSubmitValue}
                className="btn-soft shrink-0"
              >
                กำหนด
              </button>
              <button
                type="button"
                onClick={handleSubmitDeleteValue}
                className="btn-ghost shrink-0 text-rose-600"
              >
                ลบ
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="label">ล้างข้อมูล</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmTwo(true)}
                className="btn-ghost text-rose-600 hover:bg-rose-50"
              >
                ล้าง 2 ตัว
              </button>
              <button
                type="button"
                onClick={() => setConfirmThree(true)}
                className="btn-ghost text-rose-600 hover:bg-rose-50"
              >
                ล้าง 3 ตัว
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FormNum;

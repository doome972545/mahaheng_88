import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import FormNum from "../components/FormNum";
import { MdDelete } from "react-icons/md";
import { getDatabase, onValue, ref } from "firebase/database";
import app, { authReady, firebaseEnabled } from "../config/firebase";
import React from "react";
import { useEffect, useState } from "react";

const emptyNotify = { username: "", dataArray: [], priceUpper: "", priceLower: "" };

const normalizeNotify = (raw) => {
  if (!raw) return emptyNotify;
  let dataArray = [];
  if (Array.isArray(raw.dataArray))
    dataArray = raw.dataArray.filter((v) => v !== null && v !== undefined);
  else if (raw.dataArray && typeof raw.dataArray === "object")
    dataArray = Object.values(raw.dataArray);
  return {
    username: raw.username ?? "",
    dataArray,
    priceUpper: raw.priceUpper ?? "",
    priceLower: raw.priceLower ?? "",
  };
};

const useNotifyNode = (db, path) => {
  const [notify, setNotify] = useState(emptyNotify);
  useEffect(() => {
    if (!db) return undefined;
    let cancelled = false;
    let unsubscribe = () => {};
    authReady.then((user) => {
      // the effect can be torn down while sign-in is still pending — without
      // `cancelled` the listener would attach after unmount and never release
      if (cancelled || !user) return;
      unsubscribe = onValue(
        ref(db, path),
        (snapshot) => setNotify(normalizeNotify(snapshot.val())),
        (error) => console.error(`RTDB ${path}:`, error.message),
      );
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [db, path]);
  return notify;
};

const accents = {
  indigo: { chip: "bg-indigo-50 text-indigo-700", num: "bg-indigo-50 text-indigo-700" },
  amber: { chip: "bg-amber-50 text-amber-700", num: "bg-amber-50 text-amber-700" },
};

const NotifyPanel = ({ title, accent, notify, total }) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold">{title}</p>
      <span className={`chip ${accents[accent].chip}`}>
        {notify.dataArray.length} เลข
      </span>
    </div>
    {notify.dataArray.length === 0 ? (
      <p className="muted mt-3 text-center">ไม่มีข้อมูลล่าสุด</p>
    ) : (
      <>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {notify.dataArray.map((el, index) => (
            <span
              key={index}
              className={`rounded-lg px-2 py-1 text-sm font-semibold tabular-nums ${accents[accent].num}`}
            >
              {el}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="muted">บน</span>
            <span className="font-semibold tabular-nums">
              {notify.priceUpper || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="muted">ล่าง</span>
            <span className="font-semibold tabular-nums">
              {notify.priceLower || "—"}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="muted">ยอดรวม</span>
          <span className="text-lg font-bold tabular-nums text-rose-600">
            {total.toLocaleString("th-TH")} บาท
          </span>
        </div>
      </>
    )}
  </div>
);

const NumTable = ({ title, accent, rows, limitint, onEdit, onDeleteZero }) => (
  <section className="card flex flex-col">
    <div className="card-head">
      <h3 className="card-title">{title}</h3>
      <span className={`chip ${accents[accent].chip}`}>
        {rows ? rows.length : 0} รายการ
      </span>
    </div>
    <div className="scroll-y max-h-[60vh]">
      <table className="tbl">
        <thead>
          <tr>
            <th className="tbl-th text-left">เลข</th>
            <th className="tbl-th text-right">บน</th>
            <th className="tbl-th text-right">ล่าง</th>
            <th className="tbl-th w-20" />
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((el, index) => (
              <tr
                key={index}
                className="group transition odd:bg-white even:bg-slate-50/60 hover:bg-indigo-50/50"
              >
                <td className="tbl-td text-left font-semibold">{el.num || "—"}</td>
                <td
                  className={`tbl-td text-right ${
                    Number(el.priceUpper) > limitint ? "font-bold text-rose-600" : ""
                  }`}
                >
                  {el.priceUpper}
                </td>
                <td
                  className={`tbl-td text-right ${
                    Number(el.priceLower) > limitint ? "font-bold text-rose-600" : ""
                  }`}
                >
                  {el.priceLower}
                </td>
                <td className="tbl-td">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(el)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-indigo-600"
                      aria-label="แก้ไข"
                    >
                      <CiEdit />
                    </button>
                    {el.num === "" ? (
                      <button
                        type="button"
                        onClick={onDeleteZero}
                        className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-50"
                        aria-label="ลบ"
                      >
                        <MdDelete />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-3 py-10 text-center text-sm text-slate-400">
                ไม่มีการบันทึกข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

const Home = () => {
  const db = firebaseEnabled ? getDatabase(app) : null;

  // NaN when unset is deliberate: `Number(x) > NaN` is always false, which is
  // what keeps the red over-limit highlight off. A `|| 0` here would turn every
  // row red.
  const [limitint, setLimitint] = useState(() =>
    parseInt(JSON.parse(localStorage.getItem("limitvalue"))),
  );
  const [listTwo, setListTwo] = useState(null);
  const [listThree, setListThree] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [EditData, setEditData] = useState({});
  const [sumtwo, setSumTwo] = useState();
  const [sumthree, setSumThree] = useState();
  const storedUserData = JSON.parse(localStorage.getItem("user"));
  const UserId = storedUserData.data.id;
  const handleEdit = (id, priceLower, priceUpper, num, type) => {
    setEditData({
      id,
      num,
      priceUpper,
      priceLower,
      type,
    });
    if (setShowModal === false) {
      setEditData("");
    }
    setShowModal(true);
  };
  const fecthListTwo = async () => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/list_two/${storedUserData.data.id}`,
        {
          method: "GET",
        },
      );

      if (!fetchData.ok) {
        throw new Error("not found data");
      }

      const dataRes = await fetchData.json();
      setListTwo(dataRes);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const fecthListThree = async () => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/list_three/${storedUserData.data.id}`,
        {
          method: "GET",
        },
      );

      if (!fetchData.ok) {
        throw new Error("not found data");
      }

      const dataRes = await fetchData.json();
      setListThree(dataRes);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const sumTwo = async () => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/sumTwo/${storedUserData.data.id}`,
        {
          method: "GET",
        },
      );
      if (!fetchData.ok) {
        throw new Error("not found data");
      }
      const dataRes = await fetchData.json();
      setSumTwo(dataRes[0]);
    } catch (e) {
      console.error(e);
    }
  };
  const sumThree = async () => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/sumThree/${storedUserData.data.id}`,
        {
          method: "GET",
        },
      );
      if (!fetchData.ok) {
        throw new Error("not found data");
      }
      const dataRes = await fetchData.json();
      setSumThree(dataRes[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const refreshAll = () => {
    sumTwo();
    sumThree();
    fecthListTwo();
    fecthListThree();
  };

  useEffect(() => {
    refreshAll();
    // mount-only is what we want here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteZero = async (e) => {
    try {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMIN}/api/num/deleteZero/${storedUserData.data.id}`,
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
        refreshAll();
      } else {
        toast.error(dataRes.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const notifyTwo = useNotifyNode(db, "notify/two/" + UserId);
  const notifyThree = useNotifyNode(db, "notify/three/" + UserId);

  const UpTwo = Number(notifyTwo.priceUpper) || 0;
  const LowTwo = Number(notifyTwo.priceLower) || 0;
  const UpThree = Number(notifyThree.priceUpper) || 0;
  const LowThree = Number(notifyThree.priceLower) || 0;

  const totalTwo = sumtwo ? Number(sumtwo.Upper) + Number(sumtwo.Lower) : 0;
  const totalThree = sumthree ? Number(sumthree.Upper) + Number(sumthree.Lower) : 0;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-5">
      <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-[73px]">
          <FormNum
            limitint={limitint}
            onLimitChange={setLimitint}
            onSaved={refreshAll}
          />
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="card p-4">
              <p className="muted text-xs">ยอดรวม 2 ตัว</p>
              <p className="stat-value mt-1 text-indigo-600">
                {totalTwo.toLocaleString("th-TH")}
                <span className="text-sm font-normal text-slate-400"> บาท</span>
              </p>
            </div>
            <div className="card p-4">
              <p className="muted text-xs">ยอดรวม 3 ตัว</p>
              <p className="stat-value mt-1 text-amber-600">
                {totalThree.toLocaleString("th-TH")}
                <span className="text-sm font-normal text-slate-400"> บาท</span>
              </p>
            </div>
            <div className="card col-span-2 p-4 sm:col-span-1">
              <p className="muted text-xs">รวมทั้งหมด</p>
              <p className="stat-value mt-1 text-slate-900">
                {(totalTwo + totalThree).toLocaleString("th-TH")}
                <span className="text-sm font-normal text-slate-400"> บาท</span>
              </p>
            </div>
          </div>

          <section className="card">
            <div className="card-head">
              <h2 className="card-title">อัพเดทล่าสุด</h2>
              {firebaseEnabled ? (
                <span className="chip bg-emerald-50 text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  realtime
                </span>
              ) : (
                <span className="chip bg-slate-100 text-slate-500">
                  ยังไม่ได้ตั้งค่า Firebase
                </span>
              )}
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <NotifyPanel
                title="หวย 2 ตัว"
                accent="indigo"
                notify={notifyTwo}
                total={UpTwo + LowTwo}
              />
              <NotifyPanel
                title="หวย 3 ตัว"
                accent="amber"
                notify={notifyThree}
                total={UpThree + LowThree}
              />
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <NumTable
              title="เลข 2 ตัว"
              accent="indigo"
              rows={listTwo}
              limitint={limitint}
              onEdit={(el) =>
                handleEdit(el.id, el.priceLower, el.priceUpper, el.num, "two")
              }
              onDeleteZero={deleteZero}
            />
            <NumTable
              title="เลข 3 ตัว"
              accent="amber"
              rows={listThree}
              limitint={limitint}
              onEdit={(el) =>
                handleEdit(el.id, el.priceLower, el.priceUpper, el.num, "three")
              }
              onDeleteZero={deleteZero}
            />
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        data={EditData}
        onSaved={refreshAll}
      />
    </main>
  );
};

export default Home;

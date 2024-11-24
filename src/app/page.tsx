"use client";

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react';
import { Gloria_Hallelujah } from "next/font/google";
import { BsArrowLeft, BsArrowRight, BsClipboard2, BsClipboard2Check, BsPencil, BsPlusCircle, BsTrash } from 'react-icons/bs';

const gloriaHallelujah = Gloria_Hallelujah({ weight: ["400"], subsets: ["latin"] });

const perc = (part: number, whole: number) => {
  if (isNaN(part / whole)) return "0%";
  return `${((part / whole) * 100).toFixed(2)}%`;
}

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}

function Page() {
  const searchParams = useSearchParams();
  let title = searchParams.get("title");
  let legend = searchParams.get("legend");
  let fridge = searchParams.get("fridge");
  let emergency = searchParams.get("emergency");
  let progress = searchParams.get("progress");
  let test = searchParams.get("test");
  let complete = searchParams.get("complete");
  const router = useRouter();
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || "Change the title");
  const [addedClipboard, setAddedClipboard] = useState(false);
  const [showAddLegend, setShowAddLegend] = useState(false);
  const [elementEdition, setElementEdition] = useState({
    show: false,
    category: "",
    index: -1,
    name: "",
    color: "",
  });

  const editElement = (category: string, index: number) => {
    setElementEdition({
      show: true,
      category,
      index,
      name: categories[category][index].split(">>")[1],
      color: categories[category][index].split(">>")[0]
    });
  }

  const addToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  }

  const [categories, setCategories] = useState<Record<string, string[]>>({
    legend: [],
    fridge: [],
    emergency: [],
    progress: [],
    test: [],
    complete: []
  });

  useEffect(() => {
    router.push(`?title=${currentTitle}&legend=${categories.legend.join(",")}&fridge=${categories.fridge.join(",")}&emergency=${categories.emergency.join(",")}&progress=${categories.progress.join(",")}&test=${categories.test.join(",")}&complete=${categories.complete.join(",")}`);
  }, [categories, currentTitle]);

  useEffect(() => {
    if (legend) setCategories((prev) => ({ ...prev, legend: legend.split(",") }));
    if (fridge) setCategories((prev) => ({ ...prev, fridge: fridge.split(",") }));
    if (emergency) setCategories((prev) => ({ ...prev, emergency: emergency.split(",") }));
    if (progress) setCategories((prev) => ({ ...prev, progress: progress.split(",") }));
    if (test) setCategories((prev) => ({ ...prev, test: test.split(",") }));
    if (complete) setCategories((prev) => ({ ...prev, complete: complete.split(",") }));
  }, [legend, fridge, emergency, progress, test, complete]);

  const maxRows = Math.max(
    categories.legend.length,
    categories.fridge.length,
    categories.emergency.length,
    categories.progress.length,
    categories.test.length,
    categories.complete.length
  );

  const removeElement = (currentCategory: string, rowIndex: number) => {
    const copy = JSON.parse(JSON.stringify(categories));
    copy[currentCategory].splice(rowIndex, 1);
    setCategories(copy);
  }

  const changeCategory = (currentCategory: string, rowIndex: number, newCategory: string) => {
    const copy = JSON.parse(JSON.stringify(categories));
    const element = copy[currentCategory][rowIndex];
    copy[currentCategory].splice(rowIndex, 1);
    copy[newCategory].push(element);
    setCategories(copy);
  }

  return (
    <main className="p-4 bg-gradient-to-b from-black to-gray-800 min-h-screen">
      <table className="hidden lg:table mx-auto mt-8 w-full text-[8px] lg:text-base text-white">
        <thead>
          <tr>
            <th colSpan={6} className="border p-4 rounded-xl">
              <input type="text" className={`bg-transparent text-white text-center rounded-xl text-2xl lg:text-6xl ${gloriaHallelujah.className}`} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} />
            </th>
          </tr>
          <tr>
            <th className="border p-4">Legend</th>
            <th className="border p-4 bg-blue-800 text-white">Fridge</th>
            <th className="border p-4 bg-red-800 text-white">Emergency</th>
            <th className="border p-4 bg-yellow-800 text-white">Progress</th>
            <th className="border p-4 bg-purple-800 text-white">Test</th>
            <th className="border p-4 bg-green-800 text-white">Complete</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-4">
                <Legend
                  name={categories.legend[rowIndex] || ""}
                  currentCategory="legend"
                  rowIndex={rowIndex}
                  removeElement={removeElement}
                />
              </td>
              <td className="border p-4">
                <Controls
                  name={categories.fridge[rowIndex] || ""}
                  currentCategory="fridge"
                  nextCategory="emergency"
                  rowIndex={rowIndex}
                  changeCategory={changeCategory}
                  removeElement={removeElement}
                  editElement={editElement}
                />
              </td>
              <td className="border p-4">
                <Controls
                  name={categories.emergency[rowIndex] || ""}
                  currentCategory="emergency"
                  previousCategory="fridge"
                  nextCategory="progress"
                  rowIndex={rowIndex}
                  changeCategory={changeCategory}
                  removeElement={removeElement}
                  editElement={editElement}
                />
              </td>
              <td className="border p-4">
                <Controls
                  name={categories.progress[rowIndex] || ""}
                  currentCategory="progress"
                  previousCategory="emergency"
                  nextCategory="test"
                  rowIndex={rowIndex}
                  changeCategory={changeCategory}
                  removeElement={removeElement}
                  editElement={editElement}
                />
              </td>
              <td className="border p-4">
                <Controls
                  name={categories.test[rowIndex] || ""}
                  currentCategory="test"
                  previousCategory="progress"
                  nextCategory="complete"
                  rowIndex={rowIndex}
                  changeCategory={changeCategory}
                  removeElement={removeElement}
                  editElement={editElement}
                />
              </td>
              <td className="border p-4">
                <Controls
                  name={categories.complete[rowIndex] || ""}
                  currentCategory="complete"
                  previousCategory="test"
                  rowIndex={rowIndex}
                  changeCategory={changeCategory}
                  removeElement={removeElement}
                  editElement={editElement}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-center border p-4 cursor-pointer" onClick={() => setShowAddLegend(true)}><BsPlusCircle className="inline text-4xl hover:scale-95" /></td>
            <td colSpan={5} className="text-center border p-4 cursor-pointer" onClick={() => setShowAddTask(true)}><BsPlusCircle className="inline text-4xl hover:scale-95" /></td>
          </tr>
        </tfoot>
      </table>

      {/* start responsive block */}
      <div className="lg:hidden">
        <input type="text" className={`bg-transparent text-white text-center rounded-xl text-3xl lg:text-6xl mx-auto block mt-4 mb-8 ${gloriaHallelujah.className}`} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} />

        <div className="border p-4 rounded-xl flex justify-around items-center">
          <div className="text-center cursor-pointer text-white flex gap-2 items-center" onClick={() => setShowAddLegend(true)}>
            <BsPlusCircle className="inline text-4xl hover:scale-95" />
            <span>Legenda</span>
          </div>
          <div className="text-center cursor-pointer text-white flex gap-2 items-center" onClick={() => setShowAddTask(true)}>
            <BsPlusCircle className="inline text-4xl hover:scale-95" />
            <span>Tarefa</span>
          </div>
        </div>

        <div className="border rounded-xl my-8 pb-4">
          <h3 className="text-white rounded-t-xl p-4 text-center text-2xl font-bold bg-black">Legenda</h3>
          {
            categories.legend.map((elem, i) => {
              return (
                <div key={i} className="my-4">
                  <Legend
                    name={elem}
                    currentCategory="legend"
                    rowIndex={i}
                    removeElement={removeElement}
                  />
                </div>
              )
            })
          }
        </div>

        <div className="border rounded-xl my-8 pb-4">
          <h3 className="text-white rounded-t-xl p-4 text-center text-2xl font-bold bg-blue-800">Fridge</h3>
          {
            categories.fridge.map((elem, i) => {
              return (
                <div key={i} className="my-4">
                  <Controls
                    name={elem}
                    currentCategory="fridge"
                    nextCategory="emergency"
                    rowIndex={i}
                    changeCategory={changeCategory}
                    removeElement={removeElement}
                    editElement={editElement}
                  />
                </div>
              )
            })
          }
        </div>

        <div className="border rounded-xl my-8 pb-4">
          <h3 className="text-white rounded-t-xl p-4 text-center text-2xl font-bold bg-red-800">Emergency</h3>
          {
            categories.emergency.map((elem, i) => {
              return (
                <div key={i} className="my-4">
                  <Controls
                    name={elem}
                    currentCategory="emergency"
                    previousCategory="fridge"
                    nextCategory="progress"
                    rowIndex={i}
                    changeCategory={changeCategory}
                    removeElement={removeElement}
                    editElement={editElement}
                  />
                </div>
              )
            })
          }
        </div>

        <div className="border rounded-xl my-8 pb-4">
          <h3 className="text-white rounded-t-xl p-4 text-center text-2xl font-bold bg-yellow-800">Progress</h3>
          {
            categories.progress.map((elem, i) => {
              return (
                <div key={i} className="my-4">
                  <Controls
                    name={elem}
                    currentCategory="progress"
                    previousCategory="emergency"
                    nextCategory="test"
                    rowIndex={i}
                    changeCategory={changeCategory}
                    removeElement={removeElement}
                    editElement={editElement}
                  />
                </div>
              )
            })
          }
        </div>

        <div className="border rounded-xl my-8 pb-4">
          <h3 className="text-white rounded-t-xl p-4 text-center text-2xl font-bold bg-purple-800">Test</h3>
          {
            categories.test.map((elem, i) => {
              return (
                <div key={i} className="my-4">
                  <Controls
                    name={elem}
                    currentCategory="test"
                    previousCategory="progress"
                    nextCategory="complete"
                    rowIndex={i}
                    changeCategory={changeCategory}
                    removeElement={removeElement}
                    editElement={editElement}
                  />
                </div>
              )
            })
          }
        </div>

        <div className="border rounded-xl my-8 pb-4">
          <h3 className="text-white rounded-t-xl p-4 text-center text-2xl font-bold bg-green-800">Complete</h3>
          {
            categories.complete.map((elem, i) => {
              return (
                <div key={i} className="my-4">
                  <Controls
                    name={elem}
                    currentCategory="complete"
                    previousCategory="test"
                    rowIndex={i}
                    changeCategory={changeCategory}
                    removeElement={removeElement}
                    editElement={editElement}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
      {/* end responsive block */}

      <div className="text-white border rounded-xl p-4 mt-8">
        <p className="text-center my-4 font-bold lg:text-2xl">Progress: {perc(categories.complete.length, (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length))}</p>
        <p className="text-center my-4 font-bold lg:text-2xl">Progress with tests: {perc((categories.complete.length + categories.test.length), (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length))}</p>
        <p className="text-center my-4 font-bold lg:text-2xl">Danger: {perc(categories.emergency.length, (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length))}</p>
      </div>

      {
        elementEdition.show && (
          <div className="bg-black bg-opacity-90 fixed top-0 left-0 h-screen w-full flex items-center justify-center" onClick={() => setElementEdition({...elementEdition, show: false})}>
            <div className="bg-black border text-white p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
              <form
                action={(formData: FormData) => {
                  const task = formData.get("task") as string;
                  const color = formData.get("color") as string;
                  const copy = JSON.parse(JSON.stringify(categories));
                  copy[elementEdition.category].splice(elementEdition.index, 1, `${color.replaceAll("#", "")}>>${task}`);
                  setCategories(copy);
                  setElementEdition({name: "", category: "", index: -1, color: "", show: false});
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="task">Tarefa</label>
                  <input type="text" name="task" id="task" className="rounded-xl p-2 border bg-black outline-blue-800" defaultValue={elementEdition.name} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="color">Cor</label>
                  <input type="color" name="color" id="color" className="w-full bg-black outline-blue-800 h-12 cursor-pointer hover:scale-95" defaultValue={'#' + elementEdition.color} />
                </div>
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Editar</button>
              </form>
            </div>
          </div>
        )
      }

      {
        showAddTask && (
          <div className="bg-black bg-opacity-90 fixed top-0 left-0 h-screen w-full flex items-center justify-center" onClick={() => setShowAddTask(false)}>
            <div className="bg-black border text-white p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
              <form
                action={(formData: FormData) => {
                  const task = formData.get("task") as string;
                  const color = formData.get("color") as string;
                  setCategories({ ...categories, fridge: [...categories.fridge, `${color.replaceAll("#", "")}>>${task}`] });
                  setShowAddTask(false);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="task">Tarefa</label>
                  <input type="text" name="task" id="task" className="rounded-xl p-2 border bg-black outline-blue-800" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="color">Cor</label>
                  <input type="color" name="color" id="color" className="w-full bg-black outline-blue-800 h-12 cursor-pointer hover:scale-95" />
                </div>
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Adicionar</button>
              </form>
            </div>
          </div>
        )
      }

      {
        showAddLegend && (
          <div className="bg-black bg-opacity-90 fixed top-0 left-0 h-screen w-full flex items-center justify-center" onClick={() => setShowAddLegend(false)}>
            <div className="bg-black border text-white p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
              <form
                action={(formData: FormData) => {
                  const legend = formData.get("legend") as string;
                  const color = formData.get("color") as string;
                  setCategories({ ...categories, legend: [...categories.legend, `${color.replaceAll("#", "")}>>${legend}`] });
                  setShowAddLegend(false);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="legend">Legenda</label>
                  <input type="text" name="legend" id="legend" className="rounded-xl p-2 border bg-black outline-blue-800" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="color">Cor</label>
                  <input type="color" name="color" id="color" className="w-full bg-black outline-blue-800 h-12 cursor-pointer hover:scale-95" />
                </div>
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Adicionar</button>
              </form>
            </div>
          </div>
        )
      }

      {
        addedClipboard ? (
          <BsClipboard2Check className="fixed bottom-2 right-2 text-green-50 text-4xl hover:scale-95 cursor-pointer" />
        ) : (
          <BsClipboard2 className="fixed bottom-2 right-2 text-white text-4xl hover:scale-95 cursor-pointer" onClick={() => {
            setAddedClipboard(true);
            addToClipboard();
            setTimeout(() => {
              setAddedClipboard(false)
            }, 2000);
          }} />
        )
      }
    </main>
  );
}

function Legend({ name, currentCategory, rowIndex, removeElement }: { name: string, currentCategory: string, rowIndex: number, removeElement: Function }) {
  if (name === "") return <></>;
  return (
    <span className="text-center flex flex-col items-center justify-center px-16 py-2 rounded-xl text-white relative group border break-words max-w-[300px] mx-auto">
      <span className="flex gap-2 items-center">
        <span style={{ backgroundColor: name.split(">>").length === 1 ? "#111" : name.split(">>")[0] }} className="w-4 h-4 block border"></span>
        <span>{name.split(">>").length === 1 ? name.split(">>")[0] : name.split(">>")[1]}</span>
      </span>
      <span className="hover:scale-105 cursor-pointer absolute top-1/2 right-8 -translate-y-1/2 group-hover:opacity-100 opacity-0" onClick={() => removeElement(currentCategory, rowIndex)}><BsTrash /></span>
    </span>
  )
}

function Controls({ name, currentCategory, previousCategory, nextCategory, rowIndex, changeCategory, removeElement, editElement }: { name: string, currentCategory: string, previousCategory?: string, nextCategory?: string, rowIndex: number, changeCategory: Function, removeElement: Function, editElement: Function }) {
  if (name === "") return <></>;
  return (
    <span className="text-center flex flex-col items-center justify-center px-16 py-2 rounded-xl text-white relative group border break-words max-w-[300px] mx-auto" style={{ backgroundColor: name.split(">>").length === 1 ? "#111" : '#' + name.split(">>")[0] }}>
      <span>{name.split(">>").length === 1 ? name.split(">>")[0] : name.split(">>")[1]}</span>
      <span className="absolute flex gap-2 items-center bg-black text-white p-2 rounded-xl -top-full right-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {
          previousCategory && (
            <span className="cursor-pointer hover:scale-110" onClick={() => changeCategory(currentCategory, rowIndex, previousCategory)}><BsArrowLeft /></span>
          )
        }
        {
          nextCategory && (
            <span className="cursor-pointer hover:scale-110" onClick={() => changeCategory(currentCategory, rowIndex, nextCategory)}><BsArrowRight /></span>
          )
        }
        <span className="cursor-pointer hover:scale-110" onClick={() => removeElement(currentCategory, rowIndex)}><BsTrash /></span>
        <span className="cursor-pointer hover:scale-110" onClick={() => editElement(currentCategory, rowIndex)}><BsPencil /></span>
      </span>
    </span>
  )
}
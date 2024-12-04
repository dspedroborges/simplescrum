"use client";

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react';
import { Gloria_Hallelujah } from "next/font/google";
import { BsArrowLeft, BsArrowRight, BsClipboard2, BsClipboard2Check, BsPencil, BsPlusCircle, BsTrash } from 'react-icons/bs';

const gloriaHallelujah = Gloria_Hallelujah({ weight: ["400"], subsets: ["latin"] });

const perc = (part: number, whole: number) => {
  if (isNaN(part / whole)) return 0;
  return Number(((part / whole) * 100).toFixed(2));
}

const saveURL = (title: string, url: string, progress: number) => {
  let urls = JSON.parse(localStorage.getItem("urls") || "[]");
  let index = -1;
  for (let i = 0; i < urls.length; i++) {
    if (urls[i].title === title) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    urls[index] = { ...urls[index], url, progress, lastUpdate: new Date().toLocaleDateString() };
  } else {
    urls.push({
      title,
      url,
      progress,
      lastUpdate: new Date().toLocaleDateString()
    });
  }

  if (title !== "null" && title !== "Change the title") {
    localStorage.setItem("urls", JSON.stringify(urls));
  }
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
    console.log('Perc: ' + perc(categories.complete.length, (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length)))
    saveURL(String(title), window.location.href, perc(categories.complete.length, (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length)));
  }, [categories]);

  useEffect(() => {
    if (legend) setCategories((prev) => ({ ...prev, legend: legend.split(",") }));
    if (fridge) setCategories((prev) => ({ ...prev, fridge: fridge.split(",") }));
    if (emergency) setCategories((prev) => ({ ...prev, emergency: emergency.split(",") }));
    if (progress) setCategories((prev) => ({ ...prev, progress: progress.split(",") }));
    if (test) setCategories((prev) => ({ ...prev, test: test.split(",") }));
    if (complete) setCategories((prev) => ({ ...prev, complete: complete.split(",") }));
  }, [title, legend, fridge, emergency, progress, test, complete]);

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
    <main>
      <table className="hidden lg:table mx-auto mt-8 w-full text-[8px] lg:text-base text-white">
        <thead>
          <tr>
            <th colSpan={6} className="border p-4 rounded-xl">
              <input type="text" className={`bg-transparent text-white text-center rounded-xl text-2xl lg:text-6xl ${gloriaHallelujah.className}`} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} />
            </th>
          </tr>
          <tr>
            <th className="border p-4 bg-gray-800 hover:brightness-125">Legend</th>
            <th className="border p-4 bg-blue-800 text-white hover:brightness-125">Fridge</th>
            <th className="border p-4 bg-red-800 text-white hover:brightness-125">Emergency</th>
            <th className="border p-4 bg-yellow-800 text-white hover:brightness-125">Progress</th>
            <th className="border p-4 bg-purple-800 text-white hover:brightness-125">Test</th>
            <th className="border p-4 bg-green-800 text-white hover:brightness-125">Complete</th>
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
                  editElement={editElement}
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
                    editElement={editElement}
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
        <p className="text-center my-4 font-bold lg:text-2xl">Progress: {perc(categories.complete.length, (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length))}%</p>
        <p className="text-center my-4 font-bold lg:text-2xl">Progress with tests: {perc((categories.complete.length + categories.test.length), (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length))}%</p>
        <p className="text-center my-4 font-bold lg:text-2xl">Danger: {perc(categories.emergency.length, (categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length))}%</p>
      </div>

      {
        elementEdition.show && (
          <div className="bg-black bg-opacity-90 fixed top-0 left-0 h-screen w-full flex items-center justify-center" onClick={() => setElementEdition({ ...elementEdition, show: false })}>
            <div className="bg-black border text-white p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
              <form
                action={(formData: FormData) => {
                  const title = formData.get("title") as string;
                  const color = formData.get("color") as string;
                  const copy = JSON.parse(JSON.stringify(categories));
                  copy[elementEdition.category].splice(elementEdition.index, 1, `${color.replaceAll("#", "")}>>${title}`);
                  setCategories(copy);
                  setElementEdition({ name: "", category: "", index: -1, color: "", show: false });
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="title">Title:</label>
                  <input type="title" name="title" id="title" className="rounded-xl p-2 border bg-black outline-blue-800" defaultValue={elementEdition.name} />
                </div>
                <ColorPicker defaultValue={elementEdition.color} />
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Update</button>
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
                  <label className="font-bold cursor-pointer" htmlFor="task">Task</label>
                  <input type="text" name="task" id="task" className="rounded-xl p-2 border bg-black outline-blue-800" />
                </div>
                <ColorPicker />
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Add</button>
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
                  <label className="font-bold cursor-pointer" htmlFor="legend">Legend</label>
                  <input type="text" name="legend" id="legend" className="rounded-xl p-2 border bg-black outline-blue-800" />
                </div>
                <ColorPicker />
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Add</button>
              </form>
            </div>
          </div>
        )
      }

      {
        addedClipboard ? (
          <BsClipboard2Check title="URL copied to clipboard" className="fixed bottom-2 right-2 text-green-50 text-4xl hover:scale-95 cursor-pointer" />
        ) : (
          <BsClipboard2 title="Copy URL to clipboard" className="fixed bottom-2 right-2 text-white text-4xl hover:scale-95 cursor-pointer" onClick={() => {
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

function Legend({ name, currentCategory, rowIndex, removeElement, editElement }: { name: string, currentCategory: string, rowIndex: number, removeElement: Function, editElement: Function }) {
  const [showDelete, setShowDelete] = useState(false);
  if (name === "") return <></>;
  return (
    <span className="text-center flex flex-col items-center justify-center text-white relative group break-words hover:outline cursor-pointer mx-auto max-w-[250px]">
      <span className="flex gap-2 items-center">
        <span style={{ backgroundColor: name.split(">>").length === 1 ? "#111" : name.split(">>")[0] }} className="w-4 h-4 block border"></span>
        <span>{name.split(">>").length === 1 ? name.split(">>")[0] : name.split(">>")[1]}</span>
      </span>

      <span className="absolute flex gap-2 items-center bg-black text-white p-2 rounded-xl -top-full right-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {
          showDelete ? (
            <span className="cursor-pointer hover:scale-110 text-red-500" onClick={() => removeElement(currentCategory, rowIndex)}><BsTrash /></span>
          ) : (
            <span className="cursor-pointer hover:scale-110" onClick={() => {
              setShowDelete(true);
              setTimeout(() => {
                setShowDelete(false);
              }, 2000);
            }}><BsTrash /></span>
          )
        }
        <span className="cursor-pointer hover:scale-110" onClick={() => editElement(currentCategory, rowIndex)}><BsPencil /></span>
      </span>

    </span>
  )
}

function Controls({ name, currentCategory, previousCategory, nextCategory, rowIndex, changeCategory, removeElement, editElement }: { name: string, currentCategory: string, previousCategory?: string, nextCategory?: string, rowIndex: number, changeCategory: Function, removeElement: Function, editElement: Function }) {
  const [showDelete, setShowDelete] = useState(false);
  if (name === "") return <></>;
  return (
    <span className="text-center flex flex-col items-center justify-center px-16 py-2 rounded-xl text-white relative group border break-words max-w-[300px] mx-auto" style={{ backgroundColor: name.split(">>").length === 1 ? "#111" : name.split(">>")[0] }}>
      <span>{name.split(">>").length === 1 ? name.split(">>")[0] : name.split(">>")[1]}</span>
      <span className="absolute flex gap-2 items-center bg-black text-white p-2 rounded-xl -top-6 border -right-6 opacity-0 group-hover:opacity-100 transition-opacity">
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
        {
          showDelete ? (
            <span className="cursor-pointer hover:scale-110 text-red-500" onClick={() => removeElement(currentCategory, rowIndex)}><BsTrash /></span>
          ) : (
            <span className="cursor-pointer hover:scale-110" onClick={() => {
              setShowDelete(true);
              setTimeout(() => {
                setShowDelete(false);
              }, 2000);
            }}><BsTrash /></span>
          )
        }
        <span className="cursor-pointer hover:scale-110" onClick={() => editElement(currentCategory, rowIndex)}><BsPencil /></span>
      </span>
    </span>
  )
}

function ColorPicker({ defaultValue }: { defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultValue);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (inputRef.current) {
      inputRef.current.value = color;
    }
  };

  const colors = ["purple", "goldenrod", "tomato", "darkgreen", "dodgerblue", "saddlebrown", "coral", "teal"];

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold cursor-pointer" htmlFor="color">
        Color:
      </label>
      <input
        ref={inputRef}
        type="text"
        name="color"
        id="color"
        className="hidden"
        defaultValue={defaultValue}
      />
      <div className="grid grid-cols-4 gap-2 justify-items-center">
        {colors.map((color) => (
          <span
            key={color}
            className={`hover:scale-110 cursor-pointer w-4 h-4 ${selectedColor === color ? "border-2" : ""
              }`}
            style={{ background: color }}
            onClick={() => handleColorChange(color)}
          ></span>
        ))}
      </div>
    </div>
  );
}
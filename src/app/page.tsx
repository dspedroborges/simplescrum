"use client";

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Home() {
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
  const [currentTitle, setCurrentTitle] = useState(title || "");

  const [categories, setCategories] = useState<Record<string, string[]>>({
    legend: [],
    fridge: [],
    emergency: [],
    progress: [],
    test: [],
    complete: []
  });

  useEffect(() => {
    if (legend) setCategories((prev) => ({ ...prev, legend: legend.split(",") }));
    if (fridge) setCategories((prev) => ({ ...prev, fridge: fridge.split(",") }));
    if (emergency) setCategories((prev) => ({ ...prev, emergency: emergency.split(",") }));
    if (progress) setCategories((prev) => ({ ...prev, progress: progress.split(",") }));
    if (test) setCategories((prev) => ({ ...prev, test: test.split(",") }));
    if (complete) setCategories((prev) => ({ ...prev, complete: complete.split(",") }));
  }, [fridge, emergency, progress, test, complete]);

  useEffect(() => {
    router.push(`?title=${currentTitle}&legend=${categories.legend.join(",")}&fridge=${categories.fridge.join(",")}&emergency=${categories.emergency.join(",")}&progress=${categories.progress.join(",")}&test=${categories.test.join(",")}&complete=${categories.complete.join(",")}`);
  }, [categories, currentTitle]);

  const maxRows = Math.max(
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
    <>
      <table className="mx-auto mt-8">
        <thead>
          <tr>
            <th colSpan={5} className="border p-4">
              <input type="text" value={currentTitle || "Altere o título"} onChange={(e) => setCurrentTitle(e.target.value)} className="text-center" />
            </th>
          </tr>
          <tr>
            {/* <th className="border p-4">Legenda</th> */}
            <th className="border p-4">Geladeira</th>
            <th className="border p-4 bg-red-600 text-white">Emergência</th>
            <th className="border p-4">Progresso</th>
            <th className="border p-4">Teste</th>
            <th className="border p-4 bg-green-600 text-white">Completo</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {/* <td className="border p-4">{categories.legend[rowIndex] || ""}</td> */}
              <td className="border p-4">
                <Controls
                  name={categories.fridge[rowIndex] || ""}
                  currentCategory="fridge"
                  nextCategory="emergency"
                  rowIndex={rowIndex}
                  changeCategory={changeCategory}
                  removeElement={removeElement}
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
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {/* <td className="border p-4">Adicionar</td> */}
            <td colSpan={6} className="text-center border p-4 cursor-pointer" onClick={() => setShowAddTask(true)}>➕</td>
          </tr>
        </tfoot>
      </table>
      
      <p className="text-center my-4 font-bold text-2xl">Progresso: {(categories.complete.length/(categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length)*100).toFixed(2)}%</p>
      <p className="text-center my-4 font-bold text-2xl">Progresso com testes: {((categories.complete.length+categories.test.length)/(categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length)*100).toFixed(2)}%</p>
      <p className="text-center my-4 font-bold text-2xl">Perigo: {(categories.emergency.length/(categories.complete.length + categories.fridge.length + categories.emergency.length + categories.progress.length + categories.test.length)*100).toFixed(2)}%</p>

      {
        showAddTask && (
          <div className="bg-black bg-opacity-80 fixed top-0 left-0 h-screen w-full flex items-center justify-center" onClick={() => setShowAddTask(false)}>
            <div className="bg-white p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
              <form
                action={(formData: FormData) => {
                  const task = formData.get("task") as string;
                  setCategories({ ...categories, fridge: [...categories.fridge, task] });
                  setShowAddTask(false);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-bold cursor-pointer" htmlFor="task">Tarefa</label>
                  <input type="text" name="task" id="task" className="rounded-xl p-2 border outline-blue-800" />
                </div>
                <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white w-full">Adicionar</button>
              </form>
            </div>
          </div>
        )
      }

      {/* <form>
        <div className="flex flex-col gap-2">
          <label className="font-bold cursor-pointer" htmlFor="legend">Legenda</label>
          <input type="legend" name="legend" id="legend" className="rounded-xl p-2 border outline-blue-800" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold cursor-pointer" htmlFor="color">Cor</label>
          <input type="color" name="color" id="color" />
        </div>
        <button className="bg-blue-900 hover:bg-blue-800 rounded-full px-4 py-2 text-white">Adicionar</button>
      </form> */}

    </>
  );
}

function Controls({ name, color, currentCategory, previousCategory, nextCategory, rowIndex, changeCategory, removeElement }: { name: string, color?: string, currentCategory: string, previousCategory?: string, nextCategory?: string, rowIndex: number, changeCategory: Function, removeElement: Function }) {
  if (name === "") return <></>;
  return (
    <span className="text-center flex flex-col items-center justify-center p-2 rounded-xl" style={{ backgroundColor: color ? color : "#eee" }}>
      <span>{name}</span>
      <span className="flex gap-2">
        {
          previousCategory && (
            <span className="hover:scale-105 cursor-pointer" onClick={() => changeCategory(currentCategory, rowIndex, previousCategory)}>⬅️</span>
          )
        }
        {
          nextCategory && (
            <span className="hover:scale-105 cursor-pointer" onClick={() => changeCategory(currentCategory, rowIndex, nextCategory)}>➡️</span>
          )
        }
        <span className="hover:scale-105 cursor-pointer" onClick={() => removeElement(currentCategory, rowIndex)}>🗑️</span>
      </span>
    </span>
  )
}
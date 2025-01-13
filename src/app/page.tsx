"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const router = useRouter();

  interface Todo { // 타입 정의
    id: number;
    name: string;
    isCompleted: boolean;
    }
  

  // API에서 데이터 가져오기
  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://assignment-todolist-api.vercel.app/api/egg/items?page=1&pageSize=10"
      );
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 새로운 할 일 추가
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await fetch(
          "https://assignment-todolist-api.vercel.app/api/egg/items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newTodo }),
          }
        );
        const addedTodo = await response.json();
        setTodos((prevTodos) => [...prevTodos, addedTodo]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  // 할 일 상태 업데이트 (체크박스 클릭)
  const handleCheckboxClick = async (id: number, isCompleted: boolean) => {
    try {
      const response = await fetch(
        `https://assignment-todolist-api.vercel.app/api/egg/items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted: !isCompleted }),
        }
      );
      if (!response.ok) throw new Error("Failed to update item");

      const updatedTodo: Todo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: updatedTodo.isCompleted } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 엔터 키 핸들링
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  // TODO와 DONE으로 분류
  const todosInProgress = todos.filter((todo) => !todo.isCompleted);
  const todosCompleted = todos.filter((todo) => todo.isCompleted);

  // 상세 페이지로 이동 (글씨 클릭)
  const navigateToDetail = (id: number) => {
    router.push(`/items/${id}`);
  };

  return (
    <div className="w-full min-h-100% flex justify-center items-start text-[#1E293b]">
      <div className="flex flex-col relative w-full h-[56px] mt-[24px] pl-[16px] pr-[16px] md:pl-[24px] md:pr-[24px] lg:pl-[calc(100vw*0.1875)] lg:pr-[calc(100vw*0.1875)]">
        <div className="flex h-[56px] justify-between">
          <input
            type="text"
            placeholder="할 일을 입력해주세요"
            className="w-full rounded-[24px] border-2 border-[#0f172a] bg-[#f1f5f9] pl-4 pr-4"
            style={{ boxShadow: "4px 3px #0f172a" }}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="w-[62px] h-[56px] ml-4 rounded-[24px] border-2 border-[#0f172a] bg-[#E2E8F0] text-[#0f172a] font-bold md:w-[168px] md:h-[56px] hover:bg-[#7C3AED] hover:text-[#ffffff]"
            style={{ boxShadow: "4px 3px #0f172a" }}
            onClick={handleAddTodo}
          >
            <span className="block md:hidden">+</span>
            <span className="hidden md:block">+ 추가하기</span>
          </button>
        </div>

        <div className="lg:flex w-full justify-between flex-grow pb-[100px]">
          {/* TO DO 리스트 */}
          <div className="relative w-full lg:w-[calc(50%-16px)] h-auto mb-4 lg:mb-0 lg:mr-5 top-[40px]">
            <div className="w-[101px] h-[36px] mt-[4px] rounded-[23px] bg-[#bef264] text-[#15803d] flex items-center justify-center font-bold">
              TO DO
            </div>
            <div className="flex flex-col items-center justify-center">
              {todosInProgress.length === 0 ? (
                <div>
                  <img
                    src="/no-todo.png"
                    alt="No Todo"
                    className="w-[120px] h-[120px] md:w-[240px] md:h-[240px] mb-4"
                  />
                  <p className="text-[#94A3B8] font-16px text-center">
                    할 일이 없어요.
                    <br />
                    TODO를 새롭게 추가해주세요!
                  </p>
                </div>
              ) : (
                todosInProgress.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center mt-4 w-full border-2 border-[#0F172A] rounded-[27px] bg-white p-2"
                  >
                    <input
                      type="checkbox"
                      className="appearance-none w-[32px] h-[32px] rounded-full border-2 border-[#0F172A] bg-[#FEFCE8] mr-4 flex-shrink-0"
                      checked={todo.isCompleted}
                      onChange={() => handleCheckboxClick(todo.id, todo.isCompleted)}
                    />
                    <span
                      className="flex-grow cursor-pointer"
                      onClick={() => navigateToDetail(todo.id)}
                    >
                      {todo.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DONE 리스트 */}
          <div className="relative w-full lg:w-[calc(50%-16px)] h-auto top-[60px] lg:top-[40px] mr-0">
            <div className="w-[101px] h-[36px] mt-[4px] rounded-[23px] bg-[#15803d] text-[#FCD34D] flex items-center justify-center font-bold">
              DONE
            </div>
            <div className="flex flex-col items-center justify-center">
              {todosCompleted.length === 0 ? (
                <div>
                  <img
                    src="/no-done.png"
                    alt="No Done"
                    className="w-[120px] h-[120px] md:w-[240px] md:h-[240px] mb-4"
                  />
                  <p className="text-[#94A3B8] font-16px text-center">
                    아직 다 한 일이 없어요.
                    <br />
                    해야 할 일을 체크해보세요!
                  </p>
                </div>
              ) : (
                todosCompleted.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center mt-4 w-full border-2 border-[#0F172A] rounded-[27px] bg-[#EDE9FE] p-2"
                  >
                    <input
                      type="checkbox"
                      className="appearance-none w-[32px] h-[32px] rounded-full bg-[#7C3AED] border-none bg-[url('/check.png')] bg-[length:20px_15px] bg-no-repeat bg-center mr-4 flex-shrink-0"
                      checked={todo.isCompleted}
                      onChange={() => handleCheckboxClick(todo.id, todo.isCompleted)}
                    />
                    <span
                      className="line-through flex-grow cursor-pointer"
                      onClick={() => navigateToDetail(todo.id)}
                    >
                      {todo.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

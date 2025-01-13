"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ItemDetailPage = () => {
    const params = useParams(); // Next.js의 useParams 훅 사용
    const [itemDetail, setItemDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false); // 체크박스 상태 관리
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 이미지 경로
    const [memo, setMemo] = useState<string>(""); // 메모 내용 관리
    const [isEditing, setIsEditing] = useState(false); // 체크박스 텍스트 수정 여부
    const [editedName, setEditedName] = useState(itemDetail?.name || ""); // 수정할 이름
    const router = useRouter(); // 메인 페이지 이동 시 사용

    useEffect(() => {
        if (!params.id) return; // params.id가 존재하는 경우에만 실행

        const fetchItemDetail = async () => {
            try {
                const response = await fetch(
                    `https://assignment-todolist-api.vercel.app/api/egg/items/${params.id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch item details");
                }
                const data = await response.json();
                setItemDetail(data);
                setIsCompleted(data.isCompleted); // 초기 상태 설정
                setMemo(data.memo || ""); // 기존 메모 불러오기

                // 서버에서 받은 imageUrl이 있으면 상태에 설정
                if (data.imageUrl) {
                    setPreviewUrl(data.imageUrl); // imageUrl을 상태에 저장
                }
            } catch (error) {
                console.error("Error fetching item details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetail();
    }, [params.id]);

    // 이미지 업로드 함수
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileName = file.name;

        // 한글 포함 여부 확인 (유니코드 범위로 체크)
        const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(fileName);
        if (hasKorean) {
            alert("파일 이름에 한글이 포함되어 있습니다. 파일 이름을 영어로 변경해주세요.");
            return; // 업로드 중단
        }

        const formData = new FormData();
        formData.append("image", file); // 필드 이름 "image"로 설정

        try {
            // 이미지 업로드 API 요청
            const response = await fetch(
                "https://assignment-todolist-api.vercel.app/api/egg/images/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("이미지 업로드 실패");
            }

            const data = await response.json();
            console.log("Uploaded Image URL:", data.url); // 서버에서 받은 이미지 URL 확인
            setPreviewUrl(data.url); // 서버에서 반환된 이미지 URL 설정
        } catch (error) {
            console.error("이미지 업로드 오류:", error);
        }
    };

    // 항목 삭제 함수
    const handleDelete = async () => {
        try {
            const deleteResponse = await fetch(
                `https://assignment-todolist-api.vercel.app/api/egg/items/${itemDetail.id}`,
                {
                    method: "DELETE", // DELETE 메서드 사용
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!deleteResponse.ok) {
                throw new Error("아이템 삭제 실패");
            }

            const responseJson = await deleteResponse.json();
            alert(responseJson.message); // 삭제 성공 메시지 출력

            // 메인 화면으로 리디렉션
            router.push("/");
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // 체크박스 상태 변경 함수
    const handleCheckboxChange = () => {
        setIsCompleted(!isCompleted); // 체크박스 상태 토글
    };

    // 메모 변경 함수
    const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMemo(e.target.value);
    };

    // 텍스트 수정 함수
    const handleEditText = () => {
        setIsEditing(true); // 텍스트 수정 모드로 변경
    };

    // 텍스트 수정 완료 함수
    // const handleSaveEditedText = () => {
    //     setIsEditing(false);
    //     setItemDetail({ ...itemDetail, name: editedName || itemDetail.name }); // itemDetail에 editedName 반영
    // };

    if (loading) {
        return <div className=""></div>;
    }

    if (!itemDetail) {
        return <div>Item not found</div>;
    }

    return (
        <div className="w-full bg-white lg:bg-[#F9FAFB] min-h-100% flex justify-center items-start text-[#1E293b]">
            <div className="relative w-full h-screen bg-white lg:pr-[30px] lg:pl-[30px] ml-[16px] mr-[16px] md:ml-[24px] md:mr-[24px] lg:ml-[calc(100vw*0.1875)] lg:mr-[calc(100vw*0.1875)]">
                {/* 체크박스와 Name 표시 */}
                <div
                    className={`h-[64px] flex items-center justify-center underline font-bold text-[20px] mt-4 w-full border-2 border-[#0F172A] rounded-[27px] p-2 ${isCompleted
                        ? "bg-[#DDD6FE]"
                        : "bg-white"
                        }`}
                >
                    <input
                        type="checkbox"
                        className={`appearance-none w-[32px] h-[32px] rounded-full mr-4 flex-shrink-0 ${isCompleted
                            ? "bg-[#7C3AED] border-none bg-[url('/check.png')] bg-[length:20px_15px] bg-no-repeat bg-center"
                            : "border-2 border-[#0F172A] bg-[#FEFCE8]"
                            }`}
                        checked={isCompleted}
                        onChange={handleCheckboxChange} // 체크박스 상태 변경
                    />
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-[20%] bg-transparent border-none text-[#0F172A] text-[20px] font-bold focus:outline-none"
                        />
                    ) : (
                        <span onClick={handleEditText} className="cursor-pointer">
                            {itemDetail.name}
                        </span>
                    )}
                </div>

                <div className="lg:flex w-full justify-between flex-grow pb-[24px] mt-6">
                    {/* 첫 번째 컨테이너: 이미지 자리 */}
                    <div className="relative w-full h-[311px] lg:w-[40%] lg:mr-[24px] rounded-[24px] lg:w-[calc(50%-16px)] bg-[#F9FAFC] flex justify-center items-center border-dashed border-2">
                        {/* previewUrl이 설정되었을 때 해당 이미지를 사용 */}
                        {previewUrl ? (
                            <img
                                src={previewUrl} // previewUrl을 사용
                                alt="Item"
                                className="max-w-full max-h-full rounded-[24px]"
                            />
                        ) : itemDetail.imageUrl ? ( // previewUrl이 없을 경우 itemDetail에서 가져옵니다.
                            <img
                                src={itemDetail.imageUrl}
                                alt="Item"
                                className="max-w-full max-h-full rounded-[24px]"
                            />
                        ) : (
                            <img src="/img.png" alt="img_icon" className="w-[64px] h-[64px]" />
                        )}

                        {/* 이미지 첨부 버튼 */}
                        <button
                            className={`absolute bottom-[16px] right-[16px] w-[64px] h-[64px] rounded-full flex justify-center items-center ${previewUrl ? "border-2 border-[#0f172a] bg-[#0f172a] bg-opacity-50" : "bg-[#E2E8F0]"}`}
                            onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                            <img
                                src={previewUrl ? "/edit.png" : "/plus.png"}
                                alt="button_icon"
                                className="w-[18px] h-[18px]"
                            />
                        </button>

                        {/* 파일 미리보기 */}
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>


                    {/* 두 번째 컨테이너: 메모 이미지와 텍스트 */}
                    <div className="relative w-full h-[311px] lg:w-[60%] top-[24px] lg:top-0 lg:w-[calc(50%-16px)] bg-cover bg-center flex flex-col items-center justify-center">
                        <div className="absolute top-[24px] text-[#92400E] text-[16px] font-bold" style={{ zIndex: 10 }}>
                            Memo
                        </div>
                        <img
                            src="/memo.png"
                            alt="Memo"
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-[24px]"
                        />
                        <div className="absolute top-0 left-0 w-full h-full p-4 flex items-center justify-center z-20">
                            {/* 메모 내용 */}
                            <textarea
                                value={memo}
                                onChange={handleMemoChange} // 메모 내용 변경
                                className="w-full h-[229px] mt-[40px] bg-transparent text-[#1E293B] rounded-[12px] p-2 resize-none overflow-auto scrollbar-custom"
                                placeholder=""
                            />
                        </div>
                    </div>

                    {/* 스크롤바 커스텀 */}
                    <style jsx>{`
                        .scrollbar-custom::-webkit-scrollbar {
                            width: 4px;
                            height: 45px;
                        }
                        .scrollbar-custom::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .scrollbar-custom::-webkit-scrollbar-thumb {
                            background-color: #fde68a;
                            border-radius: 3px;
                        }`}
                    </style>


                </div>

                <div className="flex justify-center lg:justify-end pb-[100px] bg-white">
                    {/* 수정 완료 버튼 */}
                    <button
                        className="rounded-[24px] border-2 border-[#0f172a] bg-[#E2E8F0] text-[#0f172a] font-bold w-[168px] h-[56px] mt-[24px] lg:mt-0 hover:bg-[#BEF264]"
                        style={{ boxShadow: "4px 3px #0f172a" }}
                        onClick={async () => {
                            try {
                                const patchResponse = await fetch(
                                    `https://assignment-todolist-api.vercel.app/api/egg/items/${itemDetail.id}`,
                                    {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            name: editedName || itemDetail.name,
                                            memo: memo || "",
                                            imageUrl: previewUrl || "",
                                            isCompleted: isCompleted,
                                        }),
                                    }
                                );

                                if (!patchResponse.ok) {
                                    throw new Error("아이템 수정 실패");
                                }

                                alert("수정이 완료되었습니다!");

                                // 메인 화면으로 리디렉션
                                router.push("/");
                            } catch (error) {
                                console.error("수정 실패:", error);
                                alert("업로드 또는 수정에 실패했습니다.");
                            }
                        }}
                    >
                        <span>ｖ 수정 완료</span>
                    </button>

                    {/* 삭제하기 버튼 */}
                    <button
                        className="rounded-[24px] border-2 border-[#0f172a] bg-[#F43F5E] ml-[24px] text-white font-bold w-[168px] h-[56px] mt-[24px] lg:mt-0 hover:bg-[#dA0C30]"
                        style={{ boxShadow: "4px 3px #0f172a" }}
                        onClick={handleDelete}
                    >
                        <span>× 삭제하기</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;

'use client';
import Link from "next/link";

export default function Navigation() {
  const handleLogoClick = (event: React.MouseEvent) => {
    // 로고 클릭 시 새로 고침
    if (window.location.pathname === "/") {
      event.preventDefault(); // 링크 기본 동작을 막고
      window.location.reload(); // 새로 고침 실행
    }
  };

  return (
    <nav className="relative w-full h-[60px] bg-white">
      {/* 모바일 로고 */}
      <div className="absolute top-[9.71px] left-[16px] md:hidden">
        <Link href="/" passHref>
          <img
            src="/logo-todo-mobile.png"
            alt="Logo"
            width={71}
            height={40}
            onClick={handleLogoClick} // 클릭 시 새로 고침
          />
        </Link>
      </div>

      {/* 태블릿 및 데스크탑 로고 */}
      <div className="hidden md:block absolute top-[10px] left-[24px] lg:left-[calc(100vw*0.1875)]">
        <Link href="/" passHref>
          <img
            src="/logo-todo.png"
            alt="Logo"
            width={151}
            height={40}
            onClick={handleLogoClick} // 클릭 시 새로 고침
          />
        </Link>
      </div>
    </nav>
  );
}

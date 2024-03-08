import React from "react";
import notFound from "./components/img/error-not-found.png";
import Image from "next/image";
function page() {
  return (
    <div className="flex h-screen w-full justify-center items-center flex-col space-y-2">
      <Image width={380} src={notFound} alt="not-found" priority />
      <h1 className="text-3xl font-bold text-[#273137]">PAGE NOT FOUND</h1>
    </div>
  );
}

export default page;

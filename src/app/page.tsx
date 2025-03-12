import Image from "next/image";
import Page from "./userForm/page";

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <Image src="/bluemoon.jpg" alt={""} fill />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Page />
      </div>
    </div>
  );
}

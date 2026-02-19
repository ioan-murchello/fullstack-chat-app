import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import useChatStore from "../store/useChatStore";

import { HiArrowNarrowLeft } from "react-icons/hi";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  return (
    <main className="h-dvh bg-base-200 overflow-hidden flex flex-col">
      <section className="flex-1 flex h-full lg:h-screen w-full items-center justify-center pt-20 lg:pt-2 px-4 overflow-hidden">
        <div className="bg-base-100 p-2 sm:p-4 relative rounded-lg overflow-hidden shadow-cl w-full max-w-6xl h-full lg:h-[calc(100vh-8rem)]">
          <div className="rounded-lg overflow-hidden flex h-full relative">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <Chat />}
          </div>
        </div>
      </section>
    </main>
  );
};
export default HomePage;

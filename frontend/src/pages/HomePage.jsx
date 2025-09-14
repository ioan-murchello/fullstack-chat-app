import Chat from "../components/Chat";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import useChatStore from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <main className="h-screen bg-base-200">
      <section className="flex w-full items-center justify-center pt-20 px-4">
        <div className="bg-base-100 p-4 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="rounded-lg overflow-hidden flex h-full">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <Chat />}
          </div>
        </div>
      </section>
    </main>
  );
};
export default HomePage;

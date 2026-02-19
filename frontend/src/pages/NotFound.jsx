
import { Link } from 'react-router-dom';
import { BiMessageAltError, BiChevronLeft } from 'react-icons/bi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-zinc-700 flex flex-col items-center justify-center p-4 text-white">
      <div 
        
        className="text-center"
      >
        <div 
          className="inline-block mb-6 text-blue-500"
        >
          <BiMessageAltError size={120} />
        </div>

        {/* Error Text */}
        <h1 className="text-8xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Message Undelivered</h2>
        <p className="text-gray-400 max-w-md mb-8">
          It looks like this chat room or page doesn't exist anymore. 
          The user might have deleted it, or the link is expired.
        </p>

        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <BiChevronLeft size={24} />
          Return to Chats
        </Link>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[15%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default NotFound;
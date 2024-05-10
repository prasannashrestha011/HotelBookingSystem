import { Navigate, useNavigate } from "react-router-dom";


function App() {

  const navigate=useNavigate();
  return (
    <>
    <div className="mx-3">
    <h1 className="text-6xl text-purple-400">New York Hotel</h1>
    <button className="text-4xl text-purple-800 bg-black rounded-lg px-2 py-2 hover:bg-purple-800 hover:text-white " onClick={()=>navigate('/login')}>Login</button>
    
    </div>
    </>
  );
}

export default App;

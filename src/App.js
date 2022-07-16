import Navbar from "./components/Navbar";
import Assets from "./components/Assets";
import Market from "./components/Market";

function App() {
  return (
    <div id="app">
        <div id='header'>
            <h1>Nube</h1>
        </div>
        <Market />
        <Navbar />
    </div>
  );
}

export default App;

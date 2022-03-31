import './App.css';
import InfoContainer from './components/InfoContainer';

function App() {
  return (
    <div className="App">
      <h1 style={{ marginLeft: '2%' }}>Covid-19 Dashboard</h1>
      <div className='main-container'>
        <InfoContainer />
      </div>
    </div>
  );
}

export default App;

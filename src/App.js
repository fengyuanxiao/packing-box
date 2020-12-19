import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/home';
import Lists from './pages/lists';


function App() {
  return (
    <Router>
      <div style={{ height: '100%' }}>
        <Route exact path="/" component={Lists} />
        <Route path="/Home" component={Home} />
        {/* <Home/> */}
      </div>
    </Router>
  );
}

export default App;

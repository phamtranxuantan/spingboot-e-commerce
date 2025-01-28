

import "./assets/sass/app.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './layouts/Main';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
function App() {
  return (
   <div>
      <Header/>

      <Main/>

      <Footer/>
   </div>
  );
}

export default App;

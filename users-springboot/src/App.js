import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/sass/app.scss";
import ChatBot from './components/chatbot/ChatBot'; // Import ChatBot
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import Main from './layouts/Main';

function App() {
  return (
   <div>
      <Header/>

      <Main/>

      <ChatBot /> 

      <Footer/>
   </div>
  );
}

export default App;

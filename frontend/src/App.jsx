import { useState } from 'react'
import axios from 'axios'

function App() {
  const [response, setResponse] = useState("")
  
  const sendRequest = async () => {
    try {
      const res = await axios.get("/api/hello");
      setResponse(res.data.message);
    } catch (error) {
      console.error(error);
      setResponse("Ошибка запроса");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Тест</h1>
      <button onClick={sendRequest}>
        Отправить запрос
      </button>
      <p style={{ marginTop: "30px" }}>Ответ сервера:</p>
      <b>{response}</b>
    </div>
  )
}

export default App

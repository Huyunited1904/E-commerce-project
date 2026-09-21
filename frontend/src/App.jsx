import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/health");
        const data = await response.json();

        setMessage(data.message);
      } catch (error) {
        console.error(error);
        setMessage("Cannot connect to backend");
      }
    };

    checkBackend();
  }, []);

  return (
    <main>
      <h1>E-commerce Project</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;
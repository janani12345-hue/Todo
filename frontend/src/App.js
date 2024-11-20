import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [fruits, setFruits] = useState([]);
  const [item, setItem] = useState("");

  // Handle input changes
  function handleChange(evt) {
    setItem(evt.target.value);
  }

  // Fetch data from the backend on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/getdata").then((response) => {
      setFruits(response.data);
    });
  }, []);

  // Add new fruit
  function add() {
    axios.post("http://localhost:5000/postdata", { newfruit: item }).then(() => {
      axios.get("http://localhost:5000/getdata").then((response) => {
        setFruits(response.data); // Refresh list with updated data
      });
    });
  }

  // Delete a fruit by _id
  function handleDelete(removeId) {
    axios
      .delete(`http://localhost:5000/delete/${removeId}`)
      .then(() => {
        setFruits(fruits.filter((fruit) => fruit._id !== removeId));
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  }

  return (
    <div>
      <h1>Todolist</h1>
      <input
        placeholder="Enter fruit name"
        value={item}
        onChange={handleChange}
      />
      <button onClick={add}>Add</button>
      <div>
        {fruits.map((fruit) => (
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px" }}
            key={fruit._id}
          >
            <p style={{ marginRight: "10px" }}>{fruit.name}</p>
            <button onClick={() => handleDelete(fruit._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

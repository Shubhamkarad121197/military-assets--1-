import { useState } from "react";
import axios from "axios";

export default function Purchases() {
  const [equipment, setEquipment] = useState("");
  const [quantity, setQuantity] = useState("");

  const add = async () => {
    const token = localStorage.getItem("token");

    if (!equipment || !quantity) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/purchases",
        {
          base: "Base A",
          equipment,
          quantity: Number(quantity)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Purchase Added Successfully");
      setEquipment("");
      setQuantity("");
    } catch {
      alert("Error saving purchase");
    }
  };

  return (
    <div className="purchase-page">
      <div className="purchase-card">
        <h2>Add Military Purchase</h2>

        <input
          placeholder="Equipment Name"
          value={equipment}
          onChange={e => setEquipment(e.target.value)}
        />

        <input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <button onClick={add}>Save Purchase</button>
      </div>
    </div>
  );
}

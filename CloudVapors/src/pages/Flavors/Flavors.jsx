import React, { useEffect, useState } from "react";
import "./style.css";
import { ChevronRight } from "lucide-react";
import ProductCard from "../../component/ProductCard/ProductCard";
import { app } from "../../firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const Flavors = () => {
  const [flavors, setFlavors] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("All");

  const db = getFirestore(app);

  const Get_Flavors = async () => {
    const collectionRef = collection(db, "flavores");
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFlavors(arr);
  };

  useEffect(() => {
    Get_Flavors();
  }, []);

  const DeviceName = [
    "hayati pro max 6000",
    "Hayati Rubik 7000",
    "Hayati Mini 1500",
    "Crystal Pro CP 10K",
    "All",
  ];

  // Filter flavors based on selected device
  const filteredFlavors =
    selectedDevice === "All"
      ? flavors
      : flavors.filter((item) => item.deviceName === selectedDevice);

  return (
    <div className="flavors-container">
      <div className="flavors-page-top">
        <div className="page-ref">
          <span>Home</span>
          <ChevronRight color="#A4A4A4" />
          <span>Flavors</span>
        </div>
        <div className="fillter">
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            {DeviceName.map((device, i) => (
              <option key={i} value={device}>
                {device}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="all-flavors">
        {filteredFlavors.map((item, i) => (
          <div key={item.id} className="flavor-card">
            <ProductCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flavors;

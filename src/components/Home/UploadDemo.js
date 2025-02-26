import { useState } from "react";
import { storage, db, auth } from "../firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import "./UploadDemo.css";
import CustomAlert from "../CustomAlert"; // Adjust path

export default function UploadDemo({ setDemoId }) {
  const [file, setFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    if (!auth.currentUser) {
      setAlertMessage("Please log in!");
      setShowAlert(true);
      return;
    }
    const demoId = file.name;
    const storageRef = ref(storage, `demos/${demoId}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "demos"), {
        url,
        demoId,
        timestamp: new Date(),
      });
      setDemoId(demoId);
      setAlertMessage(`Demo uploaded successfully!`);
      setShowAlert(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setAlertMessage("Upload failed: " + error.message);
      setShowAlert(true);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Demo</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Demo</button>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

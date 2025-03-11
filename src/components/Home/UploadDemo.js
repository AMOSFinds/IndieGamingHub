import { useState } from "react";
import { storage, db, auth } from "../firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import "./UploadDemo.css";
import CustomAlert from "../CustomAlert"; // Adjust path
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";

export default function UploadDemo({ setDemoId }) {
  const [file, setFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = [".zip", ".html"];
      const fileExtension = `.${selectedFile.name
        .split(".")
        .pop()
        .toLowerCase()}`;
      if (!validExtensions.includes(fileExtension)) {
        setAlertMessage("Please upload a game demo (.zip or .html).");
        setShowAlert(true);
        setFile(null);
      } else {
        setFile(selectedFile);
        setShowAlert(false);
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      setAlertMessage("Please select a valid file!");
      setShowAlert(true);
      return;
    }
    handleUpload(file);
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto my-4 md:my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-teal-400 text-center mb-4">
        Get Human Playtesting Feedback
      </h1>
      <p className="text-sm text-gray-400 text-center">
        Upload your game demo (ZIP or WebGL) and get actionable feedback in 24
        hours.
      </p>
      <br />
      <h2 className="text-2xl text-center text-white mb-4 flex items-center justify-center">
        <FaUpload className="mr-2" /> Upload Your Demo
      </h2>
      <motion.input
        type="file"
        onChange={handleFileChange}
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal focus:outline-none"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />
      <motion.button
        onClick={handleUpload}
        className="bg-teal-500 text-white w-full px-4 py-2 rounded-lg hover:bg-teal-600 active:scale-95 transition-transform duration-100 flex items-center justify-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        Upload Demo
      </motion.button>
      {showAlert && (
        <motion.div
          className="fixed top-4 right-4 bg-gray-800/90 text-white p-4 rounded-lg shadow-lg border-l-4 border-teal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {alertMessage}
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-teal hover:text-teal-hover"
          >
            Close
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

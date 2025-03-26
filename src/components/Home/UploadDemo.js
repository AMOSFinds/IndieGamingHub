import { useState } from "react";
import { storage, db, auth } from "../firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import "./UploadDemo.css";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";

export default function UploadDemo() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = [".mp4", ".mov", ".avi"];
      const fileExtension = `.${selectedFile.name
        .split(".")
        .pop()
        .toLowerCase()}`;
      if (!validExtensions.includes(fileExtension)) {
        alert("Please upload a game demo (.mp4, .mov or .avi).");
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || uploading) {
      alert("Please select a valid file!");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `trailers/${auth.currentUser.uid}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const trailerId = `${auth.currentUser.uid}-${Date.now()}`;
      await setDoc(doc(db, "trailers", trailerId), {
        userId: auth.currentUser.uid,
        uploadedVideoURL: downloadURL,
        status: "processing",
        createdAt: serverTimestamp(),
      });

      alert("Video uploaded! AI is generating your trailer.");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  console.log("handleUpload type before render:", typeof handleUpload);

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
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        className="bg-teal-500 text-white w-full px-4 py-2 rounded-lg hover:bg-teal-600 active:scale-95 transition-transform duration-100 flex items-center justify-center"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Demo"}
      </button>
    </motion.div>
  );
}

import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  padding: 15px 20px;
  background-color: #ffffff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-left: 4px solid #00c4b4;
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-size: 16px;
  animation: slide-in 0.5s ease-out;

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const AlertMessage = styled.div`
  flex: 1;
  padding-right: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #00c4b4;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #00a89a;
  }
`;

const CustomAlert = ({ message, onClose }) => {
  return (
    <AlertContainer>
      <AlertMessage>{message}</AlertMessage>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
    </AlertContainer>
  );
};

export default CustomAlert;

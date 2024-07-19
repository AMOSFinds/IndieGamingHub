import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  padding: 20px;
  background-color: #333;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  animation: slide-in 0.5s forwards;

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
  color: #ffd23f;
  cursor: pointer;
  font-size: 1.2rem;
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

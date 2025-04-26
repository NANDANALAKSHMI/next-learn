import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const QuestionDisplay = ({ questionData, currentAnswer, onAnswerSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  if (!questionData) return <div>Loading question...</div>;

  return (
    <div>
     
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-comprehensive-title"
        aria-describedby="modal-comprehensive-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-comprehensive-title" variant="h6" component="h2" mb={2}>
            Comprehensive Paragraph
          </Typography>
          
          <Typography id="modal-comprehensive-description" sx={{ mb: 2 }}>
            {questionData.comprehensiveParagraph || "No comprehensive paragraph available for this question."}
          </Typography>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="secondary" onClick={handleCloseModal} sx={{ backgroundColor: '#1C3141' }}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Button to open modal */}
      <div className="mb-4">
        <button 
          className="bg-[#177A9C] text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={handleOpenModal}
        >
          <span className="inline-block w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center text-sm">i</span>
          Read Comprehensive Paragraph
          <span className="ml-1">▸</span>
        </button>
      </div>

    
      <div className="mb-6">
        <p className="text-lg">
          <span className="font-semibold">{questionData.id}. </span>
          {questionData.question}
        </p>

        {questionData.image && (
          <div className="my-4">
            <img
              src={questionData.image}
              alt="Question visual"
              className="max-w-full h-auto border border-gray-300"
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-gray-500 mb-2">Choose the answer:</p>
        {questionData.options.map((option, index) => (
          <div
            key={index}
            className="flex items-center mt-2 border rounded-lg p-2 bg-white cursor-pointer" 
            style={{
              border: '0.87px solid #CECECE'
            }}
            onClick={() => onAnswerSelect(option.id)}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${currentAnswer === option.id ? "border-4 border-blue-500" : "border-gray-300"}`}>
              {currentAnswer === option.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
            </div>
            <span className="mr-2">{option.label}</span>
            <span>{option.option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;
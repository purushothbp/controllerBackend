const axios = require('axios');
const Question = require('../../models/questions');
const { getRelevantInfo } = require('../../controllers/chat/utils/rahUtils'); // Helper function to get relevant info

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.send(questions);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.askQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    // 1. Retrieve relevant information from the database
    const relevantInfo = await getRelevantInfo(question);

    // 2. Generate a response based on the relevant information
    const answer = generateResponse(question, relevantInfo);

    // 3. Save the new question and answer to the database
    const newQuestion = new Question({ question, answer });
    await newQuestion.save();

    // 4. Send the response
    res.json({ question, answer });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
};

const generateResponse = (question, relevantInfo) => {
  if (relevantInfo.length === 0) {
    return "Sorry, I don't have information on that.";
  }
  
  // Simple example: Concatenate relevant information
  return relevantInfo.map(info => info.answer).join(' ');
};


const Question = require('../../../models/questions');

exports.getRelevantInfo = async (question) => {
  try {
    const keywords = extractKeywords(question);
    
    const relevantInfo = await Question.find({ 
      $or: keywords.map(keyword => ({ question: { $regex: keyword, $options: 'i' } }))
    });

    return relevantInfo;
  } catch (error) {
    console.error('Error retrieving relevant information:', error);
    throw error;
  }
};

const extractKeywords = (question) => {
  return question.split(' ').map(word => word.toLowerCase());
};

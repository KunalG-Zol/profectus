import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateQuestions, submitAnswers } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';

const QuestionsForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { questions, setQuestions, loading, setLoading, setError } = useProjectContext();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await generateQuestions(projectId);
        setQuestions(fetchedQuestions);
      } catch (error) {
        setError(error.message);
        alert('Failed to generate questions: ' + error.message);
      } finally {
        setLoading(false);
        setIsGeneratingQuestions(false);
      }
    };

    fetchQuestions();
  }, [projectId, setQuestions, setLoading, setError]);

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert('Please answer all questions');
      return;
    }

    try {
      setLoading(true);
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, choice]) => ({
        question_id: parseInt(questionId),
        selected_choice: choice,
      }));

      await submitAnswers(projectId, formattedAnswers);
      navigate(`/roadmap/${projectId}`);
    } catch (error) {
      setError(error.message);
      alert('Failed to submit answers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  if (isGeneratingQuestions || loading && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-lg font-semibold font-josefin">Generating questions based on your project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10 p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-4xl font-bold mb-4 font-josefin text-gray-800">Project Questions</h2>
      <p className="mb-8 text-lg text-gray-600">
        Answer these questions to help us tailor a roadmap for your project.
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-blue-700">{answeredCount} of {totalQuestions} answered</span>
          <span className="text-sm font-medium text-blue-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            className="p-6 border border-gray-200 rounded-xl shadow-md transition-shadow hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="font-bold text-xl mb-4 text-gray-800">{question.text}</p>
            <div className="space-y-3">
              {question.choices.map((choice, choiceIndex) => (
                <label
                  key={choiceIndex}
                  htmlFor={`q${question.id}-c${choiceIndex}`}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedAnswers[question.id] === choice
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    id={`q${question.id}-c${choiceIndex}`}
                    name={`question-${question.id}`}
                    value={choice}
                    checked={selectedAnswers[question.id] === choice}
                    onChange={() =>
                      setSelectedAnswers({ ...selectedAnswers, [question.id]: choice })
                    }
                    className="hidden"
                  />
                  <span className={`w-5 h-5 mr-4 rounded-full border-2 flex-shrink-0 ${
                    selectedAnswers[question.id] === choice ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                  } transition-colors duration-300`}></span>
                  <span className="text-gray-700">{choice}</span>
                </label>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-lg shadow-lg hover:shadow-xl disabled:bg-gray-400"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Submitting...' : 'Submit Answers & Generate Roadmap'}
        </motion.button>
      </div>
    </div>
  );
};

export default QuestionsForm;

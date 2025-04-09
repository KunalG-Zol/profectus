import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (isGeneratingQuestions || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Generating questions based on your project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 font-josefin">Project Questions</h2>
      <p className="mb-6 text-gray-700">
        Please answer the following questions about your project to help us generate a detailed roadmap:
      </p>

      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="p-4 border border-gray-300 rounded-md">
            <p className="font-bold mb-3">{question.text}</p>
            <div className="space-y-2">
              {question.choices.map((choice, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${question.id}-c${index}`}
                    name={`question-${question.id}`}
                    value={choice}
                    checked={selectedAnswers[question.id] === choice}
                    onChange={() =>
                      setSelectedAnswers({ ...selectedAnswers, [question.id]: choice })
                    }
                    className="mr-2"
                  />
                  <label htmlFor={`q${question.id}-c${index}`}>{choice}</label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition duration-300 mt-6"
        >
          {loading ? 'Submitting...' : 'Submit Answers & Generate Roadmap'}
        </button>
      </div>
    </div>
  );
};

export default QuestionsForm;
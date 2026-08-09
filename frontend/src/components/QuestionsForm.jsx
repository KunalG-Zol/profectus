import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import { generateQuestions, submitAnswers } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';
import GlowBackdrop from './ui/GlowBackdrop';
import Card from './ui/Card';
import { button } from '../lib/styles';

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

  if (isGeneratingQuestions || (loading && questions.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] app-shell text-white-smoke">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <p className="mt-6 text-lg font-semibold font-josefin">Generating questions based on your project...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-73px)] app-shell text-white-smoke overflow-hidden">
      <GlowBackdrop />
      <div className="relative max-w-4xl mx-auto pt-12 pb-24 px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-k95 mb-3">Project Questions</h2>
          <p className="mb-8 text-lg text-white-smoke/70 font-josefin">
            Answer these questions to help us tailor a roadmap for your project.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-1.5 font-josefin">
            <span className="text-sm font-medium text-orange-400">{answeredCount} of {totalQuestions} answered</span>
            <span className="text-sm font-medium text-orange-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-ink rounded-full h-2.5 border border-white-smoke/10">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-orange-400 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} hover={false} className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <p className="font-bold text-xl mb-4 font-josefin flex items-start gap-2">
                <HelpCircle size={22} className="text-orange-500 shrink-0 mt-0.5" />
                {question.text}
              </p>
              <div className="space-y-3">
                {question.choices.map((choice, choiceIndex) => {
                  const selected = selectedAnswers[question.id] === choice;
                  return (
                    <label
                      key={choiceIndex}
                      htmlFor={`q${question.id}-c${choiceIndex}`}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 font-josefin ${
                        selected
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-white-smoke/10 hover:border-orange-500/40'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`q${question.id}-c${choiceIndex}`}
                        name={`question-${question.id}`}
                        value={choice}
                        checked={selected}
                        onChange={() =>
                          setSelectedAnswers({ ...selectedAnswers, [question.id]: choice })
                        }
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 mr-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                          selected ? 'bg-orange-500 border-orange-500' : 'border-white-smoke/30'
                        }`}
                      >
                        {selected && <CheckCircle2 size={14} className="text-rich-black" strokeWidth={3} />}
                      </span>
                      <span className={selected ? 'text-white-smoke' : 'text-white-smoke/70'}>{choice}</span>
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className={button({ variant: 'primary', size: 'lg', className: 'w-full text-lg' })}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Answers & Generate Roadmap'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsForm;

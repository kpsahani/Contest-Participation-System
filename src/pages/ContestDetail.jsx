import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Timer, Check, X } from 'lucide-react';
import api from '../services/api';

const ContestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [answers, setAnswers] = useState({});

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => api.get(`/contests/${id}/questions`).then((res) => res.data)
  });

  const joinMutation = useMutation({
    mutationFn: () => api.post(`/contests/${id}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries(['contest', id]);
      toast.success('Successfully joined the contest!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to join contest');
    }
  });

  const submitMutation = useMutation({
    mutationFn: (answers) =>
      api.post(`/contests/${id}/submit`, { answers }),
    onSuccess: (data) => {
      toast.success(`Submission successful! Score: ${data.data.score}`);
      // navigate(`/contests/${id}/leaderboard`);
      navigate(`/leaderboard`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit answers');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isParticipant = contest?.participants?.some(
    (p) => p.user === user?.id
  );

  const hasSubmitted = contest?.participants?.some(
    (p) => p.user === user?.id && p.completed
  );

  const handleAnswerSelect = (questionIndex, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionValue
    }));
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      })
    );
    submitMutation.mutate(formattedAnswers);
  };

  const remainingTime = new Date(contest.endDate) - new Date();
  const isContestActive = remainingTime > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      { console.log("contest", contest) }
      <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
      <p className="text-gray-600 mb-6">{contest.description}</p>

        <div className="flex items-center mb-6 text-blue-600">
          <Timer className="w-5 h-5 mr-2" />
          <span>Time Remaining: {Math.ceil(remainingTime / (1000 * 60))} minutes</span>
        </div>

      {!isParticipant && isContestActive && (
        <button
          onClick={() => joinMutation.mutate()}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mb-6"
        >
          Join Contest
        </button>
      )}

      {isParticipant && !hasSubmitted && contest?.questions?.length > 0 && (
        <div className="space-y-8">
          {contest.questions.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {question.questionText}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[question._id] === option.text}
                      onChange={() => handleAnswerSelect(question._id, option.text)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600"
          >
            Submit Answers
          </button>
        </div>
      )}

      {hasSubmitted && (
        <div className="text-center text-lg text-gray-600">
          <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
          You have already submitted your answers.
          Check the leaderboard for results!
        </div>
      )}

      {/* {!isContestActive && (
        <div className="text-center text-lg text-gray-600">
          <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
          This contest has ended.
          Check the leaderboard for results!
        </div>
      )} */}

      {!contest?.questions?.length > 0 && (
        <div className="text-center text-lg text-gray-600">
          <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
          This contest has no questions.
          <br />
          <Link to="/contests" className="text-blue-600 hover:underline">
            Go back to contests page
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContestDetail;

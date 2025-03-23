import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Plus, Minus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
// import ContestQuestions from './ContestQuestions';

const CreateContest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    accessLevel: 'normal',
    maxParticipants: '',
    difficultyLevel: 'intermediate',
    status: 'published',
    tags: [],
    prize: {
      title: '',
      description: '',
      value: '',
      distribution: [{ rank: 1, amount: '', description: '' }]
    },
    rules: [''],
    questions: [
      {
        questionText: '',
        questionType: 'single-select',
        points: 1,
        timeLimit: 0,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]
  });

  const createContestMutation = useMutation({
    mutationFn: (data) => {
      // Transform the data to match API expectations
      const transformedData = {
        ...data,
        questions: data.questions.map(q => ({
          ...q,
          question: q.questionText, // Map questionText to question
          correctAnswer: q.options.findIndex(opt => opt.isCorrect), // Convert isCorrect to index
          options: q.options
        }))
      };
      return api.post('/contests', transformedData);
    },
    onSuccess: () => {
      toast.success('Contest created successfully');
      navigate('/contests');
    },
    onError: (error) => {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        toast.error(apiErrors.map(err => err.message).join('\n'));
      } else {
        toast.error(error.response?.data?.message || 'Failed to create contest');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createContestMutation.mutate(formData);
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          questionType: 'single-select',
          points: 1,
          timeLimit: 0,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const addOption = (questionIndex) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: [...q.options, { text: '', isCorrect: false }]
            }
          : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex 
                  ? { 
                      ...opt, 
                      [field]: field === 'isCorrect' 
                        ? value 
                        : value
                    } 
                  : field === 'isCorrect' && value 
                    ? { ...opt, isCorrect: false } 
                    : opt
              )
            }
          : q
      )
    }));
  };

  const addPrizeDistribution = () => {
    setFormData((prev) => ({
      ...prev,
      prize: {
        ...prev.prize,
        distribution: [
          ...prev.prize.distribution,
          {
            rank: prev.prize.distribution.length + 1,
            amount: '',
            description: ''
          }
        ]
      }
    }));
  };

  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Contest</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Contest Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="input"
              required
            />
            <textarea
              placeholder="Contest Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="input"
              required
            />
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="input"
              required
            />
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="input"
              required
            />
            <select
              value={formData.accessLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accessLevel: e.target.value
                }))
              }
              className="input"
            >
              <option value="normal">Normal</option>
              <option value="vip">VIP</option>
            </select>
            <select
              value={formData.difficultyLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  difficultyLevel: e.target.value
                }))
              }
              className="input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <input
              type="number"
              placeholder="Max Participants"
              value={formData.maxParticipants}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxParticipants: e.target.value
                }))
              }
              className="input"
              min="1"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value.split(',').map((tag) => tag.trim())
                }))
              }
              className="input"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value
                }))
              }
              className="input"
              placeholder="Status"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </section>

        {/* Prize Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Prize Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Prize Title"
              value={formData.prize.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prize: { ...prev.prize, title: e.target.value }
                }))
              }
              className="input"
            />
            <textarea
              placeholder="Prize Description"
              value={formData.prize.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prize: { ...prev.prize, description: e.target.value }
                }))
              }
              className="input"
            />
            <input
              type="number"
              placeholder="Total Prize Value"
              value={formData.prize.value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prize: { ...prev.prize, value: e.target.value }
                }))
              }
              className="input"
              min="0"
            />
            {formData.prize.distribution.map((dist, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="number"
                  placeholder="Amount"
                  value={dist.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prize: {
                        ...prev.prize,
                        distribution: prev.prize.distribution.map((d, i) =>
                          i === index
                            ? { ...d, amount: e.target.value }
                            : d
                        )
                      }
                    }))
                  }
                  className="input"
                  min="0"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={dist.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prize: {
                        ...prev.prize,
                        distribution: prev.prize.distribution.map((d, i) =>
                          i === index
                            ? { ...d, description: e.target.value }
                            : d
                        )
                      }
                    }))
                  }
                  className="input"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addPrizeDistribution}
              className="btn-secondary"
            >
              <Plus className="w-4 h-4" /> Add Prize Distribution
            </button>
          </div>
        </section>

        {/* Rules */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Rules</h2>
          <div className="space-y-2">
            {formData.rules.map((rule, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Rule ${index + 1}`}
                value={rule}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rules: prev.rules.map((r, i) =>
                      i === index ? e.target.value : r
                    )
                  }))
                }
                className="input"
              />
            ))}
            <button type="button" onClick={addRule} className="btn-secondary">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>
        </section>

        {/* Questions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          <div className="space-y-6">
            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        questions: prev.questions.filter((_, i) => i !== qIndex)
                      }))
                    }
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  placeholder="Question Text"
                  value={question.questionText}
                  onChange={(e) =>
                    updateQuestion(qIndex, 'questionText', e.target.value)
                  }
                  className="input"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={question.questionType}
                    onChange={(e) =>
                      updateQuestion(qIndex, 'questionType', e.target.value)
                    }
                    className="input"
                  >
                    <option value="single-select">Single Select</option>
                    <option value="multi-select">Multi Select</option>
                    <option value="true-false">True/False</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Points"
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(qIndex, 'points', e.target.value)
                    }
                    className="input"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Time Limit (seconds)"
                    value={question.timeLimit}
                    onChange={(e) =>
                      updateQuestion(qIndex, 'timeLimit', e.target.value)
                    }
                    className="input"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-4">
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, 'text', e.target.value)
                        }
                        className="input flex-1"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type={
                            question.questionType === 'multi-select'
                              ? 'checkbox'
                              : 'radio'
                          }
                          name={`correct-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={(e) =>
                            updateOption(
                              qIndex,
                              oIndex,
                              'isCorrect',
                              e.target.checked
                            )
                          }
                        />
                        Correct
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            questions: prev.questions.map((q, i) =>
                              i === qIndex
                                ? {
                                    ...q,
                                    options: q.options.filter(
                                      (_, j) => j !== oIndex
                                    )
                                  }
                                : q
                            )
                          }))
                        }
                        className="text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {question.questionType !== 'true-false' && (
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" /> Add Option
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="btn-secondary">
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/contests')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={createContestMutation.isLoading}
          >
            {createContestMutation.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="w-4 h-4" /> Create Contest
              </>
            )}
          </button>
        </div>
      </form>

      {/* <section className="space-y-4">
      <ContestQuestions />
      </section> */}
    </div>
  );
};

export default CreateContest;

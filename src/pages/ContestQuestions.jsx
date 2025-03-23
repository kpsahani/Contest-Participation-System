import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import QuestionForm from '../components/QuestionForm';
import QuestionList from '../components/QuestionList';
import api from '../services/api';

const ContestQuestions = () => {
  const { contestId } = useParams();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['contest-questions', contestId],
    queryFn: () => api.get(`/contests/${contestId}/questions`).then(res => res.data)
  });

  // Create question mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post(`/contests/${contestId}/questions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contest-questions', contestId]);
      toast.success('Question created successfully');
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create question');
    }
  });

  // Update question mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/questions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contest-questions', contestId]);
      toast.success('Question updated successfully');
      setShowForm(false);
      setEditingQuestion(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update question');
    }
  });

  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['contest-questions', contestId]);
      toast.success('Question deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    }
  });

  const handleSubmit = (data) => {
    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(questionId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contest Questions</h1>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setShowForm(!showForm);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showForm ? (
            'Cancel'
          ) : (
            <>
              <Plus size={20} className="mr-2" />
              Add Question
            </>
          )}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          <QuestionForm
            onSubmit={handleSubmit}
            initialData={editingQuestion}
          />
        </div>
      ) : (
        <QuestionList
          questions={questions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showAnswers={true}
        />
      )}
    </div>
  );
};

export default ContestQuestions;

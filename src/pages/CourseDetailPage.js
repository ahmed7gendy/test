import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database, dbRef, get, set } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import './CourseDetailPage.css';

function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [watchedVideos, setWatchedVideos] = useState([]);
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (user) {
        try {
          const courseRef = dbRef(database, `courses/${courseId}`);
          const courseSnapshot = await get(courseRef);
          const courseData = courseSnapshot.val();

          if (courseData) {
            setCourse(courseData);
            setVideos(courseData.videos ? Object.values(courseData.videos) : []);
            if (courseData.questions) {
              const formattedQuestions = Object.entries(courseData.questions).map(([id, q]) => ({
                id,
                question: q.question,
                answers: q.answers ? Object.entries(q.answers) : [],
              }));
              setQuestions(formattedQuestions);
            } else {
              setQuestions([]);
            }
          } else {
            setError('Course not found.');
          }
        } catch (err) {
          setError('Failed to fetch course details. Please try again later.');
        }
      }
    };
    fetchCourseDetails();
  }, [courseId, user]);

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handleVideoEnd = (index) => {
    setWatchedVideos((prev) => [...prev, index]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const userRef = dbRef(database, `users/${user.uid}/results/${courseId}`);
      await set(userRef, {
        selectedAnswers,
        watchedVideos: watchedVideos.length,
      });
      alert('Your answers have been submitted successfully!');
      navigate('/welcome');
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <div className="course-detail-page">
      {error && <p className="error-message">{error}</p>}
      {course ? (
        <div>
          <h1>{course.name}</h1>
          <p>{course.description}</p>

          <div className="videos-section">
            <h2>Course Videos:</h2>
            {videos.length > 0 && questions.length > 0 ? (
              <ul>
                {videos.map((video, index) => (
                  <li key={index}>
                    <video
                      autoPlay
                      muted={false}
                      controls={false}
                      src={video.url}
                      width="600"
                      loop={false}
                      onEnded={() => handleVideoEnd(index)}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="questions-section">
                      <h2>Question {index + 1}:</h2>
                      <div><strong>{questions[index]?.question}</strong></div>
                      <ul>
                        {questions[index]?.answers.map(([key, answer]) => (
                          <li key={key}>
                            <label>
                              <input
                                type="radio"
                                name={`question-${questions[index].id}`}
                                value={key}
                                checked={selectedAnswers[questions[index].id] === key}
                                onChange={() => handleAnswerSelect(questions[index].id, key)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No videos or questions available.</p>
            )}
          </div>

          <div className="navigation-buttons">
            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNextQuestion}>Next</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading course details...</p>
      )}
    </div>
  );
}

export default CourseDetailPage;

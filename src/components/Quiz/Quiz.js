import React, { useState } from "react";
import { Link } from "gatsby";
import { formatQuestionId, getChoiceIndex, getQuestionIndex } from './quizUtilities';
import Question from "./Question";
import questionValidator from './Question/questionValidator';
import "./quiz.scss";

const Quiz = ({ quiz, slug, title }) => {
  const initialState = {
    shouldShowCorrectChoice: false,
    questions: quiz.questions
  };
  // Hooks to maintain state within this Quiz
  const [
    { shouldShowCorrectChoice, questions },
    updateQuizState
  ] = useState(initialState);

  // Handles changing of a question; update state based on which choice(s) the user has selected
  const handleInputChange = ({ currentTarget: fieldset, target }) => {
    // Get the current question and mark the appropriate choices as being selected by the user
    const questionIndex = getQuestionIndex(target);
    const currentQuestion = questions[questionIndex];
    switch (currentQuestion.type) {
      case 'checkbox': {
        // Gets the indices of selected checkboxes
        const selectedIndices = Array.from(
          fieldset.querySelectorAll('input:checked')
        ).map(getChoiceIndex);

        // Updates every choice based on whether or not it is in the list of user-selected choices
        currentQuestion.choices.forEach((choice, index) => {
          choice.isSelected = selectedIndices.includes(index);
        });
        break;
      }
      case 'radio': {
        // Set the selection status of all question choices based on
        // whether or not the user has selected them
        const choiceIndex = getChoiceIndex(target);
        currentQuestion.choices.forEach((choice, index) => {
          choice.isSelected = choiceIndex === index;
        });
        break;
      }
      default: {
        break;
      }
    }
    // Clone the questions array to force a state change
    const updatedQuestions = Array.from(questions);
    // Update the state of the quiz
    updateQuizState({
      shouldShowCorrectChoice: false,
      questions: updatedQuestions
    });
  };

  // Handles the submission of the quiz
  const handleQuizSubmit = () => {
    // Validate every question and update the state of the quiz
    const validatedQuestions = questions.map(questionValidator);
    updateQuizState({
      shouldShowCorrectChoice: true,
      questions: validatedQuestions
    });
  };

  return (
    <div className="Quiz">
      <Link className="Quiz-homeButton" to={slug}>
        Back to lesson
      </Link>
      <h2 className="Quiz-title">{title} - Pre-Read Quiz</h2>
      <div className="Quiz-body">
        {quiz.description}
      </div>
      {/* Iterate over all questions in this Quiz */}
      {
        questions.map((question, questionIndex) => {
          const questionId = formatQuestionId(questionIndex);
          const questionTitle = `Q${questionIndex + 1}: ${question.description}`;
          return (
            <Question
              handleInputChange={handleInputChange}
              key={questionId}
              question={question}
              questionId={questionId}
              questionIndex={questionIndex}
              shouldShowCorrectChoice={shouldShowCorrectChoice}
              title={questionTitle}
            />
          );
        })
      }
      <button
        className="Quiz-submitButton"
        onClick={handleQuizSubmit}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;

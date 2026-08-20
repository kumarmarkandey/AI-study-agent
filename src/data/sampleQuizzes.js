export const INITIAL_QUIZZES = [
  {
    id: 'quiz-1',
    title: 'Machine Learning Fundamentals & Optimization',
    subject: 'Computer Science',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q1',
        question: 'Which problem occurs when a model performs exceptionally well on training data but poorly on unseen test data?',
        options: ['Underfitting', 'Overfitting', 'High Bias', 'Vanishing Gradient'],
        correctAnswerIndex: 1,
        explanation: 'Overfitting occurs when a complex model learns noise and specific details of training data rather than generalizable underlying patterns.'
      },
      {
        id: 'q2',
        question: 'In gradient descent, what happens if the learning rate (alpha) is set too high?',
        options: [
          'The model converges faster to global minimum',
          'The gradient becomes exactly zero',
          'The optimization process may oscillate or diverge',
          'Weights will automatically be set to zero'
        ],
        correctAnswerIndex: 2,
        explanation: 'If the learning rate is excessively large, step sizes overshoot the minimum, causing parameter trajectories to oscillate erratically or diverge to infinity.'
      },
      {
        id: 'q3',
        question: 'True or False: Support Vector Machines (SVM) attempt to maximize the margin between decision boundary and nearest data points.',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: 'SVM is a maximum-margin classifier designed to find the optimal hyper-plane that maximizes geometric distance to nearest data points (support vectors).'
      },
      {
        id: 'q4',
        question: 'What is the activation output of Sigmoid(0)?',
        options: ['0.0', '0.5', '1.0', '-1.0'],
        correctAnswerIndex: 1,
        explanation: 'The Sigmoid function $\\sigma(x) = \\frac{1}{1 + e^{-x}}$. At $x=0$, $\\sigma(0) = \\frac{1}{1 + 1} = 0.5$.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Quantum Physics Quick Check',
    subject: 'Physics',
    timeLimitMinutes: 5,
    questions: [
      {
        id: 'qp1',
        question: 'According to de Broglie\'s hypothesis, what is the wavelength of a particle with momentum p?',
        options: ['λ = h * p', 'λ = h / p', 'λ = p / h', 'λ = h * c / p'],
        correctAnswerIndex: 1,
        explanation: 'De Broglie relationship states $\\lambda = \\frac{h}{p}$, relating matter wave properties to physical momentum.'
      },
      {
        id: 'qp2',
        question: 'What does the square of the absolute wavefunction |Ψ|^2 represent in quantum mechanics?',
        options: [
          'Total energy of the particle',
          'Exact momentum vector',
          'Probability density of finding the particle at position x',
          'Velocity of light in medium'
        ],
        correctAnswerIndex: 2,
        explanation: 'According to Max Born\'s statistical interpretation, $|\\Psi(x,t)|^2$ is the probability density of detecting the particle in a given volume.'
      }
    ]
  }
];

export const INITIAL_QUIZ_RESULTS = [
  {
    id: 'res-1',
    quizId: 'quiz-1',
    quizTitle: 'Machine Learning Fundamentals & Optimization',
    subject: 'Computer Science',
    score: 75,
    totalQuestions: 4,
    correctAnswers: 3,
    completedAt: '2026-08-11T16:00:00Z',
    weakAreas: ['Gradient Descent Hyperparameters'],
    recommendation: 'Review learning rate decay schedules and momentum optimizers.'
  }
];

export interface FormData {
  // Contact & Personal
  name: string;
  gender: 'Male' | 'Female' | 'Prefer not to say' | '';
  age: string;
  city: string;
  whatsapp?: string;
  email?: string;

  // Q1: Profession / Identity
  occupation: string;

  // Q2: Struggling Areas (Multi-select)
  strugglingAreas: string[];

  // Q3: Working hard yet experiencing failure patterns
  patternsOfFailure: 'Yes' | 'No' | '';

  // Q4: Attended Deepanshu Sir's Event earlier
  attendedDeepanshuEvent: 'Yes' | 'No' | '';

  // Q5: Brain fog, tired, lack of motivation/energy
  brainFogTired: 'Yes' | 'No' | '';

  // Q6: Know you have more in you but stopped
  capableMoreNotHappening: 'Yes' | 'No' | '';

  // Q7: Heard of NLP
  heardOfNLP: 'Yes' | 'No' | '';

  // Q8: Attended NLP workshop earlier
  attendedNLPWorkshop: 'Yes' | 'No' | '';

  // Q9: Major obstacle
  majorObstacle: string;
  majorObstacleOther: string;

  // Q10: Investment capacity
  investmentCapacity: string;

  // Optional Note
  personalNotes?: string;
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface FormErrors {
  [key: string]: string;
}

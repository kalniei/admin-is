export interface IQuizOptions {
  id: string;
  optionValue: number;
  optionLabel: string;
  selected: boolean;
}

export interface IQuiz {
  id: number;
  label: string;
  options: IQuizOptions[];
}

export default interface IPage {
  children: JSX.Element | JSX.Element[];
}

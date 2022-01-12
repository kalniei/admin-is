export interface IEmailObject {
  unique_id: number;
  content: string;
  title: string;
}

export default interface IPage {
  children: JSX.Element | JSX.Element[];
}

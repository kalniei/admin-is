export default interface IPage {
  children: JSX.Element | JSX.Element[];
}
export interface IEmailObject {
  unique_id: number;
  content: string;
  title: string;
}
export interface IWorkshopTableObject {
  date: string | Date;
  level: '0' | '1' | '2' | '3' | '4';
  mail: string;
  name: string;
  notes: string;
  paid: string;
  phone: string;
  surname: string;
}

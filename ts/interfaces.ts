export default interface IPage {
  children: JSX.Element | JSX.Element[];
}
export interface IEmailObject {
  unique_id: number;
  content: string;
  title: string;
}
export interface IWorkshopTableObject {
  id: number;
  date: string;
  level: '1' | '2' | '3' | '4';
  mail: string;
  name: string;
  notes: string;
  paid: string;
  phone: string;
  surname: string;
  workshop: string;
}

import { TEventTypes } from "./types";

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

export interface IBasicWorkshopObj {
  unique_id?: number;
  path: string;
  name: string;
  db_table_name: string;
  email_template_id: number;
  day_of_week: string;
  workshop_dates: string[];
  duration: number;
  time: string;
  price_sale?: number;
  price_normal: number;
  price_date: string;
  level: 1 | 2 | 3 | 4;
  additional_info: string;
  is_active: boolean;
}

export interface IEventObj {
  unique_ID?: number;
  title: string | null;
  customClass: TEventTypes;
  date: string | null;
  time: string | null;
  description: string | null;
  place: string | null;
  price: string | null;
  link: string | null;
  linkTitle: string | null;
  aditionalLink: string | null;
}

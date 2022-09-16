import { TEventTypes } from "../ts/types";

type IEventTypeObj = {
  [key in TEventTypes]: string;
};

const EventsObj: IEventTypeObj =  {
  ppi: 'Otwarta Scena',
  workshop: 'Warsztat',
  openmic: 'Open Mic, Experymenty, Stand Up, inne',
  'event-custom': 'Wystep',
}

export default EventsObj;

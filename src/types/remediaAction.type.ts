export type RemediaAction = {
  _id: string;
  occurrence_id: string;
  description_problem: string;
  description_solution: string;
  responsible_id: string[];
  deadline: string;
  five_whys: {
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    why5: string;
  };
  w2h: {
    who: string;
    what: string;
    where: string;
    when: string;
    why: string;
    how: string;
    how_much: string;
  };

  effectiveness: {
    status: string;
    description: string;
  };
  finished: boolean;
};

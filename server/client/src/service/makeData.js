import namor from "namor";

const range = (len) => {
   const arr = [];
   for (let i = 0; i < len; i++) {
      arr.push(i);
   }
   return arr;
};

const newPerson = () => {
   const statusChance = Math.random();
   return {
      id: 1,
      name: namor.generate({ words: 1, numbers: 0 }),
      firstName: namor.generate({ words: 1, numbers: 0 }),
      lastName: namor.generate({ words: 1, numbers: 0 }),
      participants: Math.floor(Math.random() * 30),
      createdAt: "",
      progress: Math.floor(Math.random() * 100),
      running: Math.floor(Math.random() * 30),
      stopped: Math.floor(Math.random() * 30),
      frozen: Math.floor(Math.random() * 30),
   };
};

export default function makeData(...lens) {
   const makeDataLevel = (depth = 0) => {
      const len = lens[depth];
      return range(len).map((d) => {
         return {
            ...newPerson(),
            subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
         };
      });
   };

   return makeDataLevel();
}

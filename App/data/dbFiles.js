export const addDetails = ({ db }, date, description, income, expense) => {
  console.log(date, description, income, expense);

  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists TrackItTable (id integer primary key not null, Date text, Description text, Income int,Expense int);",
      []
    );
    tx.executeSql(
      "insert into TrackItTable (Date, Description, Income,Expense) values (?,?,?,?)",
      [date, description, income, expense]
    );
  });
};

export const getDetails = async ({ db }) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from TrackItTable",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(error)
      );
    });
  });
  return promise;
};

export const getPrimaryDetails = ({ db }) => {
  let result;
  db.transaction((tx) => {
    tx.executeSql(
      "select SUM(Income)-SUM(Expense) AS Balance,SUM(Income),SUM(Expense) from TrackItTable",
      [],
      (_, { rows: { item } }) => {
        result = item(0);
      },
      () => console.log("error fetching")
    );
  });
  return result;
};

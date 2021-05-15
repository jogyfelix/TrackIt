export const addDetails = async (
  { db },
  date,
  description,
  income,
  expense
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists TrackItTable (id integer primary key not null, Date text, Description text, Income int,Expense int);",
        []
      );
      tx.executeSql(
        "insert into TrackItTable (Date, Description, Income,Expense) values (?,?,?,?)",
        [date, description, income, expense],
        () => {
          resolve("Saved");
        },
        (_, error) => reject(error)
      );
    });
  });
  return promise;
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

export const getPrimaryDetails = async ({ db }) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select SUM(Income)-SUM(Expense) AS Balance,SUM(Income) AS Income,SUM(Expense) AS Expense from TrackItTable",
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

export const removeData = async ({ db }, id, desc) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from TrackItTable where id=? and Description=?",
        [id, desc],
        () => {
          resolve("Removed");
        },
        (_, error) => reject(error)
      );
    });
  });
  return promise;
};

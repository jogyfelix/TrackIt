export const addDetails = ({ db }, date, description, income, expense) => {
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

export const getDetails = ({ db }) => {
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

export const removeData = ({ db }, id, desc) => {
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

export const updateData = ({ db }, id, desc, date, income, expense) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "update TrackItTable set Date=?,Description=?,Expense=?,Income=? where id = ?",
        [date, desc, expense, income, id],
        () => {
          resolve("Updated");
        },
        (_, error) => reject(error)
      );
    });
  });
  return promise;
};

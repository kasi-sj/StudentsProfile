const { ReturnDocument } = require("mongodb");

async function listDBS(client) {
  const list = await client.db().admin().listDatabases();
  list.databases.forEach((element) => {
    console.log(element);
  });
}

async function insertOne(client,table,data) {
  const results = await client
    .db("kasi")
    .collection(table)
    .insertOne(data);
  return results;
}

async function insertMany(client,table, data) {
  const results = await client
    .db("kasi")
    .collection(table)
    .insertMany(data);
  return results;
}

async function findOne(client,table,query) {
  const result = await client
    .db("kasi")
    .collection(table)
    .findOne(query);
  return result;
}

async function findMany(client,table,query) {
  const cursor = await client.db("kasi").collection(table).find(query);
  const results = await cursor.toArray();
  return results;
}

async function updateOne(client,table,query,data) {
  //can also use upsert => create if not exist
  const result = await client
    .db("kasi")
    .collection(table)
    .updateOne(
      query,
     {$set : data},
     {upsert : true}
    );
    return result;
}
async function updateMany(client,table,query,data) {
  //can also use upsert => create if not exist
  const result = await client
    .db("kasi")
    .collection(table)
    .updateMany(
      query,
      {$set : data}
    );
   return result;
}

async function deleteOne(client,table, query) {
  const result = await client
    .db("kasi")
    .collection(table)
    .deleteOne(query);
  return result;
}

async function deleteMany(client,table,query) {
  const result = await client
    .db("kasi")
    .collection(table)
    .deleteMany(query);
  return result;
}
module.exports = {
    listDBS : listDBS,
    findOne : findOne,
    findMany : findMany,
    deleteMany : deleteMany,
    deleteOne : deleteOne,
    updateMany : updateMany,
    updateOne : updateOne,
    insertMany : insertMany,
    insertOne : insertOne
  };
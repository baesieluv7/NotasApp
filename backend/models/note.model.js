const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Notes';

async function createNote(note) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      noteId: note.noteId || new Date().getTime().toString(),
      title: note.title,
      content: note.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  await dynamoDb.put(params).promise();
  console.log('Nota creada:', params.Item);
  return params.Item;
}

async function getNoteById(noteId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      noteId,
    },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
}

async function updateNote(noteId, updatedData) {
  const params = {
    TableName: TABLE_NAME,
    Key: { noteId },
    UpdateExpression: 'set title = :title, content = :content, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':title': updatedData.title,
      ':content': updatedData.content,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'UPDATED_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  console.log('Nota actualizada:', result.Attributes);
  return result.Attributes;
}

async function deleteNote(noteId) {
  const params = {
    TableName: TABLE_NAME,
    Key: { noteId },
  };
  await dynamoDb.delete(params).promise();
  console.log(`Nota con ID ${noteId} eliminada`);
}

async function getAllNotes() {
  const params = {
    TableName: TABLE_NAME,
  };
  const result = await dynamoDb.scan(params).promise();
  return result.Items;
}

module.exports = {
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  getAllNotes,
};
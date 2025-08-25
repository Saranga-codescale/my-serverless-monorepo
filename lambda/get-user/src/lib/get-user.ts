import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent } from 'aws-lambda';

const client = new DynamoDBClient({ region: 'ap-southeast-1' });
const docClient = DynamoDBDocumentClient.from(client);
const USERS_TABLE = process.env.USERS_TABLE || 'sa-users-stg';

export const handler = async (event: APIGatewayEvent) => {
  const userId = event.requestContext?.authorizer?.jwt?.claims?.user_id;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID is required' }),
    };
  }

  try {
    const command = new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    });

    const { Item } = await docClient.send(command);
    console.log('handler ~ Item:', Item);

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found', data: null }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User record found', data: Item }),
    };
  } catch (error) {
    console.error('handler ~ error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

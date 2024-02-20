const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.GAME_TABLE;

exports.handler = async (event) => {
    // Assuming the gameId is passed as a path parameter from API Gateway
    const gameId = event.pathParameters.gameId;

    const params = {
        TableName: tableName,
        Key: {
            'gameId': gameId
        }
    };

    try {
        const response = await dynamoDb.get(params).promise();
        if (response.Item) {
            // Game session found, returning the details
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // This should be restricted to specific domains in production
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(response.Item)
            };
        } else {
            // Game session not found
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Game session not found" })
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
};

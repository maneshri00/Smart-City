import boto3
from botocore.exceptions import ClientError
import time

def create_dynamodb_table():
    """
    Creates the DynamoDB table 'SmartCityIoTReadings' for IoT time-series data.
    Based on AWS Free Tier constraints (5 WCU / 5 RCU).
    """
    # Initialize DynamoDB client
    # Note: Requires AWS credentials configured via aws configure or environment variables
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')

    table_name = 'SmartCityIoTReadings'

    try:
        print(f"Attempting to create table: {table_name}")
        response = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'zone_id',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'timestamp',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'zone_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'timestamp',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            },
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'timestamp-index',
                    'KeySchema': [
                        {
                            'AttributeName': 'timestamp',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ]
        )
        print(f"Creating table {table_name}. Status: {response['TableDescription']['TableStatus']}")
        
        # Wait for the table to exist before modifying TTL
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        print(f"Table {table_name} created successfully.")
        
        # Enable TTL
        print("Enabling TTL on 'expires_at' attribute...")
        # AWS typically takes a moment for the table to be fully active for TTL changes
        time.sleep(5)
        
        dynamodb.update_time_to_live(
            TableName=table_name,
            TimeToLiveSpecification={
                'Enabled': True,
                'AttributeName': 'expires_at'
            }
        )
        print("TTL enabled successfully.")

    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"Table {table_name} already exists.")
        else:
            print(f"Unexpected error: {e}")

if __name__ == '__main__':
    create_dynamodb_table()

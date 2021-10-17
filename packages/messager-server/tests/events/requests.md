MESSAGER_ID=


curl -v \
    -d '{"messagerID": "$MESSAGER_ID", "type": "subscribe", "topic": "one"}' \
    -H "Content-Type: application/json" \
    http://localhost:56865/event?token=__TEST_MODE__


curl -v \
    -d '{"messagerID": "$MESSAGER_ID", "type": "publish", "topic": "one", "data": "two"}' \
    -H "Content-Type: application/json" \
    http://localhost:56865/event?token=__TEST_MODE__

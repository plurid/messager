curl -v \
    -d '{"topic": "one", "data":"two"}' \
    -H "Content-Type: application/json" \
    http://localhost:56865/event?token=__TEST_MODE__

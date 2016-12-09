# LMDB tests

To install :

``docker-compose up lmdb-install``

To write keys/value and to read it from the LMDB database:

1) put istex JSON stringifiez object (one by line) in the sample.jsonstream file

Example of one line:

```
{"corpusName":"wiley","istexId":"9A3EDF969998915CF4B8ABD364DA321A756A1D40","doi":["10.1002/1521-4001(200208)82:8<507::AID-ZAMM507>3.0.CO;2-Y"],"pmid":[],"pii":[]}
```

2) run the writer.js this way

``docker-compose up lmdb-writer``

3) run the reader.js this way

``docker-compose up lmdb-reader``
# istex-ark

[![Docker stars](https://img.shields.io/docker/stars/istex/istex-ark.svg)](https://registry.hub.docker.com/u/istex/istex-ark/)
[![Docker Pulls](https://img.shields.io/docker/pulls/istex/istex-ark.svg)](https://registry.hub.docker.com/u/istex/istex-ark/)

Mapping ARK identifiers to ISTEX internal identifiers (istexid). This web service is used internally in the LoadISTEX workflow.

## Examples

```
GET https://ark.istex.fr/ark:/12345/ABC-123456
```

returns

```javascript
{
  "ark": {
    "value":      "ark:/12345/ABC-123456",
    "naan":       "12345",
    "name":       "ABC-123456",
    "subpub":     "ABC",
    "identifier": "123456"
  },
  "istexId": "128CB89965DA8E531EC59C61102B0678DDEE6BB7"
}
```

```
GET https://ark.istex.fr/128CB89965DA8E531EC59C61102B0678DDEE6BB7
```

returns

```javascript
{
  "ark": {
    "value":      "ark:/12345/ABC-123456",
    "naan":       "12345",
    "name":       "ABC-123456",
    "subpub":     "ABC",
    "identifier": "123456"
  },
  "istexId": "128CB89965DA8E531EC59C61102B0678DDEE6BB7"
}
```

To get all the ARK and ISTEXID stored in the database:

```
GET https://ark.istex.fr/dump
```

returns

```javascript
[
  {
    "istexId":"128CB89965DA8E531EC59C61102B0678DDEE6BB7",
    "ark":"ark:/12345/ABC-123456"
  },
  {
    "istexId":"D05B81D27DEB061B4F7B26DD039414D528C85635",
    "ark":"ark:/123456/6H6-H6LSG993-3"
  }
]
```

To generate a new unique ARK to an ISTEXID:

```
echo '[{"corpusName":"elsevier", "idIstex":"D05B81D27DEB061B4F7B26DD039414D528C85635"}]' | \
  curl --proxy "" -X POST -H "Content-Type: application/json" \
  http://127.0.0.1:3000/ --data @-
```

returns

```
{"D05B81D27DEB061B4F7B26DD039414D528C85635":"ark:/123456/6H6-H6LSG993-3"}
```

## Development

```
make install
make run-debug
```

Web server ready for debugging is available at: http://127.0.0.1:3000

You can test it on these urls:
- http://127.0.0.1:3000/128CB89965DA8E531EC59C61102B0678DDEE6BB7
- http://127.0.0.1:3000/0134F1716893F9118DCE7278BE3333CC40D50461
- http://127.0.0.1:3000/ark:/12345/ABC-123456
- http://127.0.0.1:3000/ark:/12345/XYZ-234567

## Production

Deployment example on vd-istex-li.intra.inist.fr
```
ssh istex@vd-istex-li.intra.inist.fr
mkdir istex-ark/ && cd istex-ark/
wget https://raw.githubusercontent.com/istex/istex-ark/master/docker-compose.yml
NODE_ENV=developement docker-compose up -d

# create a first ARK for example
echo '[{"corpusName":"elsevier", "idIstex":"128CB89965DA8E531EC59C61102B0678DDEE6BB7"}]' | curl --proxy "" -v -X POST -H "Content-Type: application/json" http://vd-istex-li.intra.inist.fr:45446/ --data @-
```

istex-ark is then available at http://vd-istex-li.intra.inist.fr:45446/

**Note**: when `NODE_ENV` environment variable is set to `production`, the
used NAAN is 67375 (Inist's NAAN), otherwise it is 12345 (`developement`).

# Managing data

ISTEX's subpublishers can be manualy updated in this file:
https://github.com/istex/istex-ark/blob/master/dump/istexcorpus-arksubpublisher.json

Redis is used to store ISTEXID and ARKS, these data are very important and are saved on the filesystem on this folder: ``redis-data/``
This folder contains two files:

- appendonly.aof : is the logs of all the updates done on the database
- dump.rdb : is a full binary snapshot of the database
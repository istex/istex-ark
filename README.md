# istex-ark

Mapping ARK identifiers to ISTEX internal identifiers (istexid).

This webservice is temporary cause ARK identifiers will be integrated nativly in the ISTEX API in the future. It is usefull to make a proof of concept about how to associate ARK identifiers to ISTEX identifiers. 

## Examples

```
GET https://ark.istex.fr/ark:/67375/ABC-123456
```

returns

```javascript
{
  "ark": {
    "value":      "ark:/67375/ABC-123456",
    "naan":       "67375",
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
    "value":      "ark:/67375/ABC-123456",
    "naan":       "67375",
    "name":       "ABC-123456",
    "subpub":     "ABC",
    "identifier": "123456"
  },
  "istexId": "128CB89965DA8E531EC59C61102B0678DDEE6BB7"
}
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
- http://127.0.0.1:3000/ark:/67375/ABC-123456
- http://127.0.0.1:3000/ark:/67375/XYZ-234567
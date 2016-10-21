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

## Template Declaration

```html
<div id = "id">
    <p>A</p>
    <h2/>
    <div checked/>
    <h4 style="color:#900;"/>
    张星海
    <h3>Title</h3>
    Hello, {{world}}
    <Video :src="'http://www.google.com/video.mp4'"/>
</div>
```

## DSL

```python

def stream
def stack = []

##
# receives: two chars
# if not <[A-Za-z] nor </ : return True
# else: return False
##
def isNotBeginNorClose
##
# receives: two chars
# if <[A-Za-z]: return True
# else: return False
##
def isTagBegin
##
# receives: two chars
# if </: return True
# else: return False
##
def isTagClose
##
# receives: 
# read to first '>'
# compare the close name to the open name
# if Equals: return True
# else: Throw Error
##
def checkTagname
##
# receives: two chars
# hold the second char.
# read to the first space or '>' or '/>'
# if space: return [tag, False, False]
# else if '>': return [tag, True, False]
# else if '/' and then '>': return [tag, True, True] 
##
def readTagname
##
# receives: tag name
# create an element with tag name.
# and push it into the stack
##
def beginTag
## receives: 
# pop an element
##
def closeTag
## 
# receives: number
# stream.read
##
def readChar
##
# receives:
# read to the first '>'
# check if the tag closed.
# if so: return True
##
def parseProps
##
# receives: two chars
# if the two chars are empty: read to the first non-space and return it.
# elif the first is empty: return the second char.
# elif the first is not empty: return these two chars
##
def skipEmty
##
# receives: two or one chars
# if one char, read one more
# check the two chars if it's the begin or close
# if so, return the two chars
# read and concat the chars and check if it's begin or close
# til meeting the first begin or close, and return it.
##
def readText

def parseInner ():
    while (True) :
        twoChars = readChar(2) ## check <[A-Za-z] || </
        if (isNotBeginNorClose(twoChars)):
            twoChars = parseText(twoChars)
        if (isTagBegin(twoChars)):
            parseTag(twoChars) ## char now is the next char of '>', the end of the tag.
        elif (isTagClose(twoChars)):
            checkTagname() ## if the end corresponding to the begin.
            closeTag()
        else:
            Error

def parseTag (chars):
    [tag, ended, closed] = readTagname(chars)
    beginTag(tag)
    if closed:
        closeTag()
        return
    if not ended:
        closed = parseProps()
        if closed:
            closeTag()
            return
        else:
            parseInner()

def parseText (chars):
    chars = skipEmty(chars)
    lastTwochars = readText(chars)
    return lastTwochars
```

## Convert To Json Description

```json
{
    "tag": "div",
    "type": 1,
    "props": {
        "id": "id"
    },
    "children": [
        {
            "tag": "h3",
            "type": 1,
            "props": {
            },
            "children": [
                "Title"
            ]
        },
        "Hello,",
        {
            "tag": "Text",
            "type": 2,
            "props": {
                ":value": "world"
            }
        },
        {
            "tag": "Video",
            "type": 2,
            "props": {
                ":src": "'http://www.google.com/video.mp4'"
            }
        }
    ]
}
```